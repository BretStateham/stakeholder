---
title: Role-Based Access Control Implementation
description: Architecture decision record for implementing two-tier RBAC with Microsoft Entra ID and database-level Data Set roles
author: Claude Opus 4.5 and Bret Stateham
ms.date: 2026-02-02
ms.topic: reference
---

## Status

Accepted

## Context

The Stakeholder application requires role-based access control to secure Data Sets and their contents. The application must support:

- **Global system administration** for managing Data Sets and assigning Owners
- **Per-Data Set permissions** allowing different users to have different access levels to different Data Sets
- **Group-based access** enabling teams to share Data Set access without individual assignments
- **Self-service access requests** with administrator approval workflow
- **Frontend permission guards** to show/hide UI based on user roles
- **Backend authorization** to enforce access control on every API request

The vision document specifies a two-tier model: Microsoft Entra ID for global roles and the application database for Data Set-scoped roles.

## Decision Drivers

1. **Alignment with vision document** defining the two-tier RBAC model
2. **Integration with existing auth** via MSAL React and Entra ID
3. **Simplicity** using standard Entra ID app roles where possible
4. **Flexibility** enabling both individual and group-based Data Set membership
5. **Security** with dual authorization checks (frontend for UX, backend for enforcement)
6. **Immediate effect** with role changes taking effect on next request

## Options Considered

### Option 1: Two-Tier Hybrid RBAC (Recommended)

Global SystemAdmin role managed in Entra ID app roles. Data Set-level roles (Owner, Contributor, Reader) stored in application database with support for both user and group principals.

**Strengths:**

- Clear separation: identity provider handles global roles, database handles resource-scoped roles
- Entra ID groups enable team-based access without individual assignments
- SystemAdmin role travels with user's token automatically
- Per-Data Set flexibility without Entra ID administrative overhead
- Follows Microsoft's recommended pattern for custom RBAC

**Weaknesses:**

- Two sources of role truth requires dual-checking on backend
- Group membership requires Graph API calls when token has overage
- More complex than single-tier approaches

### Option 2: All Roles in Entra ID

Define all roles (SystemAdmin, DataSet-Owner, DataSet-Contributor, DataSet-Reader) as Entra ID app roles with role assignments per user per Data Set.

**Strengths:**

- Single source of truth for all permissions
- No database tables needed for authorization
- Centralized in Azure portal

**Weaknesses:**

- Requires Entra ID admin privileges to assign roles
- Does not scale: cannot have dynamic role names per Data Set
- No self-service for Data Set owners to add members
- App role assignments limited to ~1500 per application

### Option 3: All Roles in Database

Store all roles including system-level admin in the database. Check database on every request.

**Strengths:**

- Single source of truth in application database
- Full application control over role management
- No Entra ID configuration beyond basic authentication

**Weaknesses:**

- Loses benefits of Entra ID global roles in tokens
- Must query database even for system-level checks
- Harder to audit system administrators through Entra ID

## Decision

**Selected: Option 1 - Two-Tier Hybrid RBAC**

### Role Model

| Level | Role | Source | Scope |
|-------|------|--------|-------|
| Global | SystemAdmin | Entra ID app role | Application-wide |
| Data Set | Owner | Database | Per Data Set |
| Data Set | Contributor | Database | Per Data Set |
| Data Set | Reader | Database | Per Data Set |

### Authorization Rules

| Rule | Description |
|------|-------------|
| **SystemAdmin = Total Access** | Users with SystemAdmin Entra role bypass all Data Set-level checks; implicit Owner on every Data Set |
| **Highest Role Wins** | When user has multiple role assignments (individual + groups), the highest role is used |
| **Role Hierarchy** | Owner (3) > Contributor (2) > Reader (1) |

### Permission Matrix

| Action | SystemAdmin | Owner | Contributor | Reader |
|--------|-------------|-------|-------------|--------|
| Create Data Set | ✓ | - | - | - |
| Delete (soft) Data Set | ✓ | - | - | - |
| Assign Data Set Owner | ✓ | - | - | - |
| View Data Set | ✓ | ✓ | ✓ | ✓ |
| Create/Update/Delete entities | ✓ | ✓ | ✓ | - |
| Assign Contributor/Reader | ✓ | ✓ | - | - |

### Design Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Orphan Data Sets | Allowed | SystemAdmin can always assign new Owner |
| Role change timing | Immediate | Take effect on next request (no cache) |
| Self-service access | Request only | Users can request access; admin approves/assigns |
| Data Set deletion | Soft delete | Use `isActive` flag; data preserved |
| Multi-tenant | No | Single Entra ID tenant only |
| Guest users (B2B) | No | Only tenant members |
| Graph API caching | None | Direct API calls; cache later if needed |

### Deferred Decisions

The following capabilities are explicitly deferred from initial implementation:

| Item | Status | Notes |
|------|--------|-------|
| Audit logging | Deferred | Research later for compliance needs |
| Bulk member import | Deferred | Not required for initial release |
| Role expiration | Deferred | Roles remain permanent until explicitly removed |
| Nested group support | Deferred | Use flat group membership initially |
| Email-based invitations | Deferred | May add as future enhancement |
| Fine-grained entity permissions | Deferred | Current model uses Data Set-level granularity |

### Group-Based Access

Data Set membership supports both individual users and Entra ID security groups.

**Principal Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| User | Individual Entra ID user | Specific person access |
| Group | Entra ID security group | Team/department access |

**Authorization Flow:**

1. Check if user has SystemAdmin app role → grant Owner-level access
2. Query all DataSetMember records matching user's OID or any of their group OIDs
3. If no memberships found → deny access (403)
4. Compare all matching roles → select highest
5. Check if highest role meets required permission level

**Group Claims:**

Enable "groups" claim in Entra ID app registration token configuration. For users in >200 groups, the token includes an overage indicator; backend must call Graph API for full group list.

### Access Request Workflow

Users without Data Set access can request it:

1. User views Data Set without access → sees "Access Denied" with request form
2. User selects role (Reader or Contributor) and optional message
3. System creates AccessRequest record with "Pending" status
4. Email notification sent to all SystemAdmins
5. SystemAdmin approves/denies via Admin UI
6. On approval, DataSetMember record created; email sent to requester

## Consequences

### Positive

- Vision document alignment with two-tier model as specified
- Team-based access through Entra ID groups enables scalable permission management
- Self-service access requests reduce administrative burden
- Clear separation of concerns: Entra ID for identity, database for resource access
- Frontend guards improve UX; backend enforcement ensures security

### Negative

- Two authorization sources require dual-checking on every request
- Group overage handling adds complexity for users in many groups
- Graph API permissions required for user/group search and overage handling
- Role name migration required from current `Admin | Editor | Viewer` implementation

### Neutral

- Access request workflow adds email dependency (Microsoft Graph Mail.Send)
- Soft delete for Data Sets preserves data but requires filtered queries

## Implementation Notes

### Role Name Migration

Current implementation uses `Admin | Editor | Viewer`. Update to match vision document:

```typescript
// Before (current)
export type AppRole = "Admin" | "Editor" | "Viewer";

// After (aligned with vision)
export type SystemRole = "SystemAdmin";
export type DataSetRole = "Owner" | "Contributor" | "Reader";
```

**Migration Steps:**

1. Update `useRoles.ts` with new types
2. Update Entra ID app registration: change role value to `SystemAdmin`
3. Update `UserProfile.tsx` role badges

### Prisma Schema

> **Design Note:** String types are used for `principalType`, `role`, `status`, and `requestedRole` fields instead of Prisma enums. While enums provide compile-time type safety and database-level constraints, strings offer flexibility for adding new values without schema migrations. Consider migrating to enums (e.g., `enum DataSetRole { Owner Contributor Reader }`) if stricter type enforcement is preferred.

```prisma
model User {
  id            String   @id @default(uuid())
  entraObjectId String   @unique
  email         String
  displayName   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  createdDataSets    DataSet[]       @relation("CreatedBy")
  assignedMembers    DataSetMember[] @relation("AssignedMembers")
  resolvedRequests   AccessRequest[] @relation("ResolvedRequests")
}

model EntraGroup {
  id            String   @id @default(uuid())
  entraObjectId String   @unique
  displayName   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model DataSet {
  id          String   @id @default(uuid())
  name        String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById String
  createdBy   User     @relation("CreatedBy", fields: [createdById], references: [id])
  
  members        DataSetMember[]
  accessRequests AccessRequest[]
}

model DataSetMember {
  id            String   @id @default(uuid())
  dataSetId     String
  principalId   String
  principalType String   // "User" | "Group"
  role          String   // "Owner" | "Contributor" | "Reader"
  assignedAt    DateTime @default(now())
  assignedById  String?
  
  dataSet       DataSet  @relation(fields: [dataSetId], references: [id], onDelete: Cascade)
  assignedBy    User?    @relation("AssignedMembers", fields: [assignedById], references: [id])
  
  @@unique([dataSetId, principalId])
  @@index([principalId])
  @@index([dataSetId])
}

model AccessRequest {
  id            String   @id @default(uuid())
  dataSetId     String
  requesterId   String
  requesterEmail String
  requestedRole String   // "Contributor" | "Reader"
  message       String?
  status        String   @default("Pending") // "Pending" | "Approved" | "Denied"
  createdAt     DateTime @default(now())
  resolvedAt    DateTime?
  resolvedById  String?
  
  dataSet       DataSet  @relation(fields: [dataSetId], references: [id], onDelete: Cascade)
  resolvedBy    User?    @relation("ResolvedRequests", fields: [resolvedById], references: [id])
  
  @@index([dataSetId])
  @@index([requesterId])
  @@index([status])
}
```

### Backend Middleware Stack

```text
Request → validateToken → loadUser → requireSystemAdmin (or) requireDataSetRole → Route Handler
```

| Middleware | Purpose |
|------------|---------|
| `validateToken` | Verify JWT signature, audience, issuer, expiry |
| `loadUser` | Resolve Entra OID to database User record |
| `requireSystemAdmin` | Check for SystemAdmin in token roles claim |
| `requireDataSetRole` | Check Data Set membership (user + groups) |

### Token Validation

| Claim | Validation |
|-------|------------|
| `aud` | Must match API audience (`api://client-id`) |
| `iss` | Must be specific tenant issuer (single-tenant) |
| `exp` | Token must not be expired |
| `nbf` | Token must be valid (not before) |
| `oid` | Extract for user identification |
| `roles` | Extract for SystemAdmin check |
| `groups` | Extract for group-based Data Set authorization |
| `_claim_names` | Check for group overage indicator |

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `ProtectedRoute` | Route-level auth guard; redirects unauthenticated users |
| `RoleGuard` | Component-level guard for SystemAdmin-only UI |
| `DataSetRoleGuard` | Component-level guard based on Data Set role |
| `AccessDenied` | Shown when user lacks access; includes request form |
| `PrincipalSearchCombobox` | Graph API-backed user/group search |

### Admin UI Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/admin/datasets` | SystemAdmin | List/create/archive Data Sets |
| `/admin/datasets/:id` | SystemAdmin | View Data Set details, all members |
| `/admin/access-requests` | SystemAdmin | Approve/deny pending requests |
| `/datasets/:id/settings/members` | Owner | Manage Data Set members |

### Microsoft Graph API Permissions

| Permission | Type | Purpose |
|------------|------|---------|
| `User.Read.All` | Application | Search users by email/name |
| `Group.Read.All` | Application | Search groups by name |
| `GroupMember.Read.All` | Application | Check group membership (overage) |
| `Mail.Send` | Application | Send access request notifications |
> **Note:** Application-type permissions require Azure AD admin consent. The `Mail.Send` permission with Application type requires a configured sender mailbox (either a shared mailbox or a mailbox the service principal has access to). Ensure these configurations are complete during Azure AD setup.
### Entra ID Configuration

Add app role to manifest:

```json
{
  "appRoles": [
    {
      "allowedMemberTypes": ["User"],
      "displayName": "System Administrator",
      "id": "generate-new-guid",
      "isEnabled": true,
      "description": "Global system administrator with full access to all Data Sets",
      "value": "SystemAdmin"
    }
  ]
}
```

> **Note:** Generate a unique GUID for the `id` field using:
> - Linux/macOS: `uuidgen`
> - PowerShell: `[guid]::NewGuid()`
> - Online: [guidgenerator.com](https://www.guidgenerator.com/)

Enable groups claim in Token Configuration:

1. Navigate to App Registration → Token configuration
2. Add optional claim → "groups"
3. Select "Security groups"

## Related Decisions

- [SPA Framework Selection](2026-02-02-spa-framework-selection-v01.md) - React 18+ with TypeScript and MSAL
- [Data Persistence Architecture](2026-02-02-data-persistence-architecture-v01.md) - SQLite with Prisma ORM

## References

- [Stakeholder Vision Document](../stakeholder_vision.md) - RBAC model definition
- [Add app roles to your application](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
- [Verify scopes and app roles](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-protected-web-api-verification-scope-app-roles)
- [RBAC for application developers](https://learn.microsoft.com/en-us/entra/identity-platform/custom-rbac-for-developers)
- [Configure group claims](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims)
- [Handle groups overage](https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference#groups-overage-claim)

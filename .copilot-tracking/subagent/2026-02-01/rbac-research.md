# RBAC Implementation Options for Stakeholder Application

## Research Summary

This document provides comprehensive research on Role-Based Access Control (RBAC) implementation options for the Stakeholder application, addressing authentication, authorization, deployment, and local development considerations.

---

## 1. Azure Authentication Options Overview

### 1.1 Microsoft Entra ID (formerly Azure AD)

Microsoft Entra ID is the recommended identity solution for Azure-hosted applications. Key capabilities:

- **Cloud-based identity management**: Handles user authentication without requiring passwords or keys in application code
- **OAuth 2.0/OpenID Connect**: Industry-standard protocols for authentication
- **Managed identities**: Automatic credential lifecycle management for Azure-hosted apps
- **Multi-tenant support**: Can authenticate users from single or multiple organizations

**Pros**:

- Enterprise-grade security with no secrets in code
- Built-in RBAC support through app roles and claims
- Automatic token refresh and credential rotation
- Seamless integration with Azure services
- Single sign-on (SSO) capabilities

**Cons**:

- Requires Microsoft Entra ID tenant
- More complex setup than simple API key authentication
- Learning curve for developers unfamiliar with OAuth flows

### 1.2 Azure App Service Authentication (Easy Auth)

Built-in authentication at the platform layer requiring minimal code changes.

**Key Features**:

- Authentication module runs before application code
- Supports multiple identity providers (Microsoft Entra, Facebook, Google, GitHub, X)
- Configurable via Azure Portal or ARM/Bicep templates
- Automatic HTTPS redirect for security
- Token store for caching access tokens

**Configuration Options**:

- Require authentication for all requests
- Allow anonymous access with optional authentication
- Redirect unauthenticated users to sign-in page (HTTP 302)
- Return HTTP 401/403 for API scenarios

**Pros**:

- No SDK or code changes required
- Platform-managed security updates
- Works with any application framework
- Quick setup through Azure Portal

**Cons**:

- No equivalent local emulator for testing
- Limited customization compared to MSAL
- Requires deployment to App Service for testing

### 1.3 MSAL (Microsoft Authentication Library)

Client-side JavaScript library for SPA authentication with Microsoft Entra ID.

**Available Packages**:

| Framework | Package | NPM |
|-----------|---------|-----|
| React | MSAL React | `@azure/msal-react` |
| Angular | MSAL Angular | `@azure/msal-angular` |
| Vanilla JS | MSAL Browser | `@azure/msal-browser` |

**Authentication Flow**:

1. User clicks sign-in
2. App redirects to Microsoft Entra authorization endpoint
3. User authenticates and consents
4. Microsoft Entra returns authorization code
5. App exchanges code for ID token, access token, and refresh token
6. App uses access token for API calls

**Key Features**:

- Authorization Code Flow with PKCE (most secure for SPAs)
- Silent token acquisition and refresh
- Multi-account support
- Popup or redirect-based authentication

### 1.4 Third-Party Identity Providers

App Service Easy Auth supports additional providers:

- Facebook
- Google
- GitHub
- X (Twitter)
- Any OpenID Connect provider
- Apple (preview)

---

## 2. Application-Level RBAC Implementation Patterns

### 2.1 Microsoft Entra ID Application Roles

**Recommended approach** for Stakeholder application.

**How It Works**:

1. Define app roles in the app registration manifest
2. Assign roles to users or groups in Microsoft Entra admin center
3. Roles appear as claims in the ID token (`roles` claim)
4. Application code checks role claims for authorization

**Defining Roles (App Registration)**:

```json
{
  "appRoles": [
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Admin",
      "id": "guid-for-admin-role",
      "isEnabled": true,
      "description": "Full access to manage stakeholders and application settings",
      "value": "Admin"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Editor",
      "id": "guid-for-editor-role",
      "isEnabled": true,
      "description": "Can view and edit stakeholder data",
      "value": "Editor"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Viewer",
      "id": "guid-for-viewer-role",
      "isEnabled": true,
      "description": "Read-only access to stakeholder data",
      "value": "Viewer"
    }
  ]
}
```

**Mapping to Stakeholder Personas**:

| Persona | App Role | Permissions |
|---------|----------|-------------|
| Decision Maker | Admin | View all, manage settings, admin functions |
| Project Manager | Editor | View and edit stakeholders, manage views |
| Team Member | Viewer or Editor | View stakeholders, add/edit (if Editor) |

### 2.2 Role Verification in SPA

**React Example with MSAL**:

```javascript
import { useMsal } from "@azure/msal-react";

function ProtectedComponent() {
  const { accounts } = useMsal();
  const roles = accounts[0]?.idTokenClaims?.roles || [];
  
  const isAdmin = roles.includes("Admin");
  const isEditor = roles.includes("Editor");
  const canEdit = isAdmin || isEditor;
  
  return (
    <div>
      {canEdit && <EditButton />}
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 2.3 Azure RBAC vs Application Roles

| Aspect | Azure RBAC | Application Roles |
|--------|------------|-------------------|
| Purpose | Control Azure resource access | Control application feature access |
| Scope | Azure subscription/resource level | Application level |
| Management | Azure Portal, CLI, Bicep | Microsoft Entra admin center |
| Use Case | Infrastructure permissions | Application permissions |

**Recommendation**: Use **Application Roles** for Stakeholder app authorization since we're controlling access to application features, not Azure resources.

---

## 3. SPA Integration Patterns

### 3.1 MSAL Configuration

**authConfig.js**:

```javascript
export const msalConfig = {
  auth: {
    clientId: "<Application-Client-ID>",
    authority: "https://login.microsoftonline.com/<Tenant-ID>",
    redirectUri: "http://localhost:3000", // Development
    // redirectUri: "https://app.azurewebsites.net", // Production
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"]
};
```

### 3.2 React Integration

**index.js**:

```javascript
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
```

**Protected Route Component**:

```javascript
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function App() {
  return (
    <>
      <AuthenticatedTemplate>
        <StakeholderDashboard />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
    </>
  );
}
```

### 3.3 Role-Based UI Rendering

```javascript
function useRoles() {
  const { accounts } = useMsal();
  const roles = accounts[0]?.idTokenClaims?.roles || [];
  
  return {
    isAdmin: roles.includes("Admin"),
    isEditor: roles.includes("Editor"),
    isViewer: roles.includes("Viewer"),
    canEdit: roles.includes("Admin") || roles.includes("Editor"),
    canManage: roles.includes("Admin"),
  };
}
```

---

## 4. Bicep Deployment Considerations

### 4.1 App Service with Authentication

**main.bicep**:

```bicep
@description('Web App name')
param webAppName string = 'stakeholder-${uniqueString(resourceGroup().id)}'

@description('Location for resources')
param location string = resourceGroup().location

@description('Microsoft Entra Client ID')
param clientId string

@description('Microsoft Entra Tenant ID')
param tenantId string

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'asp-${webAppName}'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
      ]
    }
    httpsOnly: true
  }
}

// Authentication configuration (Easy Auth)
resource authSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: webApp
  name: 'authsettingsV2'
  properties: {
    globalValidation: {
      requireAuthentication: true
      unauthenticatedClientAction: 'RedirectToLoginPage'
    }
    identityProviders: {
      azureActiveDirectory: {
        enabled: true
        registration: {
          clientId: clientId
          openIdIssuer: 'https://login.microsoftonline.com/${tenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${clientId}'
          ]
        }
      }
    }
    login: {
      tokenStore: {
        enabled: true
      }
    }
  }
}
```

### 4.2 App Registration (Manual Step)

App registration must be created separately in Microsoft Entra admin center or via Microsoft Graph API/CLI:

```bash
# Create app registration
az ad app create \
  --display-name "Stakeholder App" \
  --sign-in-audience "AzureADMyOrg" \
  --web-redirect-uris "https://stakeholder-app.azurewebsites.net/.auth/login/aad/callback"

# Add app roles
az ad app update \
  --id <app-id> \
  --app-roles @approles.json
```

### 4.3 GitHub Actions Integration

**deploy.yml**:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Deploy Bicep
        uses: azure/arm-deploy@v1
        with:
          resourceGroupName: ${{ secrets.AZURE_RG }}
          template: ./bicep/main.bicep
          parameters: >
            clientId=${{ secrets.AZURE_CLIENT_ID }}
            tenantId=${{ secrets.AZURE_TENANT_ID }}
```

---

## 5. Local Development Authentication Patterns

### 5.1 Challenge: No Easy Auth Emulator

App Service Easy Auth has **no local equivalent**. Options for local development:

### 5.2 Option A: MSAL-Only Authentication (Recommended)

Use MSAL.js directly in the SPA for all authentication:

**Advantages**:

- Same code works locally and in production
- Full control over authentication flow
- Easy to test different user scenarios
- No dependency on App Service Easy Auth

**Configuration**:

```javascript
// authConfig.js
const isDevelopment = process.env.NODE_ENV === 'development';

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: isDevelopment 
      ? "http://localhost:3000" 
      : process.env.REACT_APP_REDIRECT_URI,
  }
};
```

### 5.3 Option B: Mock Authentication for Development

Create a development-only auth context that simulates authenticated users:

```javascript
// mockAuth.js
const mockUsers = {
  admin: {
    name: "Admin User",
    email: "admin@contoso.com",
    roles: ["Admin"]
  },
  editor: {
    name: "Project Manager",
    email: "pm@contoso.com", 
    roles: ["Editor"]
  },
  viewer: {
    name: "Team Member",
    email: "member@contoso.com",
    roles: ["Viewer"]
  }
};

// Use via query param: ?mockUser=admin
export function getMockUser() {
  const params = new URLSearchParams(window.location.search);
  const mockUserKey = params.get('mockUser');
  return mockUsers[mockUserKey] || null;
}
```

### 5.4 Option C: Service Principal for Development

For testing against real Microsoft Entra ID locally:

1. Create a separate app registration for development
2. Configure environment variables:

```bash
# .env.local (not committed to git)
AZURE_CLIENT_ID=<dev-app-client-id>
AZURE_TENANT_ID=<tenant-id>
```

3. Add `http://localhost:3000` as a redirect URI in the dev app registration

---

## 6. Cost Implications

### 6.1 Microsoft Entra ID Pricing

| Tier | Cost | Features |
|------|------|----------|
| Free | $0 | Basic authentication, 50,000 MAU |
| P1 | ~$6/user/month | Conditional Access, Group-based assignment |
| P2 | ~$9/user/month | Identity Protection, PIM |

**For Stakeholder App**: Free tier is sufficient for basic authentication with app roles. P1 recommended if using group-based role assignments or conditional access policies.

### 6.2 App Service Pricing

Authentication features (Easy Auth) are **included free** with App Service. No additional cost for enabling authentication.

### 6.3 Development Costs

- No additional licensing for local development
- Same app registration can be used with multiple redirect URIs
- Consider separate dev/staging/prod app registrations for security isolation

---

## 7. Recommendation

### Primary Recommendation: MSAL + Application Roles

**Architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    Stakeholder SPA                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │              MSAL React/Browser                   │   │
│  │  - Sign-in with redirect/popup                   │   │
│  │  - Token acquisition and caching                 │   │
│  │  - Role claims from ID token                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Microsoft Entra ID                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │           App Registration                        │   │
│  │  - Application Roles: Admin, Editor, Viewer      │   │
│  │  - Role assignments to users/groups              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│            Azure App Service (Optional Easy Auth)        │
│  - Additional security layer if needed                  │
│  - Validates tokens at platform level                   │
└─────────────────────────────────────────────────────────┘
```

### Rationale

1. **Consistency**: MSAL provides identical authentication experience locally and in production
2. **Control**: Full control over UI/UX of sign-in experience
3. **Flexibility**: Easy to implement role-based UI rendering
4. **Cost-effective**: Uses free tier features
5. **Modern**: Authorization Code Flow with PKCE is the current security best practice
6. **SPA-optimized**: MSAL.js 2.x is designed specifically for SPAs
7. **Bicep-friendly**: App registration created separately, App Service deployment straightforward

### Implementation Steps

1. **Create Microsoft Entra App Registration**
   - Define Admin, Editor, Viewer app roles
   - Configure redirect URIs for dev and production

2. **Implement MSAL in SPA**
   - Install `@azure/msal-react` (or appropriate package)
   - Configure authentication context
   - Implement sign-in/sign-out flows

3. **Implement Role-Based Authorization**
   - Create role-checking utilities
   - Protect routes and components based on roles
   - Implement role-based data filtering

4. **Deploy with Bicep**
   - Deploy App Service via Bicep
   - Optionally enable Easy Auth for additional security layer

5. **Configure CI/CD**
   - Store client IDs and tenant IDs in GitHub secrets
   - Deploy via GitHub Actions

---

## References

- [Microsoft Entra ID Authentication](https://learn.microsoft.com/en-us/entra/identity-platform/)
- [MSAL.js Documentation](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/about-msal-browser)
- [App Service Authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- [Add App Roles](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
- [Bicep for App Service](https://learn.microsoft.com/en-us/azure/app-service/samples-bicep)
- [React SPA Authentication Tutorial](https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-single-page-app-react-prepare-app)

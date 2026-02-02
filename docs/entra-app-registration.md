# Microsoft Entra ID App Registration Guide

This guide provides step-by-step instructions for registering the Stakeholder application with Microsoft Entra ID (formerly Azure Active Directory).

## Prerequisites

- Access to the Azure Portal with appropriate permissions to create app registrations
- Knowledge of your organization's tenant ID

## Step 1: Navigate to App Registrations

1. Open the [Azure Portal](https://portal.azure.com)
2. Search for **Microsoft Entra ID** in the top search bar
3. Select **Microsoft Entra ID** from the results
4. In the left navigation, select **App registrations**

## Step 2: Register New Application

1. Click **+ New registration**
2. Configure the application:
   - **Name**: `Stakeholder App`
   - **Supported account types**: Select **Accounts in this organizational directory only (Single tenant)**
   - **Redirect URI**: Leave blank for now (we'll configure this in the next step)
3. Click **Register**

## Step 3: Configure Redirect URIs for SPA Platform

1. After registration, go to **Authentication** in the left navigation
2. Click **+ Add a platform**
3. Select **Single-page application**
4. Add the following redirect URIs:
   - `http://localhost:5173` (for local development)
   - `https://{your-production-domain}` (replace with your actual production domain)
5. Under **Implicit grant and hybrid flows**, leave both checkboxes unchecked (MSAL.js 2.x uses PKCE)
6. Click **Configure**

## Step 4: Note Application IDs

After registration, note the following values from the **Overview** page:

| Value | Description | Location |
|-------|-------------|----------|
| **Application (client) ID** | Unique identifier for your app | Overview page |
| **Directory (tenant) ID** | Your organization's tenant ID | Overview page |

These values are needed for the `.env.local` configuration file:

```env
VITE_ENTRA_CLIENT_ID=<Application (client) ID>
VITE_ENTRA_TENANT_ID=<Directory (tenant) ID>
```

## Step 5: Configure App Roles

App roles define the authorization levels within the Stakeholder application.

### Adding App Roles via Manifest

1. In your app registration, select **App roles** from the left navigation
2. Click **+ Create app role**
3. Create the following roles:

#### Admin Role

| Field | Value |
|-------|-------|
| Display name | `Admin` |
| Allowed member types | `Users/Groups` |
| Value | `Admin` |
| Description | `Full access to manage stakeholders and settings` |
| Enable this app role | ✓ Checked |

#### Editor Role

| Field | Value |
|-------|-------|
| Display name | `Editor` |
| Allowed member types | `Users/Groups` |
| Value | `Editor` |
| Description | `Can view and edit stakeholder data` |
| Enable this app role | ✓ Checked |

#### Viewer Role

| Field | Value |
|-------|-------|
| Display name | `Viewer` |
| Allowed member types | `Users/Groups` |
| Value | `Viewer` |
| Description | `Read-only access to stakeholder data` |
| Enable this app role | ✓ Checked |

### Alternative: Configure via Manifest JSON

You can also edit the manifest directly:

1. Select **Manifest** from the left navigation
2. Find the `appRoles` array (it will be empty: `[]`)
3. Replace it with:

```json
{
  "appRoles": [
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Admin",
      "id": "00000000-0000-0000-0000-000000000001",
      "isEnabled": true,
      "description": "Full access to manage stakeholders and settings",
      "value": "Admin"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Editor",
      "id": "00000000-0000-0000-0000-000000000002",
      "isEnabled": true,
      "description": "Can view and edit stakeholder data",
      "value": "Editor"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Viewer",
      "id": "00000000-0000-0000-0000-000000000003",
      "isEnabled": true,
      "description": "Read-only access to stakeholder data",
      "value": "Viewer"
    }
  ]
}
```

4. Click **Save**

> **Note**: If you use auto-generated GUIDs from the Azure Portal UI, replace the placeholder IDs above with the actual generated values.

## Step 6: Assign Users to Roles

1. Navigate to **Microsoft Entra ID** > **Enterprise applications**
2. Find and select **Stakeholder App**
3. Select **Users and groups** from the left navigation
4. Click **+ Add user/group**
5. Select the user(s) or group(s) to assign
6. Select the appropriate role (Admin, Editor, or Viewer)
7. Click **Assign**

## Role Permissions Matrix

| Permission | Admin | Editor | Viewer |
|------------|-------|--------|--------|
| View stakeholder data | ✓ | ✓ | ✓ |
| Edit stakeholder data | ✓ | ✓ | ✗ |
| Manage application settings | ✓ | ✗ | ✗ |
| Manage users and roles | ✓ | ✗ | ✗ |
| Import/Export data | ✓ | ✓ | ✗ |

## Troubleshooting

### Common Issues

**"AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application"**

- Verify the redirect URI in the app registration matches exactly (including trailing slashes)
- For local development, ensure you're using `http://localhost:5173` (not `127.0.0.1`)

**Roles not appearing in token**

- Ensure the user is assigned to a role in Enterprise applications
- Clear browser cache and re-authenticate
- Verify the `roles` claim is being requested in token configuration

**"AADSTS700016: Application with identifier '{client-id}' was not found"**

- Verify the `VITE_ENTRA_CLIENT_ID` in `.env.local` matches the Application (client) ID
- Ensure you're using the correct tenant

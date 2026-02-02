<!-- markdownlint-disable-file -->
# Implementation Details: Stakeholder Application Technology Stack

## Context Reference

Sources:
* [.copilot-tracking/research/2026-02-01-stakeholder-tech-stack-research.md](.copilot-tracking/research/2026-02-01-stakeholder-tech-stack-research.md) - Technology recommendations
* [docs/stakeholder_vision.md](docs/stakeholder_vision.md) - Vision and requirements

> ⚠️ **FILE PRESERVATION NOTICE**: This implementation adds React to an EXISTING folder. The following must be preserved throughout all phases:
> * `docs/` - Vision and documentation
> * `images/` - Brand assets and logos  
> * `.copilot-tracking/` - Planning and research files
> * `stakeholder.code-workspace` - VS Code workspace
> * `.git/` - Git repository history

---

## Implementation Phase 1: Project Foundation

<!-- parallelizable: false -->

### Step 1.1: Initialize React project with Vite and TypeScript in existing folder

Initialize Vite React TypeScript project in the EXISTING workspace folder, preserving all current files and directories.

**IMPORTANT - Files to PRESERVE (do not delete or overwrite):**
* `docs/` - Contains stakeholder_vision.md
* `images/` - Contains logos/ with brand assets
* `.copilot-tracking/` - Contains planning and research files
* `stakeholder.code-workspace` - VS Code workspace configuration
* `.git/` - Git repository

Files Vite will CREATE:
* `package.json` - Vite React TypeScript configuration
* `vite.config.ts` - Vite configuration with React plugin
* `tsconfig.json` - TypeScript configuration
* `tsconfig.node.json` - TypeScript config for Vite
* `tsconfig.app.json` - TypeScript config for app code
* `index.html` - Entry point
* `src/` - Source directory with starter files
* `src/main.tsx` - React entry point
* `src/App.tsx` - Root component
* `src/App.css` - App styles
* `src/index.css` - Global styles
* `src/vite-env.d.ts` - Vite type declarations
* `src/assets/` - Static assets folder
* `.gitignore` - Git ignore patterns (merges with existing)
* `eslint.config.js` - ESLint configuration
* `README.md` - Project readme (will be created, can be merged with existing docs later)

Success criteria:
* `npm run dev` starts development server on localhost:5173
* TypeScript compilation has no errors
* Hot module replacement works
* All existing files in docs/, images/, .copilot-tracking/ remain intact

Commands:
```bash
# Initialize Vite in current directory
npm create vite@latest . -- --template react-ts

# When prompted "Current directory is not empty":
# Select: "Ignore files and continue"

# Then install dependencies
npm install
```

Interactive prompts:
1. "Current directory is not empty. Please choose how to proceed:"
   → Select **"Ignore files and continue"** (preserves existing files)
2. Framework selection is skipped with `--template react-ts`

Dependencies:
* Node.js 20+ installed
* npm available

### Step 1.2: Install core dependencies (React Router, Zustand, TanStack Query)

Install state management and routing libraries following research recommendations.

Files:
* `package.json` - Update with new dependencies

Success criteria:
* All packages install without peer dependency conflicts
* TypeScript types available for all packages

Commands:
```bash
npm install react-router-dom@^6 zustand@^4 @tanstack/react-query@^5
npm install -D @types/node
```

Context references:
* Research file (Lines 98-108) - Key Libraries table

Dependencies:
* Step 1.1 completion

### Step 1.3: Configure shadcn/ui component library

Set up shadcn/ui with Tailwind CSS for consistent, accessible UI components.

Files:
* `tailwind.config.js` - Create Tailwind configuration
* `postcss.config.js` - Create PostCSS configuration
* `src/lib/utils.ts` - Create cn utility function
* `components.json` - Create shadcn/ui configuration

Success criteria:
* Tailwind CSS classes apply correctly
* shadcn/ui CLI can add components
* Base styles render properly

Commands:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
```

Dependencies:
* Step 1.2 completion

### Step 1.4: Set up project folder structure

Create organized folder structure following feature-based architecture from research.

Files:
* `src/components/ui/` - Create shadcn/ui components directory
* `src/components/stakeholder-grid/` - Create AG Grid wrapper directory
* `src/components/relationship-graph/` - Create React Flow wrapper directory
* `src/components/raci-chart/` - Create RACI component directory
* `src/features/people/` - Create people feature directory
* `src/features/teams/` - Create teams feature directory
* `src/features/companies/` - Create companies feature directory
* `src/features/workstreams/` - Create workstreams feature directory
* `src/lib/auth/` - Create MSAL configuration directory
* `src/lib/api/` - Create API client directory
* `src/lib/export/` - Create export utilities directory
* `src/types/` - Create TypeScript interfaces directory

Success criteria:
* All directories exist
* Index files export from each directory

Context references:
* Research file (Lines 67-85) - Project structure

Dependencies:
* Step 1.1 completion

### Step 1.5: Configure Roboto font and base theming

Apply design guidelines with Google Roboto font and brand colors.

Files:
* `src/index.css` - Update with Roboto font import and CSS variables
* `tailwind.config.js` - Update with font family configuration
* `src/App.tsx` - Update with base layout structure
* `public/logos/` - Symlink or copy from existing `images/logos/` (preserve originals)

Success criteria:
* Roboto font loads and applies to all text
* "stakeholder" wordmark uses Roboto Bold
* Brand colors defined as CSS variables
* Logos display correctly

Context references:
* Vision document - Design Guidelines section

Dependencies:
* Step 1.3 completion

---

## Implementation Phase 2: Authentication & Authorization

<!-- parallelizable: false -->

### Step 2.1: Create Microsoft Entra ID app registration

Register application in Azure portal for authentication.

Files:
* `docs/entra-app-registration.md` - Create documentation for app registration steps

Success criteria:
* App registration created in Microsoft Entra ID
* Redirect URIs configured for localhost:5173 and production URL
* Single-page application platform configured
* Application (client) ID noted

Manual steps:
1. Navigate to Azure Portal > Microsoft Entra ID > App registrations
2. Register new application with name "Stakeholder App"
3. Set supported account types (single tenant recommended)
4. Add redirect URIs for SPA platform
5. Note Application (client) ID and Directory (tenant) ID

Dependencies:
* Microsoft Entra ID tenant access

### Step 2.2: Configure App Roles (Admin, Editor, Viewer)

Define application roles matching persona access levels.

Files:
* `docs/entra-app-registration.md` - Update with role configuration

Success criteria:
* Admin role created (full access)
* Editor role created (view and edit)
* Viewer role created (read-only)
* Roles assignable to users/groups

App manifest roles:
```json
{
  "appRoles": [
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Admin",
      "id": "generate-new-guid",
      "isEnabled": true,
      "description": "Full access to manage stakeholders and settings",
      "value": "Admin"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Editor",
      "id": "generate-new-guid",
      "isEnabled": true,
      "description": "Can view and edit stakeholder data",
      "value": "Editor"
    },
    {
      "allowedMemberTypes": ["User"],
      "displayName": "Viewer",
      "id": "generate-new-guid",
      "isEnabled": true,
      "description": "Read-only access to stakeholder data",
      "value": "Viewer"
    }
  ]
}
```

Context references:
* Research file (Lines 195-225) - App Role Definitions

Dependencies:
* Step 2.1 completion

### Step 2.3: Install and configure MSAL React

Install Microsoft Authentication Library and configure for the app registration.

Files:
* `package.json` - Update with MSAL packages
* `src/lib/auth/authConfig.ts` - Create MSAL configuration
* `.env.local` - Create with client ID and tenant ID

Success criteria:
* MSAL packages install successfully
* Auth configuration loads environment variables
* No TypeScript errors in auth configuration

Commands:
```bash
npm install @azure/msal-browser @azure/msal-react
```

Configuration:
```typescript
// src/lib/auth/authConfig.ts
import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
```

Dependencies:
* Step 2.1 completion

### Step 2.4: Implement useRoles hook and AuthProvider

Create React hooks and context for role-based access control.

Files:
* `src/lib/auth/AuthProvider.tsx` - Create MSAL provider wrapper
* `src/lib/auth/useAuth.ts` - Create authentication hook
* `src/lib/auth/useRoles.ts` - Create roles hook
* `src/lib/auth/index.ts` - Create barrel export

Success criteria:
* useAuth returns authentication state and login/logout functions
* useRoles returns role booleans (isAdmin, isEditor, isViewer, canEdit, canManage)
* AuthProvider wraps application with MSAL context

Implementation:
```typescript
// src/lib/auth/useRoles.ts
import { useMsal } from "@azure/msal-react";

export function useRoles() {
  const { accounts } = useMsal();
  const roles = (accounts[0]?.idTokenClaims?.roles as string[]) || [];
  
  return {
    roles,
    isAdmin: roles.includes("Admin"),
    isEditor: roles.includes("Editor"),
    isViewer: roles.includes("Viewer"),
    canEdit: roles.includes("Admin") || roles.includes("Editor"),
    canManage: roles.includes("Admin"),
  };
}
```

Context references:
* Research file (Lines 227-245) - React Hook for Role Checking

Dependencies:
* Step 2.3 completion

### Step 2.5: Build login/logout UI components

Create authentication UI elements for header/navigation.

Files:
* `src/components/auth/LoginButton.tsx` - Create login button component
* `src/components/auth/LogoutButton.tsx` - Create logout button component
* `src/components/auth/UserProfile.tsx` - Create user profile display
* `src/components/auth/index.ts` - Create barrel export

Success criteria:
* Login button triggers MSAL popup or redirect
* Logout button clears session
* User profile shows name and role badges
* Components handle loading and error states

Dependencies:
* Step 2.4 completion

---

## Implementation Phase 3: Database Infrastructure

<!-- parallelizable: true -->

### Step 3.1: Create Bicep template for Azure SQL Database Serverless

Define infrastructure as code for database deployment.

Files:
* `infra/sql-server.bicep` - Create SQL Server Bicep module
* `infra/sql-database.bicep` - Create SQL Database Bicep module
* `infra/main.bicep` - Create main deployment template
* `infra/main.bicepparam` - Create parameters file

Success criteria:
* Bicep templates validate without errors
* Serverless tier configured with auto-pause
* Firewall rules allow Azure services

Bicep configuration:
```bicep
// infra/sql-database.bicep
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: databaseName
  location: location
  sku: {
    name: 'GP_S_Gen5_1'
    tier: 'GeneralPurpose'
  }
  properties: {
    autoPauseDelay: 60
    minCapacity: json('0.5')
    maxSizeBytes: 34359738368 // 32 GB
  }
}
```

Context references:
* Research file (Lines 155-175) - Bicep Deployment

Dependencies:
* Azure subscription access

### Step 3.2: Create Docker Compose for local SQL Server development

Set up local database environment for development.

Files:
* `docker-compose.yml` - Create with SQL Server container
* `.env.docker` - Create with container credentials
* `docs/local-development.md` - Create development setup guide

Success criteria:
* `docker-compose up` starts SQL Server
* Database accessible on localhost:1433
* Persistent volume preserves data

Docker Compose:
```yaml
version: '3.8'
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: stakeholder-sql
    ports:
      - "1433:1433"
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=${SA_PASSWORD:-YourStrong@Passw0rd}
    volumes:
      - sqlserver-data:/var/opt/mssql

volumes:
  sqlserver-data:
```

Context references:
* Research file (Lines 177-185) - Local Development

Dependencies:
* Docker installed

### Step 3.3: Set up ASP.NET Core API project

Create backend API project with EF Core.

Files:
* `api/Stakeholder.Api.csproj` - Create API project file
* `api/Program.cs` - Create minimal API configuration
* `api/appsettings.json` - Create configuration
* `api/appsettings.Development.json` - Create development settings

Success criteria:
* `dotnet run` starts API on localhost:5000
* Swagger UI accessible at /swagger
* Health check endpoint responds

Commands:
```bash
dotnet new webapi -n Stakeholder.Api -o api
cd api
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.Identity.Web
```

Dependencies:
* .NET 8 SDK installed

### Step 3.4: Implement EF Core DbContext with full schema

Create entity classes and DbContext matching vision data fields.

Files:
* `api/Data/StakeholderDbContext.cs` - Create DbContext
* `api/Models/DataSet.cs` - Create DataSet entity
* `api/Models/Company.cs` - Create Company entity
* `api/Models/Workstream.cs` - Create Workstream entity
* `api/Models/Team.cs` - Create Team entity
* `api/Models/Person.cs` - Create Person entity
* `api/Models/PersonTeam.cs` - Create junction entity
* `api/Models/PersonWorkstream.cs` - Create junction entity
* `api/Models/CompanyTeam.cs` - Create junction entity
* `api/Models/InfluenceRelationship.cs` - Create junction entity

Success criteria:
* All entities match vision document data fields
* Navigation properties set up for relationships
* DbContext configures all entities with Fluent API

Entity example:
```csharp
// api/Models/Person.cs
public class Person
{
    public int Id { get; set; }
    public int DataSetId { get; set; }
    public int? ManagerId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? PreferredName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public string? TimeZone { get; set; }
    public string? Title { get; set; }
    public string? Role { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public DataSet DataSet { get; set; } = null!;
    public Person? Manager { get; set; }
    public ICollection<Person> DirectReports { get; set; } = [];
    public ICollection<PersonTeam> PersonTeams { get; set; } = [];
    public ICollection<PersonWorkstream> PersonWorkstreams { get; set; } = [];
    public ICollection<InfluenceRelationship> Influencing { get; set; } = [];
    public ICollection<InfluenceRelationship> InfluencedBy { get; set; } = [];
}
```

Context references:
* Research file (Lines 120-155) - Database Schema
* Vision document - Data Fields section

Dependencies:
* Step 3.3 completion

### Step 3.5: Create initial EF Core migration

Generate and apply database schema.

Files:
* `api/Migrations/` - Create initial migration files

Success criteria:
* Migration generates without errors
* Database update creates all tables
* Foreign key constraints created correctly

Commands:
```bash
cd api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Dependencies:
* Step 3.4 completion
* Step 3.2 completion (for local database)

### Step 3.6: Implement seed data for development

Create sample data for development and testing.

Files:
* `api/Data/SeedData.cs` - Create seed data class
* `api/Data/StakeholderDbContext.cs` - Update to call seeding

Success criteria:
* Sample DataSet with owner information
* Sample Companies, Teams, Workstreams
* Sample People with relationships
* Seed data applied on first run

Dependencies:
* Step 3.5 completion

---

## Implementation Phase 4: API Layer

<!-- parallelizable: false -->

### Step 4.1: Implement RESTful API controllers for all entities

Create controllers with CRUD operations for each entity type.

Files:
* `api/Controllers/DataSetsController.cs` - Create DataSets controller
* `api/Controllers/CompaniesController.cs` - Create Companies controller
* `api/Controllers/WorkstreamsController.cs` - Create Workstreams controller
* `api/Controllers/TeamsController.cs` - Create Teams controller
* `api/Controllers/PeopleController.cs` - Create People controller
* `api/DTOs/` - Create data transfer objects for each entity

Success criteria:
* GET (list), GET (single), POST, PUT, DELETE for each entity
* DTOs prevent over-posting and circular references
* Pagination support for list endpoints
* Include/expand options for related data

Controller pattern:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<PersonDto>>> GetPeople(
        [FromQuery] int dataSetId,
        [FromQuery] bool includeInactive = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        // Implementation
    }
}
```

Context references:
* Vision document - Data Fields section

Dependencies:
* Step 3.4 completion

### Step 4.2: Add authentication middleware with MSAL validation

Configure API to validate tokens from Microsoft Entra ID.

Files:
* `api/Program.cs` - Update with authentication configuration
* `api/appsettings.json` - Update with Entra ID settings

Success criteria:
* Unauthenticated requests return 401
* Valid tokens pass through middleware
* Token claims available in controllers

Configuration:
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
```

Dependencies:
* Step 2.1 completion (app registration)
* Step 4.1 completion

### Step 4.3: Implement role-based authorization policies

Create policies matching frontend roles.

Files:
* `api/Program.cs` - Update with authorization policies
* `api/Controllers/*.cs` - Update controllers with Authorize attributes

Success criteria:
* Admin-only endpoints require Admin role
* Editor endpoints allow Admin or Editor
* Viewer endpoints allow any authenticated user

Policy configuration:
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => 
        policy.RequireRole("Admin"));
    options.AddPolicy("RequireEditor", policy => 
        policy.RequireRole("Admin", "Editor"));
    options.AddPolicy("RequireViewer", policy => 
        policy.RequireRole("Admin", "Editor", "Viewer"));
});
```

Dependencies:
* Step 4.2 completion

### Step 4.4: Add JSON import/export endpoints

Create endpoints for bulk data import and export.

Files:
* `api/Controllers/ImportExportController.cs` - Create import/export controller
* `api/Services/ImportService.cs` - Create import service
* `api/Services/ExportService.cs` - Create export service
* `api/DTOs/ImportExportDto.cs` - Create data transfer objects

Success criteria:
* Export returns complete DataSet as JSON
* Import accepts DataSet JSON and creates/updates records
* Import validates data before committing
* Transaction rollback on import failure

Context references:
* Vision document - JSON import/export use case
* Research file - JSON import/export built-in

Dependencies:
* Step 4.1 completion

### Step 4.5: Configure CORS and API documentation (Swagger)

Enable cross-origin requests and interactive API docs.

Files:
* `api/Program.cs` - Update with CORS and Swagger configuration

Success criteria:
* Frontend can call API from different origin
* Swagger UI available at /swagger
* All endpoints documented with types

Configuration:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://stakeholder.azurestaticapps.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

Dependencies:
* Step 4.1 completion

---

## Implementation Phase 5: Frontend Data Management

<!-- parallelizable: true -->

### Step 5.1: Create API client with TanStack Query

Build type-safe API client with caching and synchronization.

Files:
* `src/lib/api/client.ts` - Create base HTTP client
* `src/lib/api/queries/people.ts` - Create people queries
* `src/lib/api/queries/teams.ts` - Create teams queries
* `src/lib/api/queries/companies.ts` - Create companies queries
* `src/lib/api/queries/workstreams.ts` - Create workstreams queries
* `src/lib/api/queries/dataSets.ts` - Create dataSets queries
* `src/lib/api/index.ts` - Create barrel export

Success criteria:
* Queries fetch data with proper caching
* Mutations update server and invalidate cache
* Loading and error states handled
* TypeScript types match API responses

Query example:
```typescript
// src/lib/api/queries/people.ts
export function usePeople(dataSetId: number, options?: { includeInactive?: boolean }) {
  return useQuery({
    queryKey: ['people', dataSetId, options],
    queryFn: () => api.get<Person[]>(`/api/people?dataSetId=${dataSetId}&includeInactive=${options?.includeInactive ?? false}`),
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (person: CreatePersonDto) => api.post<Person>('/api/people', person),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people'] }),
  });
}
```

Context references:
* Research file (Lines 98-108) - TanStack Query

Dependencies:
* Phase 1 completion

### Step 5.2: Implement Zustand stores for UI state

Create stores for client-side UI state management.

Files:
* `src/lib/stores/viewStore.ts` - Create view configuration store
* `src/lib/stores/filterStore.ts` - Create filter state store
* `src/lib/stores/uiStore.ts` - Create UI state store (sidebar, modals)
* `src/lib/stores/index.ts` - Create barrel export

Success criteria:
* View configurations persist in localStorage
* Filter states synchronized across components
* UI state manages sidebar and modal visibility

Store example:
```typescript
// src/lib/stores/filterStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  includeInactive: boolean;
  selectedDataSetId: number | null;
  toggleInactive: () => void;
  setDataSet: (id: number) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      includeInactive: false,
      selectedDataSetId: null,
      toggleInactive: () => set((state) => ({ includeInactive: !state.includeInactive })),
      setDataSet: (id) => set({ selectedDataSetId: id }),
    }),
    { name: 'stakeholder-filters' }
  )
);
```

Dependencies:
* Phase 1 completion

### Step 5.3: Build TypeScript interfaces for all entities

Create type definitions matching API contracts.

Files:
* `src/types/dataSet.ts` - Create DataSet types
* `src/types/company.ts` - Create Company types
* `src/types/workstream.ts` - Create Workstream types
* `src/types/team.ts` - Create Team types
* `src/types/person.ts` - Create Person types
* `src/types/relationships.ts` - Create relationship types
* `src/types/index.ts` - Create barrel export

Success criteria:
* Types match API DTOs exactly
* Create/Update types for mutations
* Types exported for use throughout app

Type example:
```typescript
// src/types/person.ts
export interface Person {
  id: number;
  dataSetId: number;
  managerId: number | null;
  firstName: string;
  lastName: string;
  preferredName: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  timeZone: string | null;
  title: string | null;
  role: string | null;
  notes: string | null;
  isActive: boolean;
  manager?: Person;
  teams?: Team[];
  workstreams?: Workstream[];
}

export interface CreatePersonDto {
  dataSetId: number;
  managerId?: number;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  location?: string;
  timeZone?: string;
  title?: string;
  role?: string;
  notes?: string;
  isActive?: boolean;
}
```

Dependencies:
* Phase 4 completion (API DTOs defined)

---

## Implementation Phase 6: Stakeholder Tables (AG Grid)

<!-- parallelizable: false -->

### Step 6.1: Install and configure AG Grid Community

Set up AG Grid with React integration and theming.

Files:
* `package.json` - Update with AG Grid packages
* `src/components/stakeholder-grid/GridTheme.tsx` - Create theme configuration
* `src/index.css` - Update with AG Grid styles

Success criteria:
* AG Grid renders with custom theme
* Sorting, filtering enabled by default
* Grid responsive to container size

Commands:
```bash
npm install ag-grid-community ag-grid-react
```

Context references:
* Research file (Lines 98-108) - AG Grid version

Dependencies:
* Phase 5 completion

### Step 6.2: Build People grid with all columns and filters

Create main stakeholder table with full functionality.

Files:
* `src/components/stakeholder-grid/PeopleGrid.tsx` - Create people grid component
* `src/components/stakeholder-grid/columnDefs/peopleColumns.ts` - Create column definitions
* `src/features/people/PeoplePage.tsx` - Create people page

Success criteria:
* All person fields displayed as columns
* Text filtering on name, email, company
* Set filtering on role, time zone
* Boolean filtering on isActive
* Sort on any column

Column definitions:
```typescript
const columnDefs: ColDef<Person>[] = [
  { field: 'firstName', filter: 'agTextColumnFilter', sortable: true },
  { field: 'lastName', filter: 'agTextColumnFilter', sortable: true },
  { field: 'preferredName', filter: 'agTextColumnFilter' },
  { field: 'email', filter: 'agTextColumnFilter' },
  { field: 'phone' },
  { field: 'location', filter: 'agTextColumnFilter' },
  { field: 'timeZone', filter: 'agSetColumnFilter' },
  { field: 'title', filter: 'agTextColumnFilter' },
  { field: 'role', filter: 'agSetColumnFilter' },
  { field: 'isActive', filter: 'agSetColumnFilter' },
];
```

Context references:
* Research file (Lines 88-98) - AG Grid configuration
* Vision document - Use cases for tabular views

Dependencies:
* Step 6.1 completion

### Step 6.3: Build Teams, Companies, Workstreams grids

Create additional entity grids following same pattern.

Files:
* `src/components/stakeholder-grid/TeamsGrid.tsx` - Create teams grid
* `src/components/stakeholder-grid/CompaniesGrid.tsx` - Create companies grid
* `src/components/stakeholder-grid/WorkstreamsGrid.tsx` - Create workstreams grid
* `src/components/stakeholder-grid/columnDefs/teamsColumns.ts` - Create column defs
* `src/components/stakeholder-grid/columnDefs/companiesColumns.ts` - Create column defs
* `src/components/stakeholder-grid/columnDefs/workstreamsColumns.ts` - Create column defs
* `src/features/teams/TeamsPage.tsx` - Create teams page
* `src/features/companies/CompaniesPage.tsx` - Create companies page
* `src/features/workstreams/WorkstreamsPage.tsx` - Create workstreams page

Success criteria:
* Each entity has dedicated grid
* Column definitions match entity fields
* Full filtering and sorting support

Dependencies:
* Step 6.2 completion

### Step 6.4: Implement active/inactive stakeholder toggle

Add global filter for hiding inactive stakeholders.

Files:
* `src/components/ui/ActiveFilter.tsx` - Create toggle component
* `src/components/stakeholder-grid/PeopleGrid.tsx` - Update to use filter

Success criteria:
* Toggle visible in UI header or sidebar
* Default state hides inactive stakeholders
* Toggle affects all grid views
* State persists across sessions

Context references:
* Vision document - Active/inactive filtering use case

Dependencies:
* Step 6.2 completion
* Step 5.2 completion (filter store)

### Step 6.5: Implement CSV export functionality

Add export button and functionality using papaparse.

Files:
* `package.json` - Update with papaparse
* `src/lib/export/csvExport.ts` - Create CSV export utility
* `src/components/stakeholder-grid/ExportButton.tsx` - Create export button

Success criteria:
* Export button visible above grid
* Exports visible columns only
* Respects current filter state
* Downloads file with entity name in filename

Commands:
```bash
npm install papaparse
npm install -D @types/papaparse
```

Export utility:
```typescript
import Papa from 'papaparse';

export function exportToCsv<T>(data: T[], filename: string, columns: string[]) {
  const csv = Papa.unparse(data, {
    columns,
    header: true,
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
```

Context references:
* Vision document - CSV export use case
* Research file (Lines 98-108) - papaparse

Dependencies:
* Step 6.2 completion

### Step 6.6: Build reusable/saveable view configuration

Enable users to save and restore grid configurations.

Files:
* `src/lib/stores/savedViewsStore.ts` - Create saved views store
* `src/components/stakeholder-grid/ViewSelector.tsx` - Create view dropdown
* `src/components/stakeholder-grid/SaveViewDialog.tsx` - Create save dialog

Success criteria:
* Users can save current column order of visibility
* Users can save current filter state
* Saved views persist in localStorage
* Users can switch between saved views
* Default view always available

Context references:
* Vision document - Reusable tabular view use case

Dependencies:
* Step 6.4 completion

---

## Implementation Phase 7: Relationship Visualization (React Flow)

<!-- parallelizable: false -->

### Step 7.1: Install and configure React Flow

Set up React Flow with custom styling.

Files:
* `package.json` - Update with React Flow package
* `src/components/relationship-graph/FlowTheme.tsx` - Create theme configuration
* `src/index.css` - Update with React Flow styles

Success criteria:
* React Flow renders with custom theme
* Pan and zoom controls work
* Minimap available

Commands:
```bash
npm install @xyflow/react
```

Context references:
* Research file (Lines 98-108) - React Flow version

Dependencies:
* Phase 5 completion

### Step 7.2: Build custom node types (Person, Team, Company)

Create styled node components for different entity types.

Files:
* `src/components/relationship-graph/nodes/PersonNode.tsx` - Create person node
* `src/components/relationship-graph/nodes/TeamNode.tsx` - Create team node
* `src/components/relationship-graph/nodes/CompanyNode.tsx` - Create company node
* `src/components/relationship-graph/nodes/index.ts` - Create barrel export

Success criteria:
* Each node type visually distinct
* Nodes display key information (name, title)
* Nodes match brand styling
* Connection handles positioned correctly

Node example:
```typescript
// src/components/relationship-graph/nodes/PersonNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Person } from '@/types';

export function PersonNode({ data }: NodeProps<{ person: Person }>) {
  const { person } = data;
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <Handle type="target" position={Position.Top} />
      <div className="font-bold">{person.preferredName || `${person.firstName} ${person.lastName}`}</div>
      <div className="text-gray-500 text-sm">{person.title}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

Context references:
* Research file (Lines 100-115) - Node types

Dependencies:
* Step 7.1 completion

### Step 7.3: Build custom edge types (ReportsTo, Influences, MemberOf)

Create styled edge components for relationship types.

Files:
* `src/components/relationship-graph/edges/ReportsToEdge.tsx` - Create reports-to edge
* `src/components/relationship-graph/edges/InfluencesEdge.tsx` - Create influence edge
* `src/components/relationship-graph/edges/MemberOfEdge.tsx` - Create member-of edge
* `src/components/relationship-graph/edges/index.ts` - Create barrel export

Success criteria:
* Each edge type visually distinct
* ReportsTo: solid line with hierarchy arrow
* Influences: dashed line with gradient
* MemberOf: dotted line for membership
* Labels available for edge context

Context references:
* Research file (Lines 100-115) - Edge types

Dependencies:
* Step 7.1 completion

### Step 7.4: Implement organizational chart view

Build org chart using reports-to relationships.

Files:
* `src/components/relationship-graph/OrgChart.tsx` - Create org chart component
* `src/lib/graph/orgChartLayout.ts` - Create layout algorithm
* `src/features/people/OrgChartPage.tsx` - Create org chart page

Success criteria:
* Displays hierarchy based on manager relationships
* Auto-layouts nodes in tree structure
* Supports expand/collapse of branches
* Click node to view person details

Layout utility:
```typescript
import dagre from 'dagre';

export function layoutOrgChart(people: Person[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));
  
  people.forEach(p => g.setNode(p.id.toString(), { width: 200, height: 80 }));
  people
    .filter(p => p.managerId)
    .forEach(p => g.setEdge(p.managerId!.toString(), p.id.toString()));
  
  dagre.layout(g);
  
  return people.map(p => {
    const node = g.node(p.id.toString());
    return { id: p.id.toString(), position: { x: node.x, y: node.y }, data: { person: p } };
  });
}
```

Dependencies:
* Step 7.2 completion
* Step 7.3 completion

### Step 7.5: Implement influence relationship graph

Build graph showing influence connections.

Files:
* `src/components/relationship-graph/InfluenceGraph.tsx` - Create influence graph
* `src/lib/graph/influenceLayout.ts` - Create force-directed layout
* `src/features/people/InfluenceGraphPage.tsx` - Create influence page

Success criteria:
* Displays influence relationships as network
* Force-directed layout positions nodes
* Node size or color indicates influence count
* Supports filtering by team or company

Dependencies:
* Step 7.2 completion
* Step 7.3 completion

### Step 7.6: Build graph filtering and display configuration

Add controls for customizing graph display.

Files:
* `src/components/relationship-graph/GraphControls.tsx` - Create control panel
* `src/components/relationship-graph/GraphFilterPanel.tsx` - Create filter panel
* `src/lib/stores/graphConfigStore.ts` - Create graph config store

Success criteria:
* Filter by team, company, workstream
* Toggle relationship types visibility
* Adjust node label detail level
* Save graph configurations

Context references:
* Vision document - Configurable graph view use case

Dependencies:
* Step 7.4 completion
* Step 7.5 completion

---

## Implementation Phase 8: RACI Chart Component

<!-- parallelizable: true -->

### Step 8.1: Design RACI chart data model

Define data structures for RACI matrix.

Files:
* `src/types/raci.ts` - Create RACI type definitions
* `api/Models/RaciAssignment.cs` - Create RACI entity
* `api/Data/StakeholderDbContext.cs` - Update with RACI entity

Success criteria:
* RACI type enum (Responsible, Accountable, Consulted, Informed)
* Assignment links Person to Task/Activity
* Supports multiple assignments per person

Type definitions:
```typescript
export type RaciType = 'R' | 'A' | 'C' | 'I';

export interface RaciActivity {
  id: number;
  dataSetId: number;
  workstreamId?: number;
  name: string;
  description?: string;
}

export interface RaciAssignment {
  id: number;
  activityId: number;
  personId: number;
  raciType: RaciType;
}
```

Dependencies:
* Phase 3 completion

### Step 8.2: Build RACI chart grid component

Create matrix display with people as rows, activities as columns.

Files:
* `src/components/raci-chart/RaciChart.tsx` - Create RACI chart component
* `src/components/raci-chart/RaciCell.tsx` - Create editable cell
* `src/features/workstreams/RaciPage.tsx` - Create RACI page

Success criteria:
* Matrix displays people vs activities
* Cells show RACI letter or empty
* Read-only for Viewer role
* Scrollable for large matrices

Dependencies:
* Step 8.1 completion

### Step 8.3: Implement RACI assignment editing

Enable authorized users to modify RACI cells.

Files:
* `src/components/raci-chart/RaciCell.tsx` - Update with edit mode
* `src/lib/api/queries/raci.ts` - Create RACI mutations
* `api/Controllers/RaciController.cs` - Create RACI API controller

Success criteria:
* Click cell to cycle through R/A/C/I/empty
* Changes save immediately (optimistic update)
* Conflict detection if multiple editors
* Only Admin and Editor roles can edit

Dependencies:
* Step 8.2 completion

### Step 8.4: Add RACI filtering and export

Enable filtering and exporting RACI views.

Files:
* `src/components/raci-chart/RaciFilters.tsx` - Create filter controls
* `src/lib/export/raciExport.ts` - Create RACI export utility

Success criteria:
* Filter by workstream
* Filter by team
* Export to CSV with matrix format
* Save filtered views

Context references:
* Vision document - RACI chart use case

Dependencies:
* Step 8.3 completion

---

## Implementation Phase 9: Data Import/Export

<!-- parallelizable: true -->

### Step 9.1: Build JSON export functionality

Enable full data backup as JSON.

Files:
* `src/lib/export/jsonExport.ts` - Create JSON export utility
* `src/components/ui/ExportDialog.tsx` - Create export dialog

Success criteria:
* Exports complete DataSet with all related entities
* JSON structure matches import format
* Downloads file with timestamp

Export format:
```json
{
  "dataSet": {
    "name": "Project Stakeholders",
    "ownerName": "John Doe",
    "ownerEmail": "john@example.com"
  },
  "companies": [...],
  "workstreams": [...],
  "teams": [...],
  "people": [...],
  "relationships": {
    "companyTeams": [...],
    "personTeams": [...],
    "personWorkstreams": [...],
    "influenceRelationships": [...]
  }
}
```

Context references:
* Vision document - JSON export use case

Dependencies:
* Phase 5 completion

### Step 9.2: Build JSON import with validation

Enable data restore from JSON backup.

Files:
* `src/lib/import/jsonImport.ts` - Create JSON import utility
* `src/lib/import/validators.ts` - Create validation functions
* `src/components/ui/ImportDialog.tsx` - Create import dialog

Success criteria:
* Validates JSON structure before import
* Reports validation errors clearly
* Option to create new DataSet or merge
* Transaction ensures all-or-nothing import

Validation checks:
* Required fields present
* Email format validation
* Reference integrity (managers exist, team references valid)
* Duplicate detection

Dependencies:
* Step 9.1 completion

### Step 9.3: Implement import preview and conflict resolution

Show preview of changes before committing import.

Files:
* `src/components/ui/ImportPreview.tsx` - Create preview component
* `src/components/ui/ConflictResolver.tsx` - Create conflict UI

Success criteria:
* Preview shows entities to be created/updated
* Highlights conflicts with existing data
* User can resolve conflicts before import
* Skip or overwrite options available

Dependencies:
* Step 9.2 completion

---

## Implementation Phase 10: Deployment Infrastructure

<!-- parallelizable: false -->

### Step 10.1: Create Bicep template for Azure Static Web Apps

Define infrastructure for frontend hosting.

Files:
* `infra/static-web-app.bicep` - Create Static Web App module
* `infra/main.bicep` - Update main template

Success criteria:
* Static Web App deploys successfully
* Custom domain support configured
* API integration configured
* SSL/TLS enabled

Bicep configuration:
```bicep
resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: 'centralus' // Limited locations for SWA
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    buildProperties: {
      appLocation: '/'
      apiLocation: 'api'
      outputLocation: 'dist'
    }
  }
}
```

Dependencies:
* Phase 1 completion

### Step 10.2: Configure Bicep parameters for environments (dev, prod)

Create parameter files for different environments.

Files:
* `infra/parameters/dev.bicepparam` - Create dev parameters
* `infra/parameters/prod.bicepparam` - Create prod parameters

Success criteria:
* Dev uses lower SKUs for cost savings
* Prod uses production SKUs
* Naming conventions differentiate environments
* Secrets referenced from Key Vault

Dependencies:
* Step 10.1 completion

### Step 10.3: Create GitHub Actions workflow for CI/CD

Set up automated build and deploy pipeline.

Files:
* `.github/workflows/azure-static-web-apps.yml` - Create SWA workflow
* `.github/workflows/api-deploy.yml` - Create API workflow

Success criteria:
* Builds and deploys on push to main
* PR builds create preview environments
* Runs tests before deploy
* Deploys infrastructure via Bicep

Workflow steps:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install and Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: 'upload'
          app_location: '/'
          output_location: 'dist'
```

Context references:
* Vision document - GitHub Actions requirement
* Research file - Azure Static Web Apps deployment

Dependencies:
* Step 10.1 completion

### Step 10.4: Configure environment secrets and variables

Set up GitHub repository secrets and Azure configuration.

Files:
* `docs/deployment-setup.md` - Create deployment documentation

Success criteria:
* GitHub secrets configured for deployment tokens
* Environment variables for Entra ID configuration
* Azure SQL connection strings in Key Vault
* Documentation for adding new environments

Required secrets:
* `AZURE_STATIC_WEB_APPS_API_TOKEN` - SWA deployment token
* `AZURE_CREDENTIALS` - Service principal for Bicep deployments
* `SQL_CONNECTION_STRING` - Database connection (Key Vault reference)

Dependencies:
* Step 10.3 completion

---

## Implementation Phase 11: Validation

<!-- parallelizable: false -->

### Step 11.1: Run full project validation

Execute all validation commands for the project:
* `npm run lint` - ESLint for frontend
* `npm run build` - Vite production build
* `dotnet format --verify-no-changes` - C# formatting
* `dotnet build` - API compilation
* `npm test` - Frontend unit tests
* `dotnet test` - API unit tests

### Step 11.2: Fix minor validation issues

Iterate on lint errors, build warnings, and test failures. Apply fixes directly when corrections are straightforward and isolated.

### Step 11.3: Report blocking issues

When validation failures require changes beyond minor fixes:
* Document the issues and affected files
* Provide the user with next steps
* Recommend additional research and planning rather than inline fixes
* Avoid large-scale refactoring within this phase

---

## Dependencies

* Node.js 20+
* .NET 8 SDK
* Docker
* Azure CLI
* GitHub CLI

## Success Criteria

* All phases complete without blocking errors
* Application runs locally with full functionality
* Deployment succeeds to Azure
* All use cases from vision document addressed

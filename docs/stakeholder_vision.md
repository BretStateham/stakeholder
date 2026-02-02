# stakeholder Vision

## Vision

"stakeholder" helps all participants across multiple teams, companies and workstreams understand who all of the Stakeholders are, the organizational and influence relationships as well as all of the personal details that help teams work better together.

## Personas

- **Decision Maker** - A person who has the authority to make decisions about projects, budgets, and resources. They need to understand the stakeholders involved to make informed choices, and ensure alignment.

- **Project Manager** - Responsible for planning, executing, and closing projects. They need to identify and manage stakeholders to ensure project success.

- **Team Member** - Individuals working on projects who need to understand who the stakeholders are, their roles, and how to communicate effectively with them.

## Use Cases

- As a Decision Maker I need to be able quickly identify all of the Decision Makers across multiple teams and companies so that I can ensure I'm engaging the right people for approvals, alignment, and risk mitigation.

- As a Project Manager I need to be able to easily identify the time zones and locations of others so I can schedule meetings at convenient times for all stakeholders.

- As a team member I need to be able to add and edit stakeholders so that I can keep the data accurate and up-to-date.

- As a Team Member I need all editable fields to use the appropriate suggested data, input formatatting controls, validations, and constraints

- As a team member I need to be able to flag a stakeholder as inactive so that I can keep the data relevant.

- As a Team Member I need to understand who my peers are across multiple teams, companies and workstreams so that I can collaborate effectively.

- As a Team Member I need to be able to create a re-usable tabular view of stakeholders with customizable columns and filters so that I can know who I need to work with for a given task

- As a Team Member I need to be able to export the data shown in the tabular view to CSV so that I can share it with others or use it in other tools.

- As a Team Member I need to be able to create a re-usable configurable graph view with customizable display properties and filters of stakeholders based on their organizational, influence , and peer relationships so that I can understand how to navigate complex social dynamics.

- As a Team Member I need to be to create a re-usable configurable RACI chart with customizable display properties and filters of stakeholders based on their roles and responsibilities so that I can clarify roles and responsibilities within a project or organization.

- As a Team Member I need to be able to choose to hide (default) or include inactive stakeholders in all views so that I can focus on the most relevant data.

- As a Team Member I need to be able to import and export the stakeholder data as JSON so that I can easily backup the data, or create a new instance with the same data.

## Basic Data Model - Needs to be formalized

The stakeholder app needs to to support one or more Data Sets with the following basic model (to be formalized in an ADR):

Data Set:

- Data Set Name
- Description

Data Set Members (who can access the Data Set):

- User Reference
- Data Set Reference
- Role (Owner, Contributor, Reader)

Each Data Set contains the following entities and relationships:

Companies:

- Company Name
- Website
- Headquarters Location
- Is Active

Workstreams:

- Workstream Name
- Description
- ADO Link
- Is Active

Teams:

- Team Name
- Description
- Is Active

People:

- First Name
- Last Name
- Preferred Name
- Email
- Phone
- Location
- Time Zone
- Title
- Role
- Notes
- Is Active

People Reports To:

- Person Reference
- Manager Person Reference

People Teams:

- Person Reference
- Team Reference

Company Teams:

- Company Reference
- Team Reference

People Companies:

- Person Reference
- Company Reference

People Workstreams:

- Person Reference
- Workstream Reference
- RACI Role (Responsible, Accountable, Consulted, Informed)

Influence Relationships:

- Influencer Person Reference
- Influencee Person Reference

## Role-Based Access Control (RBAC)

The application uses a two-tier RBAC model with global application roles and Data Set-scoped roles.

### Global Application Roles

Global roles are managed in Microsoft Entra ID and control application-wide permissions:

- **System Administrator** - Highest-privilege role. Can create and delete Data Sets, assign Data Set Owners, and manage system configuration. Should be limited to 2-3 trusted users.

### Data Set Roles

Data Set roles are stored in the application database and control access within a specific Data Set:

- **Owner** - Full access to all data within the Data Set. Can assign Contributor and Reader roles to other users. At least one Owner is required per Data Set.

- **Contributor** - Can create, update, and delete all entities within the Data Set. Cannot manage user access or delete the Data Set.

- **Reader** - View-only access to all data within the Data Set. Cannot make any modifications.

### Role Hierarchy

```text
Global Level
└── System Administrator
    └── Can: create/delete Data Sets, assign Data Set Owners, system settings

Data Set Level (per Data Set)
├── Owner
│   └── Can: full CRUD, assign Contributor/Reader roles
├── Contributor
│   └── Can: create, update, delete entities (not roles)
└── Reader
    └── Can: view only
```

### Role Assignment

- System Administrator role is assigned via Microsoft Entra ID app roles
- Data Set Owner is assigned by a System Administrator when creating a Data Set
- Contributor and Reader roles are assigned by a Super Administrator or Data Set Owner via the Data Set Members entity
- System Administrators are automatically granted Owner access to all Data Sets for oversight

## Design Guidelines

- Use the existing logos in the `images/logos` directory for branding.
- Use the Google "Roboto" font for all text elements.
- Use the Google "Roboto Bold" for the "stakeholder" wordmark.
- Clean and intuitive user interface to facilitate easy navigation and data entry.
- Responsive design to ensure usability across various devices and screen sizes.
- Consistent use of colors, fonts, and icons to enhance user experience.

## Technical Requirements

- Single Page Application (SPA) architecture for seamless user experience.
- Deployed as an Azure Web Application
- Must support multi-user access
- Use RBAC for access control and permissions management.
- Can be run locally for development and testing purposes.
- Uses a GitHub repository for version control and collaboration.
- Uses GitHub Issues for tracking bugs and feature requests.
- Uses GitHub Actions for continuous integration and deployment (CI/CD).
- Uses Bicep files for infrastructure as code (IaC) to automate deployment and management of Azure resources.

## Success Criteria

- User Adoption: Measure the number of active users and frequency of use.
- User Satisfaction: Collect feedback through surveys and user interviews to assess satisfaction levels.

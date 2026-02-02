---
applyTo: '.copilot-tracking/changes/2026-02-01-stakeholder-tech-stack-changes.md'
---
<!-- markdownlint-disable-file -->
# Implementation Plan: Stakeholder Application Technology Stack

## Overview

Implement the Stakeholder application using React 18+ with TypeScript, Azure SQL Database Serverless, and Microsoft Entra ID authentication following the recommended architecture from technology stack research.

## Objectives

* Set up React SPA with Vite, TypeScript, and shadcn/ui component library
* Implement AG Grid for stakeholder data tables with filtering and export
* Implement React Flow for organizational and influence relationship graphs
* Configure Azure SQL Database with EF Core and full schema for all entities
* Integrate MSAL React with Microsoft Entra ID App Roles for RBAC
* Deploy via Azure Static Web Apps with Bicep IaC and GitHub Actions CI/CD

## Context Summary

### Project Files

* [docs/stakeholder_vision.md](docs/stakeholder_vision.md) - Vision document with personas, use cases, data fields, and technical requirements
* [images/logos/](images/logos/) - Brand assets for UI theming

### References

* [.copilot-tracking/research/2026-02-01-stakeholder-tech-stack-research.md](.copilot-tracking/research/2026-02-01-stakeholder-tech-stack-research.md) - Technology stack evaluation and recommendations

### Standards References

* #file:../../.github/instructions/csharp.instructions.md - C# conventions for EF Core backend
* #file:../../.github/instructions/bicep.instructions.md - Bicep IaC conventions for Azure deployment

## Implementation Checklist

### [ ] Implementation Phase 1: Project Foundation

<!-- parallelizable: false -->

* [ ] Step 1.1: Initialize React project with Vite and TypeScript
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 21-55)
* [ ] Step 1.2: Install core dependencies (React Router, Zustand, TanStack Query)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 57-85)
* [ ] Step 1.3: Configure shadcn/ui component library
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 87-115)
* [ ] Step 1.4: Set up project folder structure
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 117-155)
* [ ] Step 1.5: Configure Roboto font and base theming
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 157-185)

### [ ] Implementation Phase 2: Authentication & Authorization

<!-- parallelizable: false -->

* [ ] Step 2.1: Create Microsoft Entra ID app registration
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 191-235)
* [ ] Step 2.2: Configure App Roles (Admin, Editor, Viewer)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 237-280)
* [ ] Step 2.3: Install and configure MSAL React
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 282-330)
* [ ] Step 2.4: Implement useRoles hook and AuthProvider
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 332-380)
* [ ] Step 2.5: Build login/logout UI components
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 382-410)

### [ ] Implementation Phase 3: Database Infrastructure

<!-- parallelizable: true -->

* [ ] Step 3.1: Create Bicep template for Azure SQL Database Serverless
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 416-470)
* [ ] Step 3.2: Create Docker Compose for local SQL Server development
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 472-510)
* [ ] Step 3.3: Set up ASP.NET Core API project
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 512-555)
* [ ] Step 3.4: Implement EF Core DbContext with full schema
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 557-650)
* [ ] Step 3.5: Create initial EF Core migration
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 652-680)
* [ ] Step 3.6: Implement seed data for development
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 682-720)

### [ ] Implementation Phase 4: API Layer

<!-- parallelizable: false -->

* [ ] Step 4.1: Implement RESTful API controllers for all entities
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 726-800)
* [ ] Step 4.2: Add authentication middleware with MSAL validation
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 802-840)
* [ ] Step 4.3: Implement role-based authorization policies
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 842-885)
* [ ] Step 4.4: Add JSON import/export endpoints
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 887-930)
* [ ] Step 4.5: Configure CORS and API documentation (Swagger)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 932-960)

### [ ] Implementation Phase 5: Frontend Data Management

<!-- parallelizable: true -->

* [ ] Step 5.1: Create API client with TanStack Query
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 966-1020)
* [ ] Step 5.2: Implement Zustand stores for UI state
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1022-1070)
* [ ] Step 5.3: Build TypeScript interfaces for all entities
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1072-1130)

### [ ] Implementation Phase 6: Stakeholder Tables (AG Grid)

<!-- parallelizable: false -->

* [ ] Step 6.1: Install and configure AG Grid Community
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1136-1175)
* [ ] Step 6.2: Build People grid with all columns and filters
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1177-1240)
* [ ] Step 6.3: Build Teams, Companies, Workstreams grids
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1242-1300)
* [ ] Step 6.4: Implement active/inactive stakeholder toggle
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1302-1340)
* [ ] Step 6.5: Implement CSV export functionality
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1342-1380)
* [ ] Step 6.6: Build reusable/saveable view configuration
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1382-1430)

### [ ] Implementation Phase 7: Relationship Visualization (React Flow)

<!-- parallelizable: false -->

* [ ] Step 7.1: Install and configure React Flow
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1436-1475)
* [ ] Step 7.2: Build custom node types (Person, Team, Company)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1477-1540)
* [ ] Step 7.3: Build custom edge types (ReportsTo, Influences, MemberOf)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1542-1600)
* [ ] Step 7.4: Implement organizational chart view
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1602-1655)
* [ ] Step 7.5: Implement influence relationship graph
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1657-1710)
* [ ] Step 7.6: Build graph filtering and display configuration
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1712-1760)

### [ ] Implementation Phase 8: RACI Chart Component

<!-- parallelizable: true -->

* [ ] Step 8.1: Design RACI chart data model
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1766-1810)
* [ ] Step 8.2: Build RACI chart grid component
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1812-1870)
* [ ] Step 8.3: Implement RACI assignment editing
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1872-1920)
* [ ] Step 8.4: Add RACI filtering and export
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1922-1960)

### [ ] Implementation Phase 9: Data Import/Export

<!-- parallelizable: true -->

* [ ] Step 9.1: Build JSON export functionality
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 1966-2010)
* [ ] Step 9.2: Build JSON import with validation
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2012-2065)
* [ ] Step 9.3: Implement import preview and conflict resolution
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2067-2115)

### [ ] Implementation Phase 10: Deployment Infrastructure

<!-- parallelizable: false -->

* [ ] Step 10.1: Create Bicep template for Azure Static Web Apps
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2121-2175)
* [ ] Step 10.2: Configure Bicep parameters for environments (dev, prod)
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2177-2220)
* [ ] Step 10.3: Create GitHub Actions workflow for CI/CD
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2222-2290)
* [ ] Step 10.4: Configure environment secrets and variables
  * Details: .copilot-tracking/details/2026-02-01-stakeholder-tech-stack-details.md (Lines 2292-2330)

### [ ] Implementation Phase 11: Validation

<!-- parallelizable: false -->

* [ ] Step 11.1: Run full project validation
  * Execute all lint commands (npm run lint, dotnet format)
  * Execute build scripts for frontend and backend
  * Run test suites covering modified code
* [ ] Step 11.2: Fix minor validation issues
  * Iterate on lint errors and build warnings
  * Apply fixes directly when corrections are straightforward
* [ ] Step 11.3: Report blocking issues
  * Document issues requiring additional research
  * Provide user with next steps and recommended planning
  * Avoid large-scale fixes within this phase

## Dependencies

* Node.js 20+ and npm
* .NET 8 SDK
* Docker (for local SQL Server)
* Azure CLI
* GitHub CLI
* Microsoft Entra ID tenant with app registration permissions
* Azure subscription with contributor access

## Success Criteria

* React SPA builds and runs locally with hot reload
* Authentication flow works in local development and Azure deployment
* All entity CRUD operations function through AG Grid interface
* Organizational and influence graphs render correctly in React Flow
* RACI charts display and support editing by authorized users
* JSON import/export roundtrips data without loss
* Active/inactive stakeholder filtering works across all views
* CSV export produces valid files from tabular views
* Bicep deployment creates all Azure resources successfully
* GitHub Actions CI/CD pipeline deploys on main branch push
* Role-based access controls restrict features by user role

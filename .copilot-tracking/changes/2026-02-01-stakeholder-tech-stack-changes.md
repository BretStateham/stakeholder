<!-- markdownlint-disable-file -->
# Release Changes: Stakeholder Application Technology Stack

**Related Plan**: 2026-02-01-stakeholder-tech-stack-plan.instructions.md
**Implementation Date**: 2026-02-01

## Summary

Implementation of Stakeholder application using React 18+ with TypeScript, Azure SQL Database Serverless, and Microsoft Entra ID authentication. Includes AG Grid for data tables, React Flow for relationship graphs, and full Azure deployment infrastructure.

## Changes

### Added

* package.json - Vite React TypeScript project configuration with scripts
* vite.config.ts - Vite bundler configuration with path aliases
* tsconfig.json - TypeScript configuration for React
* tsconfig.node.json - Node-specific TypeScript config for Vite
* tailwind.config.js - Tailwind CSS with shadcn/ui theme configuration
* postcss.config.js - PostCSS configuration for Tailwind
* components.json - shadcn/ui component library configuration
* index.html - Entry HTML with Roboto font loaded
* src/main.tsx - React application entry point
* src/App.tsx - Main App component with base layout
* src/index.css - Tailwind directives and CSS variables
* src/vite-env.d.ts - Vite type declarations
* src/lib/utils.ts - cn() utility function for class merging
* src/components/ui/index.ts - UI components barrel export
* src/components/stakeholder-grid/index.ts - AG Grid wrapper barrel export
* src/components/relationship-graph/index.ts - React Flow wrapper barrel export
* src/components/raci-chart/index.ts - RACI component barrel export
* src/components/auth/index.ts - Auth components barrel export
* src/features/people/index.ts - People feature barrel export
* src/features/teams/index.ts - Teams feature barrel export
* src/features/companies/index.ts - Companies feature barrel export
* src/features/workstreams/index.ts - Workstreams feature barrel export
* src/lib/auth/index.ts - MSAL configuration barrel export
* src/lib/api/index.ts - API client barrel export
* src/lib/api/queries/index.ts - TanStack Query barrel export
* src/lib/export/index.ts - Export utilities barrel export
* src/lib/import/index.ts - Import utilities barrel export
* src/lib/stores/index.ts - Zustand stores barrel export
* src/lib/graph/index.ts - Graph layout utilities barrel export
* src/types/index.ts - TypeScript interfaces barrel export
* src/assets/ - Static assets directory

### Modified

### Removed

## Additional or Deviating Changes

## Release Summary


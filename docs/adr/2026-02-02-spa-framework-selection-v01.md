---
title: SPA Framework Selection for Stakeholder Application
description: Architecture decision record for selecting React 18+ with TypeScript and Vite as the SPA framework
author: Claude Opus 4.5 and Bret Stateham
ms.date: 2026-02-02
ms.topic: reference
---

## Status

Accepted

## Context

The Stakeholder application requires a Single Page Application (SPA) architecture to provide a seamless user experience for managing stakeholder data across teams, companies, and workstreams. The application must support:

- **Tabular views** with customizable columns, filters, and CSV export
- **Graph visualization** for organizational and influence relationships
- **RACI chart views** for role/responsibility clarity
- **Multi-user concurrent access** with role-based permissions
- **Responsive design** across devices
- **Azure Static Web Apps** deployment via Bicep IaC
- **Local development** workflow for testing and iteration

The development team has moderate experience with modern web technologies.

## Decision Drivers

1. **Ecosystem maturity** for data grids and graph visualization components
2. **Azure deployment compatibility** and documentation availability
3. **Developer experience** including TypeScript support and tooling
4. **Long-term maintainability** through community support and talent availability
5. **Build performance** for efficient development iteration

## Options Considered

### Option 1: React 18+ with TypeScript and Vite (Recommended)

**Stack:**

- React 18+ with TypeScript
- Vite build tool
- shadcn/ui (Radix primitives) for base components
- AG Grid Community for data tables
- React Flow (@xyflow/react) for graph visualization
- Zustand for local state + TanStack Query for server state
- react-router-dom for routing

**Strengths:**

- Largest ecosystem for data grids and graph visualization
- React Flow is purpose-built for organizational charts and relationship graphs
- AG Grid has first-class React support with extensive documentation
- Most Azure documentation and examples use React (easier onboarding)
- Largest talent pool for future team scaling
- Vite provides fast HMR and optimized production builds
- shadcn/ui provides accessible, customizable components without vendor lock-in

**Weaknesses:**

- More boilerplate than some alternatives
- Requires additional state management libraries
- JSX/TSX syntax has learning curve for developers new to React

**Ecosystem fit for requirements:**

| Requirement         | Library     | Maturity    |
| ------------------- | ----------- | ----------- |
| Data Grid           | AG Grid     | ⭐⭐⭐⭐⭐ |
| Graph Visualization | React Flow  | ⭐⭐⭐⭐⭐ |
| UI Components       | shadcn/ui   | ⭐⭐⭐⭐   |
| CSV Export          | papaparse   | ⭐⭐⭐⭐⭐ |

### Option 2: Vue 3 with TypeScript and Vite

**Stack:**

- Vue 3 with TypeScript and Composition API
- Vite build tool
- PrimeVue or Vuetify for UI components
- AG Grid Vue or TanStack Table
- vue-flow for graph visualization
- Pinia for state management

**Strengths:**

- Excellent documentation and gentle learning curve
- Strong TypeScript integration
- vue-flow provides similar capabilities to React Flow
- Smaller bundle size than React in some cases
- Official tooling (Vite was created by Vue's author)

**Weaknesses:**

- Smaller ecosystem for specialized components
- Fewer Azure-specific examples and documentation
- vue-flow less mature than React Flow
- Smaller talent pool compared to React

### Option 3: Angular 17+ with TypeScript

**Stack:**

- Angular 17+ with standalone components
- Angular CLI
- Angular Material or PrimeNG
- AG Grid Angular
- ngx-graph or custom D3.js integration

**Strengths:**

- Full-featured framework with batteries included
- Excellent TypeScript support (TypeScript-first)
- Strong enterprise adoption
- AG Grid has good Angular support

**Weaknesses:**

- Heavier framework with steeper learning curve
- More opinionated architecture constrains flexibility
- Graph visualization options less mature than React
- Overkill for this project's scope

### Option 4: Svelte/SvelteKit with TypeScript

**Stack:**

- SvelteKit with TypeScript
- Custom or community UI components
- svelte-ag-grid-community
- svelteflow or svelte-d3 for graphs

**Strengths:**

- Excellent developer experience and performance
- No virtual DOM overhead
- Growing community enthusiasm
- Smaller bundle sizes

**Weaknesses:**

- Ecosystem too limited for data grid and graph visualization requirements
- svelte-ag-grid-community less mature than React/Vue versions
- Graph visualization would require significant custom development
- Smaller community for troubleshooting complex issues

## Decision

**Selected: Option 1 - React 18+ with TypeScript and Vite**

The primary drivers for this decision are:

1. **React Flow** is the most mature and purpose-built solution for the organizational/influence graph visualization requirement. No other framework has an equivalent library with the same level of documentation, examples, and community support for this exact use case.

2. **AG Grid's React integration** is their primary target, with the most extensive documentation and examples.

3. **Azure Static Web Apps** documentation and templates predominantly use React, reducing deployment friction.

4. **Ecosystem depth** means complex requirements (RACI charts, custom export, relationship graphs) can be addressed with existing libraries rather than custom development.

## Consequences

### Positive

- Access to mature ecosystem of data visualization libraries
- Extensive Azure deployment documentation and community examples
- Strong typing with TypeScript reduces runtime errors
- Large talent pool if team needs to scale
- Fast development iteration with Vite HMR

### Negative

- Team members unfamiliar with React will have a learning curve
- Requires careful state management architecture decisions
- More initial setup than batteries-included frameworks

### Neutral

- Requires explicit choices for routing, state management, and styling (addressed by using react-router-dom, Zustand + TanStack Query, and shadcn/ui)

## Implementation Notes

**Project structure:**

```text
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── stakeholder-grid/      # AG Grid wrapper
│   ├── relationship-graph/    # React Flow wrapper
│   └── raci-chart/            # Custom RACI component
├── features/
│   ├── people/
│   ├── teams/
│   ├── companies/
│   └── workstreams/
├── lib/
│   ├── auth/                  # MSAL configuration
│   ├── api/                   # API client + TanStack Query hooks
│   └── export/                # CSV/JSON export utilities
└── App.tsx
```

**Key dependencies:**

| Purpose      | Library              | Version |
| ------------ | -------------------- | ------- |
| Framework    | react                | ^18.x   |
| Build        | vite                 | ^5.x    |
| Data Grid    | ag-grid-react        | ^31.x   |
| Graph        | @xyflow/react        | ^12.x   |
| State        | zustand              | ^4.x    |
| Server State | @tanstack/react-query | ^5.x    |
| Router       | react-router-dom     | ^6.x    |
| CSV Export   | papaparse            | ^5.x    |
| UI Components | shadcn/ui + radix-ui | latest  |

## Related Decisions

- Data persistence architecture (separate ADR)
- Authentication/RBAC implementation (separate ADR)
- API layer design (future ADR)

## References

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Flow Documentation](https://reactflow.dev/)
- [AG Grid React Documentation](https://www.ag-grid.com/react-data-grid/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Azure Static Web Apps with React](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-react)

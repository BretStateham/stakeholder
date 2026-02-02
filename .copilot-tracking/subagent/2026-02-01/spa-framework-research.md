# SPA Framework Research for Stakeholder Application

**Date:** 2026-02-01  
**Purpose:** Evaluate SPA framework options for building the Stakeholder application

## Executive Summary

This document evaluates the major SPA frameworks for the Stakeholder application, which requires:

- Tabular views with customizable columns and filters
- Graph visualizations for organizational/influence relationships
- RACI chart views
- CSV/JSON export capabilities
- Azure Web Application deployment
- GitHub Actions CI/CD
- Responsive design with Google Roboto font

**Recommendation:** **React** or **Vue 3** are the top choices for this project. React offers the largest ecosystem and most mature libraries for data grids and graph visualization, while Vue 3 provides excellent developer experience with similar capabilities and gentler learning curve.

---

## Framework Comparison Matrix

| Criteria | React | Vue 3 | Angular | Svelte | SolidJS |
|----------|-------|-------|---------|--------|---------|
| Data Grid Libraries | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Graph Visualization | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Azure Integration | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Learning Curve | Moderate | Easy | Steep | Easy | Moderate |
| Community Size | Largest | Large | Large | Growing | Small |
| TypeScript Support | Excellent | Excellent | Native | Good | Excellent |
| Bundle Size | Medium | Small | Large | Smallest | Small |
| Long-term Viability | Excellent | Excellent | Excellent | Good | Emerging |

---

## Individual Framework Analysis

### React

**Overview:**  
React is a JavaScript library for building user interfaces, developed by Meta. It uses a component-based architecture with a virtual DOM and unidirectional data flow.

**Pros:**

- **Largest ecosystem** — More third-party libraries and integrations than any other framework
- **Excellent data grid options** — AG Grid, TanStack Table, MUI DataGrid, React Table
- **Superior graph visualization** — React Flow, Vis.js, D3.js integration, Cytoscape.js wrappers
- **First-class Azure support** — Native build presets in Azure Static Web Apps
- **Extensive documentation** and community resources
- **Strong TypeScript integration** with excellent tooling
- **React Server Components** for improved performance (with Next.js)
- **Huge talent pool** for recruiting and finding help

**Cons:**

- **Frequent ecosystem churn** — Best practices evolve quickly
- **Configuration complexity** — Many choices for state management, routing, etc.
- **JSX syntax** — May require adjustment for developers unfamiliar with it
- **Not a full framework** — Requires additional libraries for routing, state management

**Key Libraries for Stakeholder Requirements:**

| Requirement | Recommended Library | Alternative |
|-------------|---------------------|-------------|
| Data Grid | AG Grid React | TanStack Table, MUI DataGrid |
| Graph Visualization | React Flow | vis-network-react, Cytoscape.js |
| RACI Chart | Custom with React Table | AG Grid with custom rendering |
| CSV Export | PapaParse | exceljs, json2csv |
| JSON Export | Native JSON.stringify | file-saver |
| State Management | Zustand, TanStack Query | Redux Toolkit, Jotai |
| Routing | React Router | TanStack Router |
| UI Components | shadcn/ui, Radix, MUI | Chakra UI, Ant Design |

**Azure Deployment:**

```yaml
# Azure Static Web Apps build preset
app_location: "/"
output_location: "dist" # or "build" for Create React App
```

---

### Vue 3

**Overview:**  
Vue is a progressive JavaScript framework that emphasizes approachability and flexibility. Vue 3 introduced the Composition API and improved TypeScript support.

**Pros:**

- **Gentle learning curve** — Excellent for teams new to SPAs
- **Official solutions** — Vue Router, Pinia (state management) are first-party
- **Excellent documentation** — Clear and comprehensive
- **Strong TypeScript support** in Vue 3
- **Smaller bundle size** than React or Angular
- **Single-file components** — Intuitive organization
- **Native Azure Static Web Apps support** with build presets

**Cons:**

- **Smaller ecosystem** than React — Fewer third-party libraries
- **Fewer visualization libraries** with native Vue bindings
- **Smaller talent pool** than React
- **Vue 2 to Vue 3 migration** caused ecosystem fragmentation

**Key Libraries for Stakeholder Requirements:**

| Requirement | Recommended Library | Alternative |
|-------------|---------------------|-------------|
| Data Grid | AG Grid Vue | Vuetify DataTable, PrimeVue |
| Graph Visualization | vue-flow | v-network-graph, vue-cytoscape |
| RACI Chart | Custom with AG Grid | PrimeVue DataTable |
| CSV Export | PapaParse | vue-json-csv |
| JSON Export | Native JSON.stringify | file-saver |
| State Management | Pinia | Vuex (legacy) |
| Routing | Vue Router | — |
| UI Components | Vuetify, PrimeVue | Naive UI, Element Plus |

**Azure Deployment:**

```yaml
# Azure Static Web Apps build preset
app_location: "/"
output_location: "dist"
```

---

### Angular

**Overview:**  
Angular is a full-featured, opinionated framework developed by Google. It provides a complete solution including routing, forms, HTTP client, and testing utilities.

**Pros:**

- **Full framework** — Everything included out of the box
- **Strong TypeScript integration** — TypeScript is the primary language
- **Enterprise-ready** — Dependency injection, testing utilities, strict patterns
- **Consistent structure** — Enforced conventions improve maintainability
- **Long-term support** from Google
- **Excellent for large teams** with established patterns
- **Native Azure Static Web Apps support**

**Cons:**

- **Steep learning curve** — Many concepts to master (modules, decorators, DI, RxJS)
- **Larger bundle sizes** than other frameworks
- **Verbose syntax** — More boilerplate than React or Vue
- **Frequent breaking changes** between major versions (historically)
- **RxJS dependency** — Requires learning reactive programming

**Key Libraries for Stakeholder Requirements:**

| Requirement | Recommended Library | Alternative |
|-------------|---------------------|-------------|
| Data Grid | AG Grid Angular | PrimeNG Table, ngx-datatable |
| Graph Visualization | ngx-graph | Cytoscape.js, D3.js |
| RACI Chart | Custom with AG Grid | PrimeNG Table |
| CSV Export | PapaParse, ngx-papaparse | exceljs |
| JSON Export | Native JSON.stringify | — |
| State Management | NgRx, Signals (v17+) | Akita, NGXS |
| Routing | Angular Router | — |
| UI Components | Angular Material | PrimeNG, NG-ZORRO |

**Azure Deployment:**

```yaml
# Azure Static Web Apps build preset
app_location: "/"
output_location: "dist/<app-name>/browser"
```

---

### Svelte

**Overview:**  
Svelte is a compiler-based framework that shifts work from runtime to compile time, resulting in smaller bundles and potentially better performance.

**Pros:**

- **Smallest bundle sizes** — Compiles away the framework
- **Simple syntax** — Less boilerplate than React or Angular
- **No virtual DOM** — Direct DOM manipulation for performance
- **Built-in state management** — Reactive by default
- **SvelteKit** — Full-stack framework with SSR/SSG
- **Growing popularity** — Active development and community
- **Azure Static Web Apps support**

**Cons:**

- **Smaller ecosystem** — Fewer third-party libraries
- **Fewer visualization libraries** — May need framework-agnostic solutions
- **Smaller community** — Less help available
- **Less enterprise adoption** — Fewer proven patterns
- **Tooling still maturing** — IDE support improving but behind React/Vue

**Key Libraries for Stakeholder Requirements:**

| Requirement | Recommended Library | Alternative |
|-------------|---------------------|-------------|
| Data Grid | svelte-headless-table | AG Grid (wrapper) |
| Graph Visualization | svelvet | D3.js, Cytoscape.js |
| RACI Chart | Custom implementation | — |
| CSV Export | PapaParse | — |
| JSON Export | Native JSON.stringify | — |
| State Management | Svelte stores | — |
| Routing | SvelteKit | svelte-routing |
| UI Components | Skeleton, DaisyUI | shadcn-svelte |

---

### SolidJS

**Overview:**  
SolidJS is a reactive JavaScript framework that provides fine-grained reactivity without a virtual DOM, offering React-like syntax with better performance.

**Pros:**

- **Excellent performance** — Fine-grained reactivity
- **React-like syntax** — Familiar to React developers
- **Small bundle size** — Similar to Svelte
- **No virtual DOM** — Direct DOM updates
- **Good TypeScript support**

**Cons:**

- **Small ecosystem** — Very few libraries
- **Limited visualization options** — Most need adapting
- **Small community** — Less help and fewer resources
- **No official Azure documentation** — Requires manual configuration
- **Early stage** — Not yet proven at enterprise scale

**Assessment:** Not recommended for this project due to ecosystem limitations.

---

## Ecosystem Deep Dive

### Data Grid/Table Components

**Best Overall: AG Grid**

AG Grid is available for React, Vue, Angular, and as a vanilla JS library. It provides:

- Filtering, sorting, grouping, pivoting
- Column customization and persistence
- Row selection and editing
- CSV and Excel export built-in
- Excellent performance with large datasets
- Strong TypeScript support

**AG Grid Pricing:**

- Community Edition: Free (MIT License) — Covers most requirements
- Enterprise Edition: Paid — Adds pivoting, Excel export, advanced features

**Alternatives by Framework:**

| Framework | Free Option | Commercial Option |
|-----------|-------------|-------------------|
| React | TanStack Table, MUI DataGrid | AG Grid Enterprise |
| Vue | PrimeVue DataTable | AG Grid Enterprise |
| Angular | ngx-datatable | AG Grid Enterprise |
| Svelte | svelte-headless-table | AG Grid (wrapper) |

### Graph/Network Visualization

**Best Options:**

1. **React Flow** (React) — Purpose-built for node-based graphs, excellent for org charts
2. **vue-flow** (Vue) — Port of React Flow for Vue 3
3. **D3.js** (Framework-agnostic) — Most powerful but steeper learning curve
4. **Cytoscape.js** (Framework-agnostic) — Excellent for network analysis
5. **vis-network** (Framework-agnostic) — Good for relationship graphs

**Recommendation for Stakeholder:**

- **Primary:** React Flow or vue-flow for organizational/influence graphs
- **Alternative:** Cytoscape.js for complex network analysis features

### RACI Chart Implementation

No off-the-shelf RACI components exist. Implementation approaches:

1. **Data Grid Customization** — Use AG Grid with custom cell renderers (R/A/C/I badges)
2. **Custom Component** — Build with standard table elements and framework
3. **Matrix Library** — Use a matrix visualization library with custom styling

**Recommended Approach:** Build a custom RACI grid component using AG Grid with:

- Stakeholders as rows
- Activities/deliverables as columns  
- Custom cell renderer for R/A/C/I selections

### Export Capabilities

**CSV Export:**

- **Built-in:** AG Grid Enterprise includes CSV export
- **Library:** PapaParse (universal, excellent performance)

**JSON Export:**

- **Native:** `JSON.stringify()` with `Blob` and download link
- **Library:** file-saver for cross-browser SaveAs dialog

**Example Export Function:**

```typescript
function exportToJSON(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## Azure Deployment Considerations

### Azure Static Web Apps (Recommended)

Azure Static Web Apps provides excellent support for React, Vue, Angular, and Svelte:

**Features:**

- Free SSL certificates
- Global CDN distribution
- Staging environments on pull requests
- Integrated authentication (Azure AD, GitHub, etc.)
- API support via Azure Functions
- GitHub Actions integration (automatic)

**Supported Frameworks with Build Presets:**

- React
- Vue.js
- Angular
- Svelte
- Next.js
- Nuxt.js
- Gatsby

**Build Configuration (staticwebapp.config.json):**

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "globalHeaders": {
    "content-security-policy": "default-src 'self'"
  }
}
```

### Azure App Service (Alternative)

For more complex requirements:

- Full Node.js runtime
- WebSockets support
- Higher resource limits
- Deployment slots for staging

### Bicep Infrastructure as Code

All frameworks deploy similarly with Bicep:

```bicep
resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: 'stakeholder-app'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: 'https://github.com/org/stakeholder'
    branch: 'main'
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
    }
  }
}
```

---

## GitHub Actions CI/CD

All major frameworks integrate seamlessly with GitHub Actions. Azure Static Web Apps auto-generates workflows.

**Example Workflow (React):**

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"
```

---

## Learning Curve and Developer Experience

### React

- **Initial learning:** 2-4 weeks for basic proficiency
- **Advanced patterns:** 2-3 months (hooks, context, optimization)
- **Local dev:** Vite or Create React App
- **Hot reload:** Excellent with Vite
- **IDE support:** Excellent (VS Code, WebStorm)

### Vue 3

- **Initial learning:** 1-2 weeks for basic proficiency
- **Advanced patterns:** 1-2 months (Composition API, Pinia)
- **Local dev:** Vite (official)
- **Hot reload:** Excellent
- **IDE support:** Excellent with Volar extension

### Angular

- **Initial learning:** 4-6 weeks for basic proficiency
- **Advanced patterns:** 3-6 months (RxJS, NgRx, advanced DI)
- **Local dev:** Angular CLI
- **Hot reload:** Good
- **IDE support:** Excellent (WebStorm, VS Code with Angular Language Service)

### Svelte

- **Initial learning:** 1-2 weeks for basic proficiency
- **Advanced patterns:** 1-2 months (SvelteKit, stores)
- **Local dev:** Vite (via SvelteKit)
- **Hot reload:** Excellent
- **IDE support:** Good (Svelte for VS Code)

---

## Recommendation

### Primary Recommendation: React

**Rationale:**

1. **Best ecosystem for requirements** — AG Grid, React Flow, TanStack ecosystem
2. **Largest community** — Most resources, tutorials, and help available
3. **First-class Azure support** — Native build presets, extensive documentation
4. **Proven at scale** — Used by major enterprises for similar applications
5. **Future-proof** — Largest talent pool, active development

**Suggested Stack:**

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui (Radix primitives)
- **Data Grid:** AG Grid Community
- **Graph Visualization:** React Flow
- **State Management:** Zustand + TanStack Query
- **Routing:** React Router v6
- **Export:** PapaParse (CSV), native JSON

### Alternative Recommendation: Vue 3

**Choose Vue 3 if:**

- Team has Vue experience
- Prefer simpler, more opinionated structure
- Value smaller bundle size
- Prefer single-file components

**Suggested Stack:**

- **Framework:** Vue 3 with TypeScript
- **Build Tool:** Vite
- **UI Components:** PrimeVue or Vuetify 3
- **Data Grid:** AG Grid Vue or PrimeVue DataTable
- **Graph Visualization:** vue-flow
- **State Management:** Pinia
- **Routing:** Vue Router
- **Export:** PapaParse (CSV), native JSON

### Not Recommended

- **Angular** — Steep learning curve and larger bundles don't justify benefits for this project size
- **Svelte** — Ecosystem too limited for data grid and visualization requirements
- **SolidJS** — Ecosystem too immature for production use

---

## Next Steps

1. **Team assessment** — Evaluate team's current skills and preferences
2. **Prototype** — Build small proof-of-concept with React or Vue
3. **Library evaluation** — Test AG Grid and React Flow/vue-flow with sample data
4. **Project setup** — Initialize project with recommended stack
5. **Azure configuration** — Set up Azure Static Web Apps and GitHub Actions

---

## References

### Azure Documentation

- [Azure Static Web Apps FAQ](https://learn.microsoft.com/en-us/azure/static-web-apps/faq)
- [Deploy JavaScript apps to Azure](https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/deploy-web-app)
- [Deploy React to Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-react)
- [Deploy Vue to Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-vue)
- [GitHub Actions deployment to Azure](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions)

### Framework Documentation

- [React Documentation](https://react.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Angular Documentation](https://angular.dev/)
- [Svelte Documentation](https://svelte.dev/)

### Key Libraries

- [AG Grid](https://www.ag-grid.com/)
- [React Flow](https://reactflow.dev/)
- [vue-flow](https://vueflow.dev/)
- [TanStack Table](https://tanstack.com/table)
- [PapaParse](https://www.papaparse.com/)

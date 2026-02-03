---
title: SPA Unit Testing Framework Selection for Stakeholder Application
description: Architecture decision record for selecting Vitest with React Testing Library as the frontend SPA unit testing framework
author: Claude Opus 4.5 and Bret Stateham
ms.date: 2026-02-02
ms.topic: reference
---

## Status

Accepted

## Context

The Stakeholder application frontend requires a comprehensive unit testing strategy to ensure code quality, prevent regressions, and support confident refactoring. The React SPA uses React 19 with TypeScript and Vite 6, and includes:

* **Custom authentication hooks** wrapping MSAL for Azure AD integration
* **Role-based access control hooks** determining user permissions
* **UI components** for authentication workflows
* **Utility functions** for class name merging and data transformation
* **TanStack Query integration** for server state management
* **Zustand stores** for local state management

The current frontend codebase has no testing infrastructure. Unit tests must work seamlessly with Vite's ESM module system, TypeScript strict mode, and existing path aliases (`@/`).

## Scope

This ADR addresses unit testing for the **frontend SPA** only. The following are explicitly out of scope:

* Backend API unit testing (separate ADR required)
* End-to-end testing spanning frontend and backend
* Integration testing with real Azure AD or database services

## Decision Drivers

1. **Vite integration** for native ESM support and configuration reuse
2. **TypeScript compatibility** without additional transform configuration
3. **React 19 support** for testing hooks and components
4. **Developer experience** including fast feedback loops and familiar APIs
5. **Mocking capabilities** for external dependencies (MSAL, APIs)
6. **Ecosystem maturity** for component testing utilities

## Options Considered

### Option 1: Vitest with React Testing Library (Recommended)

**Stack:**

* Vitest test runner and assertion library
* jsdom browser environment simulation
* React Testing Library for component testing
* User Event for interaction simulation
* jest-dom for custom DOM matchers

**Strengths:**

* Native Vite integration reuses `vite.config.ts` for path aliases and plugins
* Zero additional transform configuration for TypeScript/ESM
* Jest-compatible API enables easy knowledge transfer
* Fast execution through Vite's esbuild transformer
* Built-in mocking with `vi.mock()` and `vi.fn()`
* Watch mode with instant feedback on file changes
* First-class TypeScript support

**Weaknesses:**

* Younger ecosystem than Jest (though rapidly maturing)
* Some Jest plugins may not have Vitest equivalents
* Teams with heavy Jest investment may need minor API adjustments

**Ecosystem fit:**

| Requirement                | Solution                     | Maturity    |
| -------------------------- | ---------------------------- | ----------- |
| Test Runner                | Vitest                       | ⭐⭐⭐⭐   |
| Component Testing          | React Testing Library        | ⭐⭐⭐⭐⭐ |
| User Interactions          | @testing-library/user-event  | ⭐⭐⭐⭐⭐ |
| DOM Assertions             | @testing-library/jest-dom    | ⭐⭐⭐⭐⭐ |
| Mocking                    | Vitest built-in              | ⭐⭐⭐⭐   |

### Option 2: Jest with React Testing Library

**Stack:**

* Jest test runner
* ts-jest or babel-jest for TypeScript transformation
* React Testing Library for component testing
* jsdom environment

**Strengths:**

* Most mature JavaScript testing framework
* Extensive plugin ecosystem
* Widely known API and patterns
* Large community for troubleshooting

**Weaknesses:**

* Requires separate configuration pipeline from Vite
* Additional transform setup for ESM modules
* Path alias configuration must be duplicated in jest.config.js
* Slower execution than Vitest for Vite projects
* CJS/ESM interop issues common with modern packages

### Option 3: Web Test Runner

**Stack:**

* Web Test Runner from Modern Web
* Playwright or browser launchers
* Testing Library integrations

**Strengths:**

* Tests run in real browsers
* Modern ESM-first architecture
* Good for cross-browser verification

**Weaknesses:**

* Less mature React integration
* Slower than jsdom-based solutions
* More complex setup for unit tests
* Better suited for integration/E2E testing

## Decision

**Selected: Option 1 - Vitest with React Testing Library**

The primary drivers for this decision are:

1. **Native Vite integration** eliminates configuration duplication. Vitest reuses `vite.config.ts`, ensuring path aliases, plugins, and transforms work identically in tests and application code.

2. **Zero-config TypeScript** through Vite's esbuild transformer. No ts-jest configuration, no babel setup, no module interop issues.

3. **Jest-compatible API** means existing React Testing Library knowledge and patterns apply directly. Team members familiar with Jest can be productive immediately.

4. **Performance** through Vite's optimized file handling provides fast feedback during development.

5. **Project alignment** with the Vite-based build system creates a cohesive developer experience.

## Consequences

### Positive

* Unified configuration between build and test systems
* Fast test execution with watch mode
* TypeScript and path aliases work without additional setup
* Jest-compatible patterns for React Testing Library
* Built-in coverage reporting with V8 provider
* Excellent IDE integration in VS Code

### Negative

* Team members must learn Vitest-specific APIs for mocking (`vi.mock` vs `jest.mock`)
* Some niche Jest plugins may require alternatives
* Younger ecosystem means fewer Stack Overflow answers for edge cases

### Neutral

* Requires adding test configuration block to existing `vite.config.ts`
* Test files co-located with source files (project convention)

### Risks

* React Testing Library ecosystem may lag behind React 19 API changes; monitor releases for compatibility updates

## Implementation Notes

**Dependencies to install:**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @vitest/coverage-v8
```

| Package                    | Purpose                              |
| -------------------------- | ------------------------------------ |
| vitest                     | Test runner, assertions, mocking     |
| @vitest/ui                 | Interactive UI for viewing test results |
| jsdom                      | Browser environment simulation       |
| @testing-library/react     | React component testing utilities    |
| @testing-library/dom       | DOM querying (peer dependency)       |
| @testing-library/user-event | User interaction simulation         |
| @testing-library/jest-dom  | Custom DOM matchers                  |
| @vitest/coverage-v8        | V8 coverage provider for vitest      |

**Vite configuration addition:**

> **Note:** When integrating with an existing `vite.config.ts`, preserve existing configuration blocks (such as `server`) alongside the new `test` block.

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

**Test organization structure:**

```text
src/
├── test/
│   ├── setup.ts              # Global setup and DOM matchers
│   ├── test-utils.tsx        # Custom render with providers
│   └── mocks/
│       └── msal.ts           # MSAL authentication mocks
├── components/
│   └── auth/
│       ├── LoginButton.tsx
│       └── LoginButton.test.tsx   # Co-located test
└── lib/
    ├── utils.ts
    └── utils.test.ts              # Co-located test
```

**Package.json scripts:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**MSAL mocking strategy:**

Tests mock MSAL at the module level using `vi.mock('@azure/msal-react')`. Individual tests configure return values to simulate authenticated, unauthenticated, and different role scenarios. This approach enables testing auth components and hooks without Azure AD network calls.

**Testing priorities:**

| Priority | Target              | Type      | Complexity |
| -------- | ------------------- | --------- | ---------- |
| 1        | useRoles hook       | Unit      | Low        |
| 2        | useAuth hook        | Unit      | Medium     |
| 3        | cn() utility        | Unit      | Trivial    |
| 4        | LoginButton         | Component | Low        |
| 5        | LogoutButton        | Component | Low        |
| 6        | AuthStatus          | Component | Medium     |
| 7        | UserProfile         | Component | Medium     |

## Related Decisions

* [SPA Framework Selection](2026-02-02-spa-framework-selection-v01.md) establishes React/Vite as the application foundation
* Backend API Unit Testing (future ADR) will address server-side testing strategy
* E2E Testing Framework (future ADR) will address full user flow testing
* Visual Regression Testing (future ADR) for UI component consistency

## References

* [Vitest Documentation](https://vitest.dev/)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
* [Vitest with Vite](https://vitest.dev/guide/#adding-vitest-to-your-project)
* [Testing MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/testing.md)

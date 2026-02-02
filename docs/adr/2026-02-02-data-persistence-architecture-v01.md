---
title: Data Persistence Architecture for Stakeholder Application
description: Architecture decision record for selecting SQLite with Prisma ORM and Express backend
author: Claude Opus 4.5 and Bret Stateham
ms.date: 2026-02-02
ms.topic: reference
---

## Status

Accepted

## Context

The Stakeholder application requires a data persistence layer to store and manage stakeholder data across multiple Data Sets. The application must support:

- **Multi-user concurrent access** with 5-50 expected users
- **Relational data model** for people, teams, companies, workstreams, and relationships
- **Data Set isolation** for access control (multiple Data Sets, each with their own members)
- **TypeScript throughout** to maintain consistency with the React frontend
- **Local development** without cloud service dependencies
- **Azure deployment** with cost sensitivity as a high priority
- **Simple backup and restore** capabilities

The team prioritizes simplicity over advanced features and wants to minimize operational complexity.

## Decision Drivers

1. **TypeScript native** for consistent developer experience across frontend and backend
2. **Simplicity** with minimal moving parts and operational overhead
3. **Cost** targeting minimal monthly Azure spend
4. **Local development parity** enabling offline development without emulators
5. **Relational support** for modeling stakeholder relationships
6. **Multi-user concurrency** within expected usage patterns

## Options Considered

### Option 1: SQLite + Prisma + Express on Azure App Service B1 (Recommended)

**Stack:**

- Express.js with TypeScript
- Prisma ORM with SQLite provider
- Single SQLite database file with DataSet foreign keys
- Azure App Service B1 (~$13/month)
- WAL mode for concurrent read/write handling

**Strengths:**

- Single-file database with no server process to manage
- Prisma generates TypeScript types from schema, enabling type-safe queries
- Zero cloud dependencies for local development (`npm run dev` just works)
- WAL mode safely handles 5-50 concurrent users
- Simple backup: copy one `.db` file
- Clear migration path to PostgreSQL via Prisma when scaling needed
- Express serves both API and static React files from single host

**Weaknesses:**

- Database-level write locking means writes queue sequentially (acceptable for expected load)
- SQLite file requires explicit backup strategy (no managed backups)
- Not suitable for >50 concurrent writers or multi-region deployment
- Single server deployment limits horizontal scaling

**Cost:** ~$13/month (App Service B1 with 10GB storage)

### Option 2: Turso + Drizzle ORM

**Stack:**

- Express.js with TypeScript
- Drizzle ORM with Turso (managed SQLite edge database)
- Any hosting option (Static Web Apps functions, App Service)

**Strengths:**

- Free tier: 9GB storage, 1B reads/month
- Managed concurrency (no WAL configuration needed)
- TypeScript-native Drizzle ORM
- Global edge distribution when needed
- Works from any hosting platform

**Weaknesses:**

- External service dependency outside Azure subscription
- Requires connection URL management across environments
- Slightly more complex deployment configuration
- Data governance may be a concern (data outside Azure)

**Cost:** $0 (free tier) to $29/month (Pro)

### Option 3: Azure Cosmos DB for NoSQL (Free Tier)

**Stack:**

- Express.js or Azure Functions with TypeScript
- Cosmos DB NoSQL SDK
- Azure Static Web Apps or App Service

**Strengths:**

- Free tier: 1000 RU/s, 25GB storage, forever free
- Native TypeScript SDK with good ergonomics
- Managed service with no database server administration
- Global distribution when scaling needed
- Consistent Azure ecosystem

**Weaknesses:**

- NoSQL requires different mental model for relational data
- Modeling relationships requires denormalization or cross-partition queries
- Local development requires Cosmos DB emulator (complex setup)
- Query patterns differ significantly from SQL

**Cost:** $0 (free tier) for low usage, scales with RU consumption

### Option 4: Azure SQL Database Serverless

**Stack:**

- Express.js with TypeScript
- Prisma ORM with SQL Server provider
- Azure SQL Database Serverless tier

**Strengths:**

- Full relational database with enterprise features
- Managed backups, high availability built-in
- Prisma provides same developer experience as SQLite option
- Auto-pause reduces costs during inactive periods

**Weaknesses:**

- More expensive: $5-50+/month depending on usage
- Local development requires Docker or SQL Server Express
- Cold start latency when database auto-resumes (~1 minute)
- Overkill for expected usage patterns

**Cost:** $5-50+/month depending on DTU consumption

### Option 5: JSON Files with LowDB

**Stack:**

- Express.js with TypeScript
- LowDB for JSON file storage
- Azure App Service or Static Web Apps

**Strengths:**

- Simplest possible implementation
- Zero dependencies beyond Node.js
- Perfect for single-user prototyping
- Human-readable data files

**Weaknesses:**

- No concurrency handling (data corruption risk with multiple writers)
- No query optimization for large datasets
- Not production-grade for multi-user scenarios
- No relationship integrity enforcement

**Cost:** $0-13 depending on hosting

## Decision

**Selected: Option 1 - SQLite + Prisma + Express on Azure App Service B1**

### Primary Decision Rationale

1. **Simplicity wins** - SQLite requires no database server, no connection strings for local dev, and no external service dependencies. The entire backend is self-contained.

2. **Prisma aligns with TypeScript-first development** - Generated types from the schema provide compile-time safety that matches the React + TypeScript frontend approach.

3. **WAL mode addresses concurrency concerns** - With `busy_timeout` configuration, SQLite safely handles the expected 5-50 concurrent users. Writes queue automatically with imperceptible latency (~10-100ms per write).

4. **Cost predictability** - Fixed ~$13/month versus usage-based billing eliminates surprises and aligns with cost sensitivity requirement.

5. **Migration path exists** - When/if scaling beyond SQLite limits, Prisma supports PostgreSQL and MySQL with minimal code changes.

### Data Set Isolation Decision

**Selected: Single database with DataSet foreign key** (not separate SQLite files per DataSet)

Rationale:

- **Prisma compatibility** - Prisma is designed for single-database operation. Multiple databases require dynamic client instantiation, adding significant complexity.
- **Migration simplicity** - Run migrations once, not per Data Set.
- **Backup simplicity** - One file to backup, not N files.
- **Admin queries** - System administrators can query across Data Sets easily.
- **RBAC enforcement** - Access control is already enforced at the application layer via Data Set membership. Physical file separation adds complexity without meaningful security benefit.

## Consequences

### Positive

- Local development requires only `npm run dev` (frontend) and `npm run server` (backend)
- Type-safe database queries via Prisma-generated types
- Simple deployment: one App Service hosts both API and static files
- Backup is straightforward: copy the `.db` file to Azure Blob Storage
- Clear scaling path via Prisma's multi-database support

### Negative

- SQLite write locking means concurrent writes queue (acceptable for expected load)
- Manual backup strategy required (no managed database backups)
- Single-server deployment; horizontal scaling requires database migration
- App Service B1 has limited resources (1.75GB RAM, 1 core)

### Neutral

- Express.js adds a runtime dependency but enables flexible API design
- Prisma schema becomes source of truth for data model

## Implementation Notes

### Project Structure

```text
stakeholder/
├── src/                          # React frontend (existing)
│   ├── components/
│   ├── features/
│   ├── lib/
│   │   └── api/                  # API client (TanStack Query)
│   └── App.tsx
├── server/                       # Express backend
│   ├── src/
│   │   ├── index.ts              # Express app entry
│   │   ├── routes/
│   │   │   ├── datasets.ts
│   │   │   ├── people.ts
│   │   │   ├── teams.ts
│   │   │   ├── companies.ts
│   │   │   └── workstreams.ts
│   │   └── db/
│   │       └── client.ts         # Prisma client + SQLite config
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── package.json
│   └── tsconfig.json
├── package.json                  # Root with npm workspaces
└── vite.config.ts                # Proxy /api to Express in dev
```

### SQLite Configuration for Concurrency

```typescript
// server/src/db/client.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function configureSQLite() {
  // Enable WAL mode - allows concurrent reads during writes
  await prisma.$executeRaw`PRAGMA journal_mode = WAL;`;
  
  // Wait up to 5 seconds for write lock (automatic retry)
  await prisma.$executeRaw`PRAGMA busy_timeout = 5000;`;
  
  // Faster writes while maintaining durability
  await prisma.$executeRaw`PRAGMA synchronous = NORMAL;`;
}

export { prisma, configureSQLite };
```

### Vite Proxy Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### Key Dependencies

| Purpose | Library | Version |
|---------|---------|---------|
| Backend Framework | express | ^4.x |
| ORM | @prisma/client | ^5.x |
| Database | sqlite3 (via Prisma) | bundled |
| Type Generation | prisma | ^5.x |
| TypeScript Runtime | tsx | ^4.x |

### Deployment Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Azure App Service B1                  │
│                        (~$13/mo)                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ React SPA   │───▶│ Express API │───▶│   SQLite    │  │
│  │  (Static)   │    │  (Node.js)  │    │ stakeholder │  │
│  │             │    │  + Prisma   │    │    .db      │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Backup Strategy (Future Decision)

SQLite's single-file architecture simplifies backup. Implementation details to be decided when needed, but potential approaches include:

**Option A: Scheduled in-API backup**

- Use `node-cron` within Express to trigger daily backups
- Upload to Azure Blob Storage via `@azure/storage-blob` SDK
- Requires App Service "Always On" setting enabled
- Keeps all logic in one codebase

**Option B: Admin API endpoint**

- Expose `/api/admin/backup` endpoint for on-demand backups
- Can be called manually or via external scheduler (Azure Logic Apps, GitHub Actions)
- Provides flexibility without scheduled overhead

**Option C: Azure Function timer trigger**

- Separate Azure Function on consumption plan
- Timer trigger copies `.db` file to Blob Storage
- Adds operational complexity but runs independently of API

**Common elements (any option):**

- Target: Azure Blob Storage container
- Retention: 30 days via lifecycle policy
- Naming: `stakeholder-YYYY-MM-DD.db`

### Scaling Triggers

Migrate from SQLite to Azure Database for PostgreSQL when:

- Concurrent users exceed 50 with frequent writes
- Database size exceeds 5GB
- Multi-region deployment required
- Real-time collaborative editing needed

Migration path:

1. Update `schema.prisma` datasource to `postgresql`
2. Provision Azure Database for PostgreSQL Flexible Server
3. Run `prisma migrate deploy`
4. Update connection string in App Service configuration

## Related Decisions

- [SPA Framework Selection](2026-02-02-spa-framework-selection-v01.md) - React 18+ with TypeScript
- Authentication/RBAC implementation (future ADR)

## References

- [Prisma with SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [SQLite WAL Mode](https://www.sqlite.org/wal.html)
- [Azure App Service for Node.js](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [Vite Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
- [SQLite Concurrency](https://www.sqlite.org/lockingv3.html)

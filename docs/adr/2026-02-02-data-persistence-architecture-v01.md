---
title: Data Persistence Architecture for Stakeholder Application
description: Architecture decision record for selecting SQLite with Prisma ORM and Express backend
author: Claude Opus 4.5 and Bret Stateham
ms.date: 2026-02-02
ms.topic: reference
---

## Status

Proposed

## Context

The Stakeholder application requires a data persistence solution to store and manage complex stakeholder relationships across organizations. The application must support:

* **Structured entities** including Data Sets, Companies, Workstreams, Teams, and People
* **Complex relationships** such as Reports-To hierarchies, People-Teams membership, and Influence networks
* **Multi-user concurrent access** with data isolation per Data Set (5-20 concurrent users)
* **JSON import/export** for bulk data operations
* **Filtering capabilities** for active/inactive stakeholder status
* **Azure deployment** with cost-effective hosting
* **Local development** workflow with minimal friction and zero cloud dependencies

The data model includes many-to-many relationships (People-Teams, People-Workstreams, Company-Teams) and self-referential hierarchies (Reports-To, Influences).

A key constraint is maintaining a **single-language stack**. The frontend is React with TypeScript (already implemented), and the backend should use TypeScript to reduce cognitive overhead, simplify hiring, and enable code sharing.

## Decision Drivers

1. **Simplicity** with minimal moving parts and operational complexity
2. **Single-language stack** using TypeScript for both frontend and backend
3. **Cost efficiency** minimizing monthly Azure spend
4. **Relational integrity** for complex stakeholder relationships
5. **Local development parity** working offline without cloud dependencies
6. **Query flexibility** for hierarchical data traversal (reporting chains, influence networks)
7. **Clear migration path** when scaling requirements change

## Options Considered

### Option 1: SQLite with Prisma ORM and Express (Recommended)

**Stack:**

* SQLite database (single file, WAL mode for concurrency)
* Prisma ORM (TypeScript-native with generated types)
* Express.js (Node.js HTTP server)
* Azure App Service B1 for hosting

**Strengths:**

* Single-file database eliminates database server management
* TypeScript throughout: Prisma generates types from schema, matching frontend
* Zero cloud dependencies for local development (just `npm run dev`)
* WAL mode handles concurrent reads and serialized writes for up to 50 users
* Easy backup: copy one `.db` file
* Prisma migrations provide schema versioning with rollback capability
* Clear migration path to PostgreSQL/MySQL when scaling needed (same Prisma schema)
* Single deployment: Express serves both static React files and API routes

**Weaknesses:**

* Database-level write locking (not row-level), though WAL mode mitigates impact
* Not suitable for 50+ concurrent users with frequent writes
* Single-server deployment limits horizontal scaling
* File-based database requires persistent storage (not serverless functions)

**Cost estimate:** ~$13/month (Azure App Service Basic B1 with persistent storage)

**Concurrency behavior:**

| Scenario                              | Behavior                                |
| ------------------------------------- | --------------------------------------- |
| 5 users reading simultaneously        | All succeed instantly                   |
| 1 user reading, 1 writing             | Both succeed (WAL mode)                 |
| 2 users saving at exact same moment   | Second waits ~10-50ms, then succeeds    |
| 5 users saving within 1 second        | Each waits their turn, all succeed      |

**Schema design:**

| Entity            | Key Relationships                                |
| ----------------- | ------------------------------------------------ |
| DataSet           | Root container, owns all other entities          |
| Company           | Belongs to DataSet, has Teams                    |
| Team              | Belongs to DataSet, many-to-many with Companies  |
| Workstream        | Belongs to DataSet, many-to-many with People     |
| Person            | Belongs to DataSet, self-ref Manager, many Teams |
| Influence         | Junction for People influence relationships      |

### Option 2: Azure SQL Database Serverless with Entity Framework Core

**Stack:**

* Azure SQL Database (Serverless General Purpose tier)
* Entity Framework Core as ORM (.NET backend)
* SQL Server in Docker for local development

**Strengths:**

* Azure-native with extensive monitoring and Bicep support
* Serverless tier auto-pauses after idle period, reducing variable costs
* EF Core provides excellent .NET development experience
* Recursive CTEs handle hierarchical queries efficiently
* Row-level locking supports higher concurrency than SQLite

**Weaknesses:**

* Requires .NET backend, breaking single-language TypeScript stack
* Cold start latency (~10-30 seconds) when database resumes from paused state
* Docker required for local development (SQL Server container)
* Higher minimum cost floor than SQLite approach
* More complex deployment with separate database service

**Cost estimate:** $5-50/month (variable, auto-pause reduces idle costs)

### Option 3: Turso with Drizzle ORM

**Stack:**

* Turso (distributed SQLite as a service)
* Drizzle ORM (TypeScript-native)
* Any hosting platform (works from edge functions)

**Strengths:**

* Free tier: 9GB storage, 1B reads/month
* Managed concurrency (no WAL configuration needed)
* TypeScript-native Drizzle ORM with excellent DX
* Works from any hosting environment including serverless
* Automatic replication and backups

**Weaknesses:**

* External service dependency outside Azure subscription
* Slightly more complex deployment (connection URL management)
* Data lives outside your Azure environment
* Vendor lock-in to Turso platform

**Cost estimate:** $0/month (free tier sufficient for this scale)

### Option 4: Azure Cosmos DB for NoSQL

**Stack:**

* Azure Cosmos DB NoSQL API
* Azure Cosmos DB SDK for Node.js
* Cosmos DB Emulator for local development

**Strengths:**

* Free tier: 1000 RU/s, 25GB (sufficient for this scale)
* Schema flexibility accommodates evolving data models
* Global distribution if multi-region access becomes necessary
* Native TypeScript SDK with excellent documentation

**Weaknesses:**

* NoSQL requires different mental model for relational stakeholder data
* Many-to-many relationships require application-level management
* Referential integrity must be enforced in application code
* Cosmos DB Emulator is Windows-only, complicating cross-platform development
* Overkill for stakeholder data volume and access patterns

**Cost estimate:** $0/month (free tier) to $25-100/month (production)

### Option 5: JSON File Storage (LowDB)

**Stack:**

* LowDB (JSON file-based storage)
* File system persistence
* Any hosting platform

**Strengths:**

* Simplest possible implementation
* Zero dependencies beyond Node.js
* Perfect local development parity
* No database setup required

**Weaknesses:**

* No real concurrency handling (race conditions on concurrent writes)
* Data corruption risk with multiple simultaneous writers
* Not production-grade for multi-user applications
* No querying capability beyond in-memory filtering

**Cost estimate:** $0/month (not suitable for multi-user requirements)

## Decision

**Selected: Option 1 - SQLite with Prisma ORM and Express**

This is the simplest production-ready option that meets all requirements.

The primary drivers for this decision are:

1. **Single-language stack**: TypeScript throughout frontend and backend reduces cognitive overhead and enables code sharing. Prisma generates TypeScript types from the schema, providing end-to-end type safety matching the React frontend.

2. **Simplicity**: A single-file database eliminates the operational complexity of managing a separate database server. Local development requires only `npm run dev` with no Docker containers or cloud emulators.

3. **Cost efficiency**: Azure App Service B1 (~$13/month) provides persistent storage for SQLite, significantly cheaper than managed database services while meeting performance requirements.

4. **Sufficient concurrency**: With WAL mode and `busy_timeout` configuration, SQLite handles 5-20 concurrent users performing CRUD operations. Multiple readers proceed simultaneously; writes queue briefly (~10-50ms) and succeed automatically.

5. **Relational data model fit**: Despite being lightweight, SQLite fully supports foreign keys, cascading deletes, and the many-to-many junction tables required for stakeholder relationships. Prisma enforces these constraints through generated TypeScript types.

6. **Clear migration path**: When the application outgrows SQLite (50+ concurrent users, multi-region deployment), Prisma supports PostgreSQL and MySQL with the same schema definition. Migration involves updating the datasource and running `prisma migrate deploy`.

## Consequences

### Positive

* TypeScript end-to-end eliminates context switching between languages
* Prisma generates types from schema, providing compile-time safety for database operations
* Zero local development dependencies on Docker or cloud services
* Single deployment artifact: Express serves both SPA and API from one App Service
* Predictable ~$13/month cost with no usage-based surprises
* Easy backup strategy: copy the `.db` file
* Straightforward migration to PostgreSQL when scaling needs change

### Negative

* Write operations are serialized (one at a time), though WAL mode allows concurrent reads
* Not suitable for 50+ concurrent users with write-heavy workloads
* Single-server deployment prevents horizontal scaling
* Team members unfamiliar with Prisma will have a learning curve

### Neutral

* SQLite configuration required for production concurrency (WAL mode, busy_timeout)
* Schema changes require explicit Prisma migrations (standard practice)

## Implementation Notes

### Project Structure

```text
stakeholder/
├── src/                          # React frontend (existing)
│   ├── components/
│   ├── features/
│   ├── lib/
│   │   └── api/                  # API client
│   └── App.tsx
├── server/                       # Express backend
│   ├── src/
│   │   ├── index.ts              # Express app entry
│   │   ├── routes/
│   │   │   ├── people.ts
│   │   │   ├── teams.ts
│   │   │   ├── companies.ts
│   │   │   └── workstreams.ts
│   │   └── db/
│   │       └── client.ts         # Prisma client with WAL config
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── package.json
│   └── tsconfig.json
├── package.json                  # Root with workspaces
└── vite.config.ts                # Proxy to Express in dev
```

### Architecture Overview

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

### Prisma Schema

```prisma
// server/prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model DataSet {
  id         String   @id @default(uuid())
  name       String
  ownerName  String
  ownerEmail String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  companies   Company[]
  teams       Team[]
  people      Person[]
  workstreams Workstream[]
}

model Person {
  id            String   @id @default(uuid())
  dataSetId     String
  dataSet       DataSet  @relation(fields: [dataSetId], references: [id])
  firstName     String
  lastName      String
  preferredName String?
  email         String
  phone         String?
  location      String?
  timeZone      String?
  title         String?
  role          String?
  notes         String?
  isActive      Boolean  @default(true)

  managerId     String?
  manager       Person?  @relation("ReportsTo", fields: [managerId], references: [id])
  directReports Person[] @relation("ReportsTo")

  teams         TeamMember[]
  workstreams   WorkstreamMember[]
  influencing   Influence[] @relation("Influencer")
  influencedBy  Influence[] @relation("Influencee")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Team {
  id          String   @id @default(uuid())
  dataSetId   String
  dataSet     DataSet  @relation(fields: [dataSetId], references: [id])
  name        String
  description String?

  members   TeamMember[]
  companies CompanyTeam[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Company {
  id         String   @id @default(uuid())
  dataSetId  String
  dataSet    DataSet  @relation(fields: [dataSetId], references: [id])
  name       String
  website    String?
  hqLocation String?

  teams CompanyTeam[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Workstream {
  id          String   @id @default(uuid())
  dataSetId   String
  dataSet     DataSet  @relation(fields: [dataSetId], references: [id])
  name        String
  description String?
  adoLink     String?

  members WorkstreamMember[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Junction tables
model TeamMember {
  personId String
  person   Person @relation(fields: [personId], references: [id], onDelete: Cascade)
  teamId   String
  team     Team   @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@id([personId, teamId])
}

model CompanyTeam {
  companyId String
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  teamId    String
  team      Team    @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@id([companyId, teamId])
}

model WorkstreamMember {
  personId     String
  person       Person     @relation(fields: [personId], references: [id], onDelete: Cascade)
  workstreamId String
  workstream   Workstream @relation(fields: [workstreamId], references: [id], onDelete: Cascade)
  raciRole     String?    // R, A, C, or I

  @@id([personId, workstreamId])
}

model Influence {
  influencerId String
  influencer   Person @relation("Influencer", fields: [influencerId], references: [id], onDelete: Cascade)
  influenceeId String
  influencee   Person @relation("Influencee", fields: [influenceeId], references: [id], onDelete: Cascade)

  @@id([influencerId, influenceeId])
}
```

### SQLite Concurrency Configuration

```typescript
// server/src/db/client.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Run once at app startup
async function configureSQLite() {
  // Enable WAL mode - allows reads during writes
  await prisma.$executeRaw`PRAGMA journal_mode = WAL;`;

  // Wait up to 5 seconds for write lock (retries automatically)
  await prisma.$executeRaw`PRAGMA busy_timeout = 5000;`;

  // Slightly faster writes, still safe
  await prisma.$executeRaw`PRAGMA synchronous = NORMAL;`;
}

export { prisma, configureSQLite };
```

### Express API Example

```typescript
// server/src/index.ts
import express from 'express';
import path from 'path';
import { prisma, configureSQLite } from './db/client';

const app = express();
app.use(express.json());

// API routes
app.get('/api/people', async (req, res) => {
  const people = await prisma.person.findMany({
    include: { manager: true, teams: { include: { team: true } } }
  });
  res.json(people);
});

app.post('/api/people', async (req, res) => {
  const person = await prisma.person.create({ data: req.body });
  res.json(person);
});

// Serve React SPA static files (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

async function main() {
  await configureSQLite();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main();
```

### Local Development Setup

```typescript
// vite.config.ts (add proxy)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

Local development workflow:

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
npm run dev
```

### Azure Deployment

Build and deploy to Azure App Service:

```bash
# Build React SPA
npm run build          # Creates dist/ folder

# Build Express server
cd server && npm run build

# Deploy to Azure App Service
az webapp up --name stakeholder-app --plan stakeholder-plan --sku B1
```

Environment configuration:

```bash
# Set the database path for persistent storage
az webapp config appsettings set \
  --name stakeholder-app \
  --settings DATABASE_URL="file:/home/site/wwwroot/data/stakeholder.db"
```

### Key Dependencies

| Purpose       | Library              | Version |
| ------------- | -------------------- | ------- |
| ORM           | prisma               | ^5.x    |
| Prisma Client | @prisma/client       | ^5.x    |
| HTTP Server   | express              | ^4.x    |
| TypeScript    | typescript           | ^5.x    |

### Migration Path to PostgreSQL

When scaling beyond SQLite capacity:

1. Update `schema.prisma` datasource:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Deploy Azure Database for PostgreSQL Flexible Server
3. Run `npx prisma migrate deploy`
4. Update connection string in App Service settings

The same TypeScript code works with different databases; only the connection configuration changes.

## Related Decisions

* [SPA Framework Selection](2026-02-02-spa-framework-selection-v01.md) - React frontend that consumes this data layer
* Authentication/RBAC implementation (future ADR) - MSAL React integration with API authorization

## References

* [Prisma with SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
* [SQLite WAL Mode](https://www.sqlite.org/wal.html)
* [Azure App Service Node.js](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
* [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
* [Express.js Documentation](https://expressjs.com/)
* [Prisma Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

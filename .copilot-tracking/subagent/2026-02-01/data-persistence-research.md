# Data Persistence Options for Stakeholder Application

## Executive Summary

This document evaluates Azure data persistence options for the Stakeholder application, which manages relational data across Data Sets, Companies, Workstreams, Teams, People, and complex relationship structures. Based on comprehensive analysis, **Azure SQL Database (Serverless tier)** emerges as the recommended solution, with **Azure Cosmos DB for NoSQL** as a strong alternative depending on scaling requirements.

---

## Requirements Analysis

### Data Characteristics

| Entity | Type | Relationships |
|--------|------|---------------|
| Data Sets | Master | Owner reference |
| Companies | Entity | Teams (M:N) |
| Workstreams | Entity | People (M:N) |
| Teams | Entity | Companies (M:N), People (M:N) |
| People | Entity | Reports-To (hierarchical), Teams (M:N), Workstreams (M:N), Influence (M:N) |

### Technical Requirements

- Multi-user concurrent access with ACID compliance
- Azure Web Application deployment via Bicep IaC
- JSON import/export capability
- Complex relational queries (hierarchies, influence networks)
- RBAC integration
- Local development support
- Cost-effectiveness for small-to-medium data volumes

---

## Azure Data Options Evaluated

### 1. Azure SQL Database

#### Overview

Azure SQL Database is a fully managed relational database service built on SQL Server. It provides ACID compliance, strong consistency, and mature tooling for complex relational data.

#### Tiers Relevant to Stakeholder

| Tier | Best For | Cost Model |
|------|----------|------------|
| **Serverless** | Variable workloads with idle periods | Pay per second of compute used |
| **Basic/Standard** | Predictable workloads | Fixed monthly cost |
| **Hyperscale** | Large-scale applications | Storage-based scaling |

#### Pros for Stakeholder

- **Native relational support**: Optimal for many-to-many relationships and hierarchical data
- **Referential integrity**: Foreign key constraints ensure data consistency
- **Complex queries**: Supports recursive CTEs for hierarchy traversal, complex JOINs
- **EF Core integration**: First-class Entity Framework Core support for ASP.NET
- **JSON support**: `OPENJSON`, `FOR JSON` for import/export workflows
- **Serverless auto-pause**: Cost savings during inactive periods
- **Local development**: SQL Server LocalDB or Docker containers
- **Mature Bicep support**: Well-documented deployment patterns
- **Built-in retry logic**: Connection resilience for Azure workloads

#### Cons for Stakeholder

- **Schema rigidity**: Migrations required for schema changes
- **Less suited for graph traversals**: Self-referential queries less efficient than graph databases
- **Cost at scale**: Higher costs than NoSQL for massive throughput

#### Schema Design Approach

```sql
-- Core entities with proper normalization
CREATE TABLE DataSets (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    OwnerName NVARCHAR(255),
    OwnerEmail NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE People (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DataSetId UNIQUEIDENTIFIER NOT NULL REFERENCES DataSets(Id),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    PreferredName NVARCHAR(100),
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    Location NVARCHAR(255),
    TimeZone NVARCHAR(100),
    Title NVARCHAR(255),
    Role NVARCHAR(255),
    Notes NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    ManagerId UNIQUEIDENTIFIER REFERENCES People(Id) -- Self-referential
);

-- Many-to-many junction tables
CREATE TABLE PeopleTeams (
    PersonId UNIQUEIDENTIFIER REFERENCES People(Id),
    TeamId UNIQUEIDENTIFIER REFERENCES Teams(Id),
    PRIMARY KEY (PersonId, TeamId)
);

CREATE TABLE InfluenceRelationships (
    InfluencerId UNIQUEIDENTIFIER REFERENCES People(Id),
    InfluenceeId UNIQUEIDENTIFIER REFERENCES People(Id),
    PRIMARY KEY (InfluencerId, InfluenceeId)
);
```

#### Bicep Deployment Pattern

```bicep
param location string = resourceGroup().location
param sqlServerName string
param sqlDatabaseName string
param administratorLogin string
@secure()
param administratorPassword string

resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    version: '12.0'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'GP_S_Gen5_1'  // Serverless General Purpose
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: 1
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    autoPauseDelay: 60  // Minutes of inactivity before pause
    minCapacity: 0.5    // Minimum vCores
  }
}

resource firewallRule 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}
```

---

### 2. Azure Cosmos DB for NoSQL

#### Overview

Azure Cosmos DB is a globally distributed, multi-model NoSQL database offering multiple consistency levels. The NoSQL API stores data as JSON documents with automatic indexing.

#### Pros for Stakeholder

- **Flexible schema**: Evolve data model without migrations
- **Native JSON**: Direct alignment with JSON import/export requirement
- **Global distribution**: Multi-region replication if needed
- **Automatic indexing**: Query any field without explicit indexes
- **Horizontal scaling**: Unlimited throughput and storage potential
- **Five consistency levels**: Tunable from strong to eventual
- **Serverless option**: Pay-per-request pricing for variable workloads

#### Cons for Stakeholder

- **No referential integrity**: Application must enforce relationships
- **Complex joins**: Cross-document queries less efficient
- **Learning curve**: Different query paradigm from SQL
- **Higher cost for relational patterns**: RU consumption for joins
- **Denormalization pressure**: May require data duplication

#### Document Design Approach

```json
{
  "id": "person-guid-123",
  "type": "Person",
  "dataSetId": "dataset-guid-456",
  "firstName": "Jane",
  "lastName": "Doe",
  "preferredName": "Jane",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0100",
  "location": "Seattle, WA",
  "timeZone": "America/Los_Angeles",
  "title": "Engineering Manager",
  "role": "Decision Maker",
  "notes": "Key stakeholder for infrastructure decisions",
  "isActive": true,
  "managerId": "person-guid-789",
  "teamIds": ["team-guid-001", "team-guid-002"],
  "workstreamIds": ["ws-guid-001"],
  "influenceRelationships": [
    {"personId": "person-guid-abc", "direction": "influences"},
    {"personId": "person-guid-def", "direction": "influencedBy"}
  ]
}
```

#### Bicep Deployment Pattern

```bicep
param location string = resourceGroup().location
param accountName string
param databaseName string
param containerName string

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: accountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    enableFreeTier: true  // Free tier for development
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'  // Serverless mode
      }
    ]
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
  }
}

resource container 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: database
  name: containerName
  properties: {
    resource: {
      id: containerName
      partitionKey: {
        paths: ['/dataSetId']
        kind: 'Hash'
      }
    }
  }
}
```

---

### 3. Azure Cosmos DB for Apache Gremlin (Graph API)

#### Overview

Cosmos DB's Gremlin API provides native graph database capabilities for modeling complex relationships as vertices (nodes) and edges (relationships).

#### Pros for Stakeholder

- **Native graph model**: Ideal for organizational hierarchies and influence networks
- **Gremlin traversals**: Powerful queries for relationship paths
- **Automatic indexing**: All properties indexed by default
- **Visualization ready**: Natural fit for graph visualization requirements

#### Cons for Stakeholder

- **Overkill for simple queries**: Overhead for basic CRUD operations
- **Higher complexity**: Gremlin query language learning curve
- **Cost**: RU consumption for graph traversals
- **Limited local emulator support**: Graph API has emulator constraints
- **Recommended migration**: Microsoft recommends NoSQL API for high-scale scenarios

#### Gremlin Query Examples

```gremlin
// Find all people who report to a manager (hierarchy)
g.V('person-123').in('reportsTo').hasLabel('Person')

// Find influence network (2 hops)
g.V('person-123').out('influences').out('influences').path()

// Find all team members across companies
g.V('team-456').in('memberOf').hasLabel('Person').values('firstName', 'lastName')
```

---

### 4. Azure Database for PostgreSQL Flexible Server

#### Overview

Fully managed PostgreSQL service supporting JSON data types, recursive CTEs, and graph-like extensions.

#### Pros for Stakeholder

- **Best of both worlds**: Relational + JSON support
- **Recursive CTEs**: Efficient hierarchy queries
- **ltree extension**: Tree-structured data support
- **Lower cost**: Competitive pricing vs. SQL Database
- **Open source**: No vendor lock-in for data model
- **Strong .NET support**: Npgsql and EF Core providers

#### Cons for Stakeholder

- **Newer Azure service**: Less mature than SQL Database
- **Fewer Bicep examples**: Smaller community resources
- **No LocalDB equivalent**: Requires Docker for local development

#### Bicep Deployment Pattern

```bicep
param location string = resourceGroup().location
param serverName string
param administratorLogin string
@secure()
param administratorPassword string

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: serverName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '15'
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

resource firewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}
```

---

### 5. Azure Table Storage

#### Overview

Simple NoSQL key-value store for structured data with low cost.

#### Assessment for Stakeholder

**Not Recommended** - Azure Table Storage lacks:

- Complex query capabilities needed for relationship traversal
- Transaction support across entities
- Secondary indexes for flexible filtering
- JSON export requires manual serialization

Consider Cosmos DB Table API if key-value patterns become primary use case.

---

## Comparison Matrix

| Criteria | SQL Database | Cosmos DB NoSQL | Cosmos DB Gremlin | PostgreSQL |
|----------|--------------|-----------------|-------------------|------------|
| **Relational Data** | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| **Complex Relationships** | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| **JSON Import/Export** | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| **Graph Visualization** | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ |
| **Multi-user Concurrency** | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ |
| **Bicep Integration** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| **Local Development** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Cost (Small Scale)** | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| **EF Core Support** | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ |
| **Schema Flexibility** | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★★★☆ |

---

## Local Development Options

### Azure SQL Database

1. **SQL Server LocalDB** (Windows only)
   - Lightweight, auto-installed with Visual Studio
   - Connection: `Server=(localdb)\MSSQLLocalDB;Database=Stakeholder;Trusted_Connection=True`

2. **SQL Server Docker Container** (Cross-platform)
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
     -p 1433:1433 --name stakeholder-sql \
     mcr.microsoft.com/mssql/server:2022-latest
   ```

3. **EF Core InMemory Provider** (Unit testing)
   ```csharp
   services.AddDbContext<StakeholderContext>(options =>
       options.UseInMemoryDatabase("StakeholderTest"));
   ```

### Azure Cosmos DB

1. **Cosmos DB Emulator** (Windows/Docker)
   ```bash
   docker run -p 8081:8081 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 \
     mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest
   ```

2. **Cosmos DB Emulator Connection**
   - Endpoint: `https://localhost:8081`
   - Key: Well-known development key

### Azure PostgreSQL

1. **PostgreSQL Docker Container**
   ```bash
   docker run -e POSTGRES_PASSWORD=YourStrong@Passw0rd \
     -p 5432:5432 --name stakeholder-postgres \
     postgres:15
   ```

---

## Data Access Patterns

### Recommended: Entity Framework Core (for SQL/PostgreSQL)

```csharp
// DbContext configuration
public class StakeholderContext : DbContext
{
    public DbSet<Person> People { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Workstream> Workstreams { get; set; }
    public DbSet<InfluenceRelationship> InfluenceRelationships { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Self-referential relationship for reporting hierarchy
        modelBuilder.Entity<Person>()
            .HasOne(p => p.Manager)
            .WithMany(m => m.DirectReports)
            .HasForeignKey(p => p.ManagerId);

        // Many-to-many People-Teams
        modelBuilder.Entity<Person>()
            .HasMany(p => p.Teams)
            .WithMany(t => t.Members)
            .UsingEntity(j => j.ToTable("PeopleTeams"));
    }
}

// Program.cs configuration with resilience
builder.Services.AddDbContext<StakeholderContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("StakeholderDb"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));
```

### Alternative: Cosmos DB SDK (for NoSQL)

```csharp
// Cosmos DB client configuration
builder.Services.AddSingleton(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("CosmosDb");
    return new CosmosClient(connectionString);
});

// Repository pattern for Cosmos DB
public class PersonRepository
{
    private readonly Container _container;

    public async Task<IEnumerable<Person>> GetTeamMembersAsync(string teamId)
    {
        var query = new QueryDefinition(
            "SELECT * FROM c WHERE ARRAY_CONTAINS(c.teamIds, @teamId)")
            .WithParameter("@teamId", teamId);

        var iterator = _container.GetItemQueryIterator<Person>(query);
        var results = new List<Person>();
        
        while (iterator.HasMoreResults)
        {
            var response = await iterator.ReadNextAsync();
            results.AddRange(response);
        }
        
        return results;
    }
}
```

---

## JSON Import/Export Implementation

### SQL Database Approach

```csharp
// Export to JSON
public async Task<string> ExportDataSetAsync(Guid dataSetId)
{
    var dataSet = await _context.DataSets
        .Include(ds => ds.People)
            .ThenInclude(p => p.Teams)
        .Include(ds => ds.Companies)
        .Include(ds => ds.Workstreams)
        .FirstOrDefaultAsync(ds => ds.Id == dataSetId);

    return JsonSerializer.Serialize(dataSet, new JsonSerializerOptions
    {
        ReferenceHandler = ReferenceHandler.Preserve,
        WriteIndented = true
    });
}

// Import from JSON
public async Task ImportDataSetAsync(string json)
{
    var dataSet = JsonSerializer.Deserialize<DataSet>(json, new JsonSerializerOptions
    {
        ReferenceHandler = ReferenceHandler.Preserve
    });

    // Use transaction for atomic import
    await using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        _context.DataSets.Add(dataSet);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

---

## Cost Analysis (Estimated Monthly)

| Service | Tier | Estimated Cost | Notes |
|---------|------|----------------|-------|
| Azure SQL Database | Serverless GP | $5-50/mo | Auto-pause reduces costs significantly |
| Azure SQL Database | Basic 5 DTU | ~$5/mo | Fixed, limited performance |
| Cosmos DB | Serverless | $0-25/mo | Pay per RU, free tier available |
| Cosmos DB | 400 RU/s Provisioned | ~$24/mo | Predictable workloads |
| PostgreSQL | Burstable B1ms | ~$13/mo | Good balance of cost/performance |

*Note: Costs vary by region and usage patterns. Free tier options available for development.*

---

## Recommendation

### Primary Recommendation: Azure SQL Database (Serverless)

**Rationale:**

1. **Optimal for relational data model**: Stakeholder data has clear relational structure with many-to-many relationships. SQL databases excel at this pattern.

2. **Referential integrity**: Foreign key constraints prevent orphaned records—critical for stakeholder relationship accuracy.

3. **Complex queries**: Recursive CTEs handle reporting hierarchies efficiently. Complex JOINs support filtering and RACI matrix generation.

4. **EF Core excellence**: First-class ORM support accelerates development with migrations, LINQ queries, and change tracking.

5. **JSON support**: `FOR JSON PATH` and `OPENJSON` enable clean import/export without sacrificing relational benefits.

6. **Cost-effective**: Serverless tier auto-pauses during inactivity—ideal for an internal stakeholder tool with variable usage.

7. **Local development**: SQL Server LocalDB or Docker containers provide identical behavior to production.

8. **Mature Bicep patterns**: Extensive documentation and community examples for deployment automation.

### Alternative: Azure Cosmos DB for NoSQL

**Consider if:**

- Schema flexibility becomes paramount (frequent model changes)
- Global distribution is required
- Graph visualization features expand significantly
- Workload scales to thousands of concurrent users

### Hybrid Approach (Future Consideration)

For advanced graph visualization, consider:

- Primary data in SQL Database for transactions and consistency
- Materialized graph views in Cosmos DB Gremlin for visualization-heavy features
- Event-driven synchronization between stores

---

## Implementation Roadmap

### Phase 1: Foundation

1. Create Bicep templates for Azure SQL Database (Serverless)
2. Implement EF Core DbContext with entity configurations
3. Set up local development with SQL Server LocalDB/Docker
4. Create database migrations for initial schema

### Phase 2: Data Access Layer

1. Implement repository pattern for CRUD operations
2. Add JSON import/export services
3. Implement hierarchy traversal queries (recursive CTEs)
4. Add connection resilience configuration

### Phase 3: Integration

1. Integrate with Azure Web App deployment
2. Configure connection strings via Azure Key Vault
3. Implement database migrations in CI/CD pipeline
4. Add health checks for database connectivity

---

## References

- [Azure SQL Database documentation](https://learn.microsoft.com/en-us/azure/azure-sql/database/)
- [Azure Cosmos DB documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Entity Framework Core documentation](https://learn.microsoft.com/en-us/ef/core/)
- [Bicep database deployment quickstarts](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-bicep-quickstart)
- [Working with Data in ASP.NET Core Apps](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/work-with-data-in-asp-net-core-apps)

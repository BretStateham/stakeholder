# Purge Local Branches After PR Merge

Clean up local branches after a successful PR merge. This prompt only deletes
local branches—remote branches are left untouched for safety.

## Workflow

Execute the following steps in sequence:

### Step 1: Checkout main branch

```bash
git checkout main
```

### Step 2: Pull latest changes

```bash
git pull origin main
```

### Step 3: Discover and display branches

List all local branches and categorize by merge status:

```bash
# List merged branches (candidates for deletion)
# Exclude protected branches: main, master, develop, staging, production, release/*, hotfix/*
git branch --merged main | grep -v '^\*' | grep -vE '^\s*(main|master|develop|staging|production)\s*$' | grep -vE '^\s*(release|hotfix)/'

# List unmerged branches (will NOT be deleted)
git branch --no-merged main
```

**Note**: Branches merged via "squash and merge" may appear as unmerged because
their original commits differ from the squash commit. Verify these manually
against recent PR history before skipping.

Display the results to the user showing:

1. **Will be deleted** (merged branches)
2. **Will be skipped** (unmerged branches)

### Step 4: Get user confirmation

**STOP and ask the user to confirm deletion.** Do not proceed until the user
explicitly approves the list of branches to delete.

### Step 5: Delete confirmed branches

Only after user confirmation, delete each branch from Step 3:

```bash
# Delete local branch
git branch -d <branch-name>
```

## Safety Rules

- **NEVER** delete `main`, `master`, `develop`, `staging`, `production`, `release/*`, or `hotfix/*` branches
- **NEVER** delete unmerged branches without explicit user confirmation
- **ALWAYS** show the list of branches to be deleted before proceeding
- **ALWAYS** use `-d` (not `-D`) for local deletion to prevent accidental deletion of unmerged work

## Example Output

```
Checking out main branch...
✓ Switched to branch 'main'

Pulling latest changes...
✓ Already up to date

Analyzing branches...

WILL BE DELETED (merged into main):
  - feature/add-login
  - feature/user-dashboard
  - fix/typo-readme

WILL BE SKIPPED (unmerged):
  - feature/wip-experimental
```

**Awaiting confirmation before proceeding with deletion.**

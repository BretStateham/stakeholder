# Git Branch Cleanup After PR Merge

Clean up local and remote branches after a successful PR merge.

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

### Step 3: Validate branches are safe to delete

A branch is **safe to delete** when:

- It has been fully merged into `main`
- It is not the current branch (`main`)

List all local branches and check merge status:

```bash
# List merged branches (safe to delete)
# Exclude protected branches: main, master, develop, staging, production, release/*, hotfix/*
git branch --merged main | grep -v '^\*' | grep -vE '^\s*(main|master|develop|staging|production)\s*$' | grep -vE '^\s*(release|hotfix)/'

# List unmerged branches (NOT safe to delete - show for awareness)
git branch --no-merged main
```

**Note**: Branches merged via "squash and merge" may appear as unmerged because
their original commits differ from the squash commit. Verify these manually
against recent PR history before skipping.

**IMPORTANT**: Before proceeding, confirm with the user which branches to delete. Show:

1. **Safe branches** (merged) - these will be deleted
2. **Unsafe branches** (unmerged) - these will be skipped

### Step 4: Delete safe branches (local and remote)

For each safe branch identified in Step 3:

```bash
# Delete local branch
git branch -d <branch-name>

# Delete remote branch (if it exists on origin)
git push origin --delete <branch-name> 2>/dev/null || echo "Remote branch not found (may be local-only)"
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

SAFE TO DELETE (merged into main):
  - feature/add-login
  - feature/user-dashboard
  - fix/typo-readme

NOT SAFE (unmerged) - will be skipped:
  - feature/wip-experimental

Proceed with deletion? [y/N]
```

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
git branch --merged main | grep -v '^\*' | grep -v 'main'

# List unmerged branches (NOT safe to delete - show for awareness)
git branch --no-merged main
```

**IMPORTANT**: Before proceeding, confirm with the user which branches to delete. Show:

1. **Safe branches** (merged) - these will be deleted
2. **Unsafe branches** (unmerged) - these will be skipped

### Step 4: Delete safe branches (local and remote)

For each safe branch identified in Step 3:

```bash
# Delete local branch
git branch -d <branch-name>

# Delete remote branch (if exists)
git push origin --delete <branch-name>
```

## Safety Rules

- **NEVER** delete `main`, `master`, `develop`, or `release/*` branches
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
  - bstateha/dataModel
  - fix/typo-readme

NOT SAFE (unmerged) - will be skipped:
  - feature/wip-experimental

Proceed with deletion? [y/N]
```

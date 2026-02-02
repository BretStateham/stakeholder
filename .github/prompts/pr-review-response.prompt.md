# PR Review Response Handler

Respond to all comments on a GitHub pull request review. Handle PR-level comments and file-level inline comments appropriately.

## Input

The user provides a PR URL in one of these formats:
- `https://github.com/{owner}/{repo}/pull/{number}`
- `https://github.com/{owner}/{repo}/pull/{number}/files`
- `https://github.com/{owner}/{repo}/pull/{number}#pullrequestreview-{id}`

## Workflow

Execute the following steps in sequence:

### Step 1: Extract PR information

Parse the PR URL to extract:
- Repository owner
- Repository name
- PR number

```bash
# Example: Extract from URL
OWNER="owner"
REPO="repo"
PR_NUMBER="123"
```

### Step 2: Checkout the PR branch

Ensure you're working on the correct branch:

```bash
gh pr checkout <PR_NUMBER> --repo <OWNER>/<REPO>
```

### Step 3: Retrieve all review comments

Fetch both PR-level comments and file-level review threads:

```bash
# Get PR details including reviews and comments
gh pr view <PR_NUMBER> --repo <OWNER>/<REPO> --json reviews,comments,reviewThreads,number,headRefName

# Get detailed review threads with file positions
gh api repos/<OWNER>/<REPO>/pulls/<PR_NUMBER>/comments
```

### Step 4: Categorize each comment

For each comment, determine its type:

1. **Actionable suggestion** - Reviewer suggests a specific code change
2. **Question** - Reviewer asks for clarification or explanation
3. **Disagreement point** - Comment where you disagree with the suggestion

### Step 5: Process each comment

For each comment, follow the appropriate handling path:

#### Path A: Agree with actionable suggestion

1. **Implement the change** in the local codebase
2. **Stage and commit** with a descriptive message referencing the comment:
   ```bash
   git add <changed-files>
   git commit -m "Address review: <brief description>

   Implements suggestion from <reviewer> regarding <topic>"
   ```
3. **Push the changes**:
   ```bash
   git push
   ```
4. **Reply to the comment** acknowledging the change:
   ```bash
   # For PR-level comments
   gh pr comment <PR_NUMBER> --repo <OWNER>/<REPO> --body "✅ Addressed in commit <short-sha>. <brief explanation of change>"

   # For file-level review thread comments, use GraphQL to reply
   gh api graphql -f query='
     mutation AddReply($threadId: ID!, $body: String!) {
       addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
         comment {
           id
         }
       }
     }
   ' -f threadId="<THREAD_ID>" -f body="✅ Addressed in commit <short-sha>. <brief explanation>"
   ```
5. **Resolve the thread** (for file-level comments only):
   ```bash
   gh api graphql -f query='
     mutation ResolveThread($threadId: ID!) {
       resolveReviewThread(input: {threadId: $threadId}) {
         thread {
           isResolved
         }
       }
     }
   ' -f threadId="<THREAD_ID>"
   ```

#### Path B: Disagree with suggestion

1. **Reply to the comment** explaining your reasoning:
   ```bash
   # For PR-level comments
   gh pr comment <PR_NUMBER> --repo <OWNER>/<REPO> --body "I'd prefer to keep the current approach because:

   <clear explanation with reasoning>

   <optional: offer alternative or compromise>"

   # For file-level comments
   gh api graphql -f query='
     mutation AddReply($threadId: ID!, $body: String!) {
       addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
         comment {
           id
         }
       }
     }
   ' -f threadId="<THREAD_ID>" -f body="I'd prefer to keep the current approach because:

   <clear explanation>

   Happy to discuss further if you have concerns."
   ```

**Do NOT resolve threads where you disagree** - leave them open for continued discussion.

#### Path C: Answer a question

1. **Reply with the answer**:
   ```bash
   # For PR-level comments
   gh pr comment <PR_NUMBER> --repo <OWNER>/<REPO> --body "<answer to the question>"

   # For file-level comments
   gh api graphql -f query='
     mutation AddReply($threadId: ID!, $body: String!) {
       addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
         comment {
           id
         }
       }
     }
   ' -f threadId="<THREAD_ID>" -f body="<answer to the question>"
   ```

2. **Optionally resolve** if the question doesn't require follow-up action.

### Step 6: Batch commits when appropriate

When multiple suggestions affect related code:

1. Group related changes into a single commit
2. Reference all addressed comments in the commit message
3. Reply to each individual comment with the shared commit SHA

### Step 7: Post summary comment

After processing all comments, post a summary to the PR:

```bash
gh pr comment <PR_NUMBER> --repo <OWNER>/<REPO> --body "## Review Response Summary

### ✅ Implemented
- <list of implemented suggestions with commit refs>

### 💬 Responded
- <list of questions answered or disagreements explained>

### ❓ Needs Clarification
- <any items requiring further discussion>

---
All feedback has been addressed. Ready for re-review."
```

## Getting Thread IDs

To get the thread ID for file-level comments:

```bash
# List all review threads with their IDs
gh api graphql -f query='
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            comments(first: 10) {
              nodes {
                body
                path
                author {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
' -f owner="<OWNER>" -f repo="<REPO>" -F number=<PR_NUMBER>
```

## Response Guidelines

When replying to comments:

- **Be concise** - Acknowledge the feedback without over-explaining
- **Be specific** - Reference exact commits, line numbers, or code changes
- **Be professional** - Thank reviewers for valuable suggestions
- **Be open** - When disagreeing, invite further discussion

## Safety Rules

- **NEVER** force push without explicit user confirmation
- **NEVER** resolve threads where you've expressed disagreement
- **ALWAYS** commit changes before replying to ensure SHA accuracy
- **ALWAYS** show the user what changes will be made before implementing
- **ALWAYS** confirm with the user before posting responses to comments

## Example Output

```
Processing PR #42 review comments...

Found 5 comments to address:

1. [FILE] src/utils.ts:15 - @reviewer1: "Consider using const instead of let"
   → AGREE: Will implement change

2. [FILE] src/handler.ts:42 - @reviewer1: "This could be simplified"
   → AGREE: Will refactor

3. [PR] @reviewer2: "Why did you choose this approach?"
   → QUESTION: Will answer

4. [FILE] src/types.ts:8 - @reviewer2: "Remove this unused import"
   → AGREE: Will implement

5. [FILE] src/config.ts:20 - @reviewer1: "Change timeout to 5000"
   → DISAGREE: Current value is intentional for slow networks

Proceed with changes? [y/N]
```
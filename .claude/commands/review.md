---
description: Review current branch diff against a base branch
argument-hint: [base-branch, default origin/main]
---

Base branch: ${ARGUMENTS:-origin/main}

## Changed Files

!`git diff --name-only ${ARGUMENTS:-origin/main}...HEAD`

## Diff Stat

!`git diff --stat ${ARGUMENTS:-origin/main}...HEAD`

## Diff

!`git diff ${ARGUMENTS:-origin/main}...HEAD`

Review the diff as a senior engineer. Lead with findings ordered by severity. Focus on correctness, regressions, missing tests, security, and maintainability. Avoid broad style commentary.

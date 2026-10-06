---
name: create-prd
description: Use when the user wants a PRD, feature brief, product plan, or Ralph-ready story decomposition before implementation.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Create PRD

Create a markdown PRD in `docs/prds/` and, when Ralph execution is requested, convert it into `.agent/ralph/runs/<name>/prd.json`.

The PRD should include:

- Problem
- Target user
- Goals and non-goals
- User stories
- Acceptance criteria
- Technical notes
- Risks
- Verification plan

Do not implement during this skill unless explicitly asked.

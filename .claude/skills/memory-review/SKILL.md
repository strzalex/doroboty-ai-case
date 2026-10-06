---
name: memory-review
description: Use after completing substantial work, review findings, repeated failures, or user corrections to propose durable learning updates.
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

# Memory Review

Run `./scripts/agent/memory-review` and inspect the draft.

Classify lessons as:

- Keep local in `docs/learnings/`
- Promote to project docs or rules
- Propose promotion to template
- Propose promotion to global memory
- Discard

Never mutate global memory without explicit user approval.

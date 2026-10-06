---
name: ralph-run
description: Use when asked to run Ralph, launch an autonomous execution loop, or execute Ralph stories from prd.json.
allowed-tools: Bash, Read, Grep, Glob
---

# Ralph Run

Always run the real project command:

```bash
./scripts/agent/run-ralph <run-name> <claude|amp> <iterations>
```

Do not simulate iterations in chat. If the command cannot run, report the exact blocker.

@AGENTS.md

## Claude Code

Keep this file short. Put long project-specific rules in `.claude/rules/` or linked docs.

When asked to run Ralph, execute the real command:

```bash
./scripts/agent/run-ralph <run-name> <tool> <iterations>
```

Do not simulate Ralph iterations in chat. Do not claim Ralph ran unless the command actually executed.

When planning, prefer a durable artifact in `docs/prds/` or `docs/tasks/` over chat-only plans.

When reviewing, inspect the actual diff against the base branch and lead with findings.

# Working on DoRoboty.ai Case

This repository is the AIPH3 teaching application, not the public DoRoboty.ai production site.
Read `BRIEF.md`, `docs/case/CASE_PROTOCOL.md`, and `TODO.md` before planning product work.

## Agentic Workflow

For anything larger than a one-line change:

1. Capture intent in `BRIEF.md`, `TODO.md`, `docs/prds/`, or `docs/tasks/`.
2. Work in a task branch or worktree.
3. Implement against explicit acceptance criteria.
4. Run `./scripts/verify` before claiming completion.
5. Use a separate review pass before merging.
6. Record durable project lessons in `docs/learnings/` when needed.

Do not let multiple agents write in the same worktree.

Useful commands:

- `./scripts/bootstrap` prepares local tooling and validates the harness.
- `./scripts/verify` runs the project health check.
- `./scripts/agent/new-task <name>` creates a task worktree and task note.
- `./scripts/agent/new-ralph-run <name>` creates a Ralph run folder.
- `./scripts/agent/run-ralph <name> [claude|amp] [iterations]` runs the real Ralph loop.

## Standards

- Write code identifiers, authored documentation, comments, and commit messages in English.
  End-user UI is Polish. Preserve Polish wording in canonical AIPH3 source material.
- Use npm and Node 24; maintain package-lock.json. Do not add a second package manager.
- Use the existing shadcn/ui (Base UI) components, tokens, and form pattern. Current components use `render`, not Radix's `asChild`.
- Place new features in src/features; pages compose features, and src/components/ui holds shared primitives.
- Mark server libraries `server-only`. Every mutation must verify the session and validate input with Zod. Do not rely on layouts alone for authorization.
- Share input schemas between forms and the server.
- The demo must run without secrets, services, or Docker. A Supabase failure must never switch the real application to demo mode.
- The demo uses static data. Do not add domain tables, migrations, or localStorage data persistence to it.
- Save database changes as new migrations. Test RLS with two accounts; never use service_role for normal user operations.
- Do not log tokens, passwords, cookies, or user data. NEXT_PUBLIC values are available in the browser.

## Validation

- `npm run format` formats the code; `npm run check` verifies formatting, lint, types, tests, the build, and demo E2E tests.
- After auth or database changes: start Docker, run `npm run db:start`, `npm run test:integration`, and `npm run db:stop`.
- Integration tests use only local Supabase. Never reset a cloud database to run a test.
- Check the UI on mobile and desktop, including error states and keyboard support. Prefer behavior tests over tests that mirror the implementation.
- Report what was actually verified. A passing local build does not prove that CI or deployment works.

## Definition Of Done

Do not claim completion unless acceptance criteria are satisfied or explicitly deferred,
relevant checks have run, `./scripts/verify` passes or its failures are clearly explained,
and review findings are resolved or explicitly deferred.

## Extending the starter

Define the expected behavior first, then add the schema, data, interface, and appropriate tests. Architecture instructions are in docs/architecture.md. Keep README short; document service details in docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

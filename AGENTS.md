# Working on Superstarter

## Standards

- Write all repository content, UI text, documentation, comments, code identifiers, and commit messages in English.
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

## Extending the starter

Define the expected behavior first, then add the schema, data, interface, and appropriate tests. Architecture instructions are in docs/architecture.md. Keep README short; document service details in docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

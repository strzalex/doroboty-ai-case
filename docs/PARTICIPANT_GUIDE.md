# DoRoboty.ai participant guide

This guide takes a clean checkout to a shareable course deployment without relying on instructor chat history.

## What you receive

- a participant repository or release archive containing only the currently unlocked stage;
- one synthetic evidence packet and its release key;
- acceptance criteria for the current week;
- no production candidate data, instructor credentials, or future-stage fixtures.

## Technical path

Requirements: Git, Docker Desktop, Node.js 24, and npm.

```sh
git clone <participant-repository-url> doroboty-ai
cd doroboty-ai
./scripts/setup-case
npm run dev
```

Open `http://localhost:3000`. Supabase Studio is at `http://localhost:54323`; local email is at `http://localhost:54324`.

The setup command checks tools, installs the locked dependency tree, starts local Supabase, rebuilds the database, validates the case fixtures, and runs product checks. It refuses unsupported Node versions and does not connect to a remote database.

## Guided path

If you do not maintain a local development environment, fork the prepared participant repository, import it into Vercel, and connect an isolated Supabase project by following [`deployment.md`](deployment.md). Never use a production database or an instructor project.

## Current context

Read, in order:

1. [`../BRIEF.md`](../BRIEF.md) for the product and outcome;
2. [`case/CASE_PROTOCOL.md`](case/CASE_PROTOCOL.md) only through the stage named in your packet;
3. [`case/DATA_DICTIONARY.md`](case/DATA_DICTIONARY.md) for joins and metric definitions;
4. the current task in `docs/tasks/`.

## Configuration behavior

- Missing Supabase: public fixture marketplace and setup notice work; authenticated routes do not silently use demo data.
- Missing PostHog: product flows work and typed analytics calls become no-ops.
- Missing AI key: deterministic course provider is used unless `AI_PROVIDER=openai-compatible` is explicitly selected.
- Invalid public Supabase credentials: startup shows a safe configuration notice. Secret/service-role keys are rejected.

## Before sharing

Run `./scripts/verify`, create a new test account, confirm the email, complete one candidate flow, and verify a second account cannot read it. Share only synthetic data and test accounts. Remove test notes containing names, emails, phone numbers, or private URLs.

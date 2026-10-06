# DoRoboty.ai — AIPH3 case application

DoRoboty.ai is the prepared spanning-case application for AI Product Heroes 3. It is a
separate teaching environment built from
[Superstarter](https://github.com/superhero-tech/superstarter), not the public
DoRoboty.ai production portal.

Participants use the same product story across the program: diagnose why more job
applications do not create more useful recruiting conversations, prototype AI writing
assistance, measure the result, and discover when polished text stops carrying the
signals needed for a hiring decision.

## Start here

1. Read [`BRIEF.md`](BRIEF.md).
2. Read [`docs/case/CASE_PROTOCOL.md`](docs/case/CASE_PROTOCOL.md).
3. Follow [`TODO.md`](TODO.md) in milestone order.
4. Use the preserved source material under [`docs/source/`](docs/source/).

## Local development

Requirements: Node.js 24 and npm.

```sh
npm ci
npm run dev
```

The inherited static demo is available at `http://localhost:3000/demo` until the first
case-specific product slice replaces it. Supabase Auth and integration tests are
documented in [`docs/supabase.md`](docs/supabase.md).

## Verification

```sh
./scripts/verify
```

The project uses the agentic harness documented in [`AGENTS.md`](AGENTS.md).

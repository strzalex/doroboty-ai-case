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
3. Follow the sprint order in [`TODO.md`](TODO.md).
4. Use the preserved source material under [`docs/source/`](docs/source/).

## Local development

Requirements: Node.js 24 and npm.

```sh
npm ci
npm run dev
```

The public marketplace works with deterministic fixtures when Supabase is absent. Authenticated candidate, employer, AI, and instructor workflows require Supabase and never silently fall back after it is configured. See the [participant guide](docs/PARTICIPANT_GUIDE.md) and [Supabase runbook](docs/supabase.md).

## Verification

```sh
./scripts/verify
```

The project uses the agentic harness documented in [`AGENTS.md`](AGENTS.md).

The instructor release model, synthetic data dictionary, discovery packet, real-person test, pilot, and Demo Day runbooks are under [`docs/case/`](docs/case/).

# S1 — Marketplace foundation

## Intent

Replace the inherited starter landing experience with the first complete DoRoboty.ai
vertical slice: branded public browsing backed by a versioned domain schema and
deterministic course fixtures.

## Acceptance criteria

- The homepage, listing, job detail, company detail, methodology, privacy, 404, and error
  states are available in Polish and work without client JavaScript.
- Job filters are encoded in the URL and share a validated parser with tests.
- Public pages use deterministic fixtures only when Supabase is unconfigured; a configured
  Supabase query failure is surfaced and never silently falls back.
- The first migration creates companies, jobs, private employer briefs, immutable job text
  versions, constraints, indexes, and RLS.
- Published fixtures cover Build / Apply / Lead and multiple functions and working modes.
- Metadata and JSON-LD are emitted for public job and company pages.
- `./scripts/verify` passes before the sprint commit.

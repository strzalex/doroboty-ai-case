# Security review

## Boundaries

The browser receives only a Supabase publishable key. Secret/service-role keys are rejected by environment validation. Normal reads and writes are caller-scoped by RLS; security-definer functions re-check identity, role, organization, resource relation, lengths, and controlled enums. Candidate submission is one database transaction. AI source and output never enter browser telemetry.

## Dependency audit, 2026-10-06

`npm audit --omit=dev` reports zero production vulnerabilities. The full audit reports nine high-severity development-only findings rooted in `braces <=3.0.3`, reached through current `eslint-config-next` and the shadcn CLI. The registry currently exposes no patched `braces` release. npm's proposed “fix” downgrades incompatible major versions of Next lint config and shadcn, so it is not applied.

Risk is limited to trusted build-time glob patterns in CI/developer tools; those packages are not part of the production server dependency set. Recheck on every dependency update and remove the exception as soon as upstream publishes a compatible fix. Do not run the shadcn CLI against untrusted registries or attacker-controlled glob input.

## Release checks

Run production audit, secret scanning, source-map inspection, RLS integration tests, and a clean build. Disable public browser source maps. Confirm Vercel and Supabase logs contain no tokens, prompts, free text, or contact details.

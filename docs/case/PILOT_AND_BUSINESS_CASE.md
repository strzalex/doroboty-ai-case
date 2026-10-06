# Organizational pilot and business case

## Fictional organization

Sponsor: Marta Nowak, VP People at BrightLabs. Decision owner: Head of Talent. Operators: two recruiters and three hiring managers. The organization can pilot on two AI-related roles for 30 days, cannot export candidate free text to third-party analytics, and requires a human decision at every recruiting stage.

## Transparent cost inputs

| Input                          | Default assumption |
| ------------------------------ | -----------------: |
| AI generation                  |         €0.04 each |
| Product hosting and monitoring |       €180 / month |
| Recruiter loaded time          |         €38 / hour |
| Hiring-manager loaded time     |         €65 / hour |
| Participant implementation     |           32 hours |
| Training and support           |            8 hours |

These are synthetic inputs. Replace them only with an approved course release. Do not infer value from application volume alone.

## 30-day pilot template

- Baseline: employer continuation after first conversation per eligible role.
- Target: improve that outcome by an agreed absolute margin while holding candidate complaints and review time within guardrails.
- Guardrails: no unauthorized data access, no automated hiring decisions, no increase in median review time above 15%, no PII in PostHog.
- Sample: two roles, all eligible synthetic applications, assignment and exposure reported separately.
- Owners: sponsor owns continue/stop; recruiter owns operation; product owner owns instrumentation; privacy owner owns retention/deletion review.
- Decision rule: expand only when the primary outcome clears the target and every guardrail passes. Otherwise iterate or stop.
- Rollback: disable AI provider, retain human-authored versions, revert to the prior Vercel deployment, and do not reverse database migrations without a tested restore.

## Adoption metrics

- Candidate: eligible users exposed, draft requested, draft approved, draft discarded.
- Recruiter: eligible job briefs, draft requested, version approved, time to approved copy.
- Hiring manager: applications reviewed, evidence opened, first-conversation decision recorded.

## Privacy and retention

Source evidence and generated copy stay in Supabase under RLS. PostHog receives only contract-approved pseudonymous events. The model provider receives the minimum source payload for one generation. Document provider region, retention, subprocessors, deletion route, and incident contact before using real-person data. Course fixtures are synthetic and can be reset. Account deletion must remove owned candidate records through database cascades or an operator-approved workflow.

## Business-case formula

Use incremental successful continuations, not incremental submissions:

`value = eligible conversations × (pilot continuation rate − baseline rate) × value per useful continuation`

`cost = AI generations × unit cost + hosting + recruiter time + hiring-manager time + implementation + support`

Report assumptions, range, break-even point, and confidence. A negative or uncertain result is a valid pilot decision.

# DoRoboty.ai AIPH3 Case — Engineering TODO

This plan turns the Superstarter fork into the prepared spanning-case application for AI
Product Heroes 3. Complete milestones in order unless a task explicitly says otherwise.

The canonical product intent is in [`BRIEF.md`](BRIEF.md). The teaching sequence, data
invariants, and anti-spoiler rules are in
[`docs/case/CASE_PROTOCOL.md`](docs/case/CASE_PROTOCOL.md).

## Fixed decisions

- Keep this case application separate from the public Astro DoRoboty.ai portal.
- Use Next.js App Router, React, TypeScript, Node.js 24, and npm.
- Use the inherited shadcn/ui Base UI components and adapt tokens to DoRoboty.ai.
- Use Supabase Auth and PostgreSQL with caller-scoped RLS for normal user operations.
- Use synthetic, deterministic course data only. Never import production candidate data.
- Use Polish for end-user product UI and English for code and authored engineering docs.
- Preserve human approval for all AI-generated job and application text.
- Store source, generated, edited, and final text separately.
- Treat the text fit score as a deliberately limited case proxy, never as a hiring decision.
- Store operational recruiting outcomes in Supabase and non-PII interactions in PostHog EU.
- Do not ship the final work-evidence solution in the baseline product.
- Do not start M5 until the M4 case-data validation gate passes.

## Delivery sprints

| Sprint                             | Outcome                                                          | Milestones |
| ---------------------------------- | ---------------------------------------------------------------- | ---------- |
| **S0 — Case foundation**           | Fork, brand, canonical context, and reproducible project health  | M0         |
| **S1 — Marketplace shell**         | Branded public job experience and secure domain foundation       | M1         |
| **S2 — Two-sided transaction**     | Authenticated candidates apply and employers record outcomes     | M2, M3     |
| **S3 — Discoverable case**         | Reproducible baseline, one-click history, and staged evidence    | M4         |
| **S4 — AI intervention**           | Human-approved AI writing tools and measurable text-fit proxy    | M5         |
| **S5 — Deploy and learn**          | Experiments, analytics, exports, and participant deployment path | M6, M7     |
| **S6 — Organization and Demo Day** | Pilot, business case, rehearsal, and release hardening           | M8, M9     |

---

## M0 — Fork, product contract, and repository health

- [x] **M0-01** Fork `superhero-tech/superstarter` under the authenticated GitHub account
      and retain the upstream remote.
- [x] **M0-02** Clone the fork as the separate local project `doroboty-case`.
- [x] **M0-03** Sync the standard agentic harness without overwriting Superstarter's
      project-specific rules.
- [x] **M0-04** Merge harness workflow rules with Superstarter's Next.js, security, RLS,
      and validation rules.
- [x] **M0-05** Preserve the public MVP brief and TODO, the current AIPH3 case one-pager,
      canonical program, and supporting research under `docs/source/`.
- [x] **M0-06** Add the case-specific `BRIEF.md`, case protocol, architecture decision,
      and this ordered implementation plan.
- [x] **M0-07** Rename product metadata, package identity, Supabase local project, auth email
      subjects, and visible shell branding to DoRoboty.ai.
- [x] **M0-08** Replace inherited generic dashboard copy and imagery with a minimal
      DoRoboty.ai case landing state without implementing later case stages.
- [x] **M0-09** Make `./scripts/bootstrap`, `./scripts/verify`, and CI pass from a clean clone.
- [x] **M0-10** Review and resolve dependency audit findings without applying unsafe forced
      upgrades.
- [x] **M0-11** Configure GitHub branch protection and required checks for the fork.

### M0 Definition of Done

- [x] A fresh clone installs with Node 24 and `npm ci`.
- [x] `./scripts/verify` passes.
- [x] The application and repository present themselves as DoRoboty.ai Case.
- [x] Every implementation agent can find the canonical brief, protocol, source material,
      and next task without relying on chat history.

---

## M1 — DoRoboty.ai marketplace shell and domain foundation

- [x] **M1-01** Port the approved DoRoboty.ai colors, typography, spacing, border, shadow,
      focus, and motion tokens into the Base UI shadcn theme.
- [x] **M1-02** Replace the inherited generic dashboard navigation with candidate,
      employer, and operator workspace navigation that remains role-aware.
- [x] **M1-03** Build Polish public routes for homepage, jobs, job detail, company detail,
      methodology, privacy, not-found, and safe error states.
- [x] **M1-04** Implement responsive job browsing and URL-synchronized filters using the
      Build / Apply / Lead taxonomy.
- [x] **M1-05** Add `companies` and `jobs` migrations using the public portal's domain model
      as input, adjusted for internal applications and versioned job text.
- [x] **M1-06** Add job publication, verification, and expiry states plus indexes and
      constraints required by public reads.
- [x] **M1-07** Add `employer_briefs` and `job_text_versions`; keep the private source brief
      separate from the published job description.
- [x] **M1-08** Define public read policies for published jobs and companies and deny public
      access to briefs and case-only operational data.
- [x] **M1-09** Add deterministic companies and jobs covering categories, functions,
      seniority, working modes, and disclosed or undisclosed compensation.
- [x] **M1-10** Add server-side job queries and error handling; never fall back to demo data
      after a configured Supabase failure.
- [x] **M1-11** Add semantic metadata and `JobPosting` / `Organization` structured data to
      make the product surface realistic, without rebuilding the full public SEO program.
- [x] **M1-12** Add unit, integration, E2E, keyboard, and accessibility coverage for public
      browsing.

### M1 Definition of Done

- [x] An anonymous visitor can browse and filter realistic DoRoboty.ai jobs on mobile and
      desktop.
- [x] Private employer briefs are impossible to read anonymously.
- [x] Public screens visually belong to DoRoboty.ai rather than Superstarter.
- [x] Clean seeds reproduce the same jobs and IDs on every machine.

---

## M2 — Identity, roles, and source evidence

- [x] **M2-01** Translate and brand inherited sign-up, confirmation, sign-in, recovery,
      password update, and sign-out flows.
- [x] **M2-02** Create `profiles` linked to `auth.users` with controlled candidate,
      employer, and operator roles.
- [x] **M2-03** Create `organizations` and `organization_memberships`; support recruiter and
      hiring-manager membership without implementing full enterprise administration.
- [x] **M2-04** Create `candidate_profiles`, `candidate_experiences`, and
      `candidate_work_samples` with explicit ownership and visibility rules.
- [x] **M2-05** Store structured candidate source evidence separately from any generated
      application answer.
- [x] **M2-06** Add profile and organization onboarding with clear empty, validation,
      retry, and success states.
- [x] **M2-07** Authorize every mutation independently on the server; do not rely on layouts
      or client navigation for access control.
- [x] **M2-08** Add RLS covering self-owned candidate data, organization-owned employer data,
      operator access, and forbidden cross-account reads.
- [x] **M2-09** Add deterministic local accounts for each role through test-only setup; do
      not ship shared production passwords.
- [x] **M2-10** Extend two-account integration tests to prove tenant and role isolation.

### M2 Definition of Done

- [x] Candidate, employer, and operator sessions land in the correct workspace.
- [x] A candidate cannot read another candidate's source evidence or applications.
- [x] An employer cannot read applications for another organization.
- [x] Test fixtures can create stable role-based accounts locally and in isolated course
      previews.

---

## M3 — Internal applications and recruiting outcomes

- [x] **M3-01** Create `applications` with stable candidate, job, organization, variant,
      source snapshot, timestamps, and a controlled lifecycle.
- [x] **M3-02** Create immutable `application_stage_events` for submitted, reviewed,
      interview invited, first conversation held, continued, rejected, withdrawn, and hired.
- [x] **M3-03** Create `interview_outcomes` with a first-conversation decision and optional
      later hiring result.
- [x] **M3-04** Build the baseline long-form application flow with explicit start,
      validation, submission, retry, and confirmation states.
- [x] **M3-05** Snapshot the candidate evidence used at submission so later profile edits do
      not rewrite history.
- [x] **M3-06** Build an employer application inbox with filters and evidence inspection.
- [x] **M3-07** Allow authorized employers to record review, invitation, conversation, and
      continue/reject decisions with an audit trail.
- [x] **M3-08** Add a controlled one-click application variant that uses a previously saved
      profile and still requires a deliberate confirmation.
- [x] **M3-09** Store assignment and actual exposure separately so failed or bypassed
      rendering does not count as treatment.
- [x] **M3-10** Instrument application starts and submissions; derive abandonment rather
      than sending a browser “abandoned” event.
- [x] **M3-11** Add idempotency and duplicate-submission protection.
- [x] **M3-12** Add E2E coverage for long form, one-click, employer review, and the first
      conversation decision.

### M3 Definition of Done

- [x] The complete required outcome chain is joinable by stable identifiers.
- [x] One-click apply reduces interface work without bypassing consent or authorization.
- [x] The primary outcome can be calculated per job and per experiment cohort.
- [x] No real PII is needed to demonstrate the flow.

---

## M4 — Case data, staged evidence, and discovery gate

- [x] **M4-01** Define a data dictionary for every case table, enum, derived metric, and
      timestamp.
- [x] **M4-02** Define versioned `case_releases` for baseline, post-one-click, discovery,
      post-AI, organizational pilot, and Demo Day.
- [x] **M4-03** Create deterministic seed generators or committed fixtures for every
      release while preserving stable entity IDs.
- [x] **M4-04** Build baseline data with meaningful long-form abandonment.
- [x] **M4-05** Build the post-one-click snapshot with higher submissions and a flat
      employer-continued-after-first-conversation outcome.
- [x] **M4-06** Create candidate and employer transcripts tied to concrete jobs and
      applications; include at least three independent qualitative sources.
- [x] **M4-07** Create tickets, sales notes, and public-review substitutes for participants
      who cannot access live users during discovery.
- [x] **M4-08** Include several plausible diagnoses and confounders: job family, seniority,
      employer readiness, candidate experience, and language background.
- [x] **M4-09** Add instructor-only reset, release selection, and seed verification tools.
- [x] **M4-10** Export analysis-ready CSV files and provide example joins without providing
      the final analytical conclusion.
- [x] **M4-11** Add automated fixture assertions for counts, funnel ratios, joins, missing
      data, stage order, and prohibited early reveals.
- [ ] **M4-12** Red-team the dataset with an independent reviewer using the gate in the case
      protocol.

### M4 Definition of Done

- [x] A participant can distinguish application conversion from recruiting outcome.
- [x] Week-2 evidence supports multiple plausible explanations and ends with a decision.
- [x] The dataset is internally consistent and reproducible from an empty database.
- [x] The later AI/signal-loss answer is not named or trivially visible.
- [ ] M4's independent red-team gate passes before any M5 implementation begins.

---

## M5 — Human-approved AI assistance and text-fit proxy

- [x] **M5-01** Define a server-only AI provider interface and deterministic test provider.
- [x] **M5-02** Add secrets, quotas, timeouts, retry policy, structured logging, and safe
      failure behavior without exposing prompts or user content to browser logs.
- [x] **M5-03** Create immutable `ai_generations` with purpose, provider/model metadata,
      source-version references, output, latency, cost metadata, and outcome status.
- [x] **M5-04** Build employer job drafting from a private source brief with review, edit,
      discard, and approve actions.
- [x] **M5-05** Build candidate “why I fit” drafting from selected source experiences with
      review, edit, discard, and approve actions.
- [x] **M5-06** Store generated and final versions without overwriting source evidence.
- [x] **M5-07** Create `fit_scores` with an explicit version, inputs, components, and
      calculation timestamp.
- [x] **M5-08** Implement the initial fit score as text similarity only; label it accurately
      and prevent its use as an automated hiring action.
- [x] **M5-09** Independently assign employer AI and candidate AI treatments.
- [x] **M5-10** Generate post-AI fixtures in which text quality and fit scores rise while the
      primary outcome remains flat.
- [x] **M5-11** Include counterexamples and segments in which AI improves clarity or removes
      a language barrier without degrading decision quality.
- [x] **M5-12** Add model-output safety, authorization, provenance, cost, and failure tests.

### M5 Definition of Done

- [x] Both AI tools are usable but require human approval.
- [x] Source truth, generated text, final text, and exposure can be compared independently.
- [x] Employer and candidate interventions can be analyzed separately and together.
- [x] Tests prove that AI use never directly changes a recruiting decision.

---

## M6 — Experiments, product analytics, and learning surfaces

- [x] **M6-01** Create experiment assignment and exposure tables with mutually exclusive,
      stable variants.
- [x] **M6-02** Define a typed PostHog event contract for job views, application starts and
      submissions, one-click use, AI generation and approval, and employer reviews.
- [x] **M6-03** Prevent email, name, phone, free text, generated text, URLs with query data,
      and other PII from entering telemetry.
- [x] **M6-04** Keep recruiting stage changes and interview outcomes in Supabase rather than
      browser telemetry.
- [x] **M6-05** Build instructor analysis views for completion, invitations, completed first
      conversations, continuation, and hiring by cohort.
- [x] **M6-06** Build comparison views for text quality, fit-score distribution, and the
      relationship between fit score and downstream outcome before and after AI.
- [x] **M6-07** Add segment controls that help evaluate confounders without presenting a
      causal claim from raw before/after data.
- [x] **M6-08** Add participant-safe exports that omit future releases and hidden source
      evidence.
- [x] **M6-09** Add contract tests for event names, properties, assignment/exposure logic,
      and PII rejection.
- [x] **M6-10** Validate that the intended insight requires joining quantitative results,
      qualitative evidence, provenance, and downstream outcomes.

### M6 Definition of Done

- [x] A participant can reproduce the expected funnel and cohort comparisons.
- [x] The product makes proxy and outcome metrics visibly distinct.
- [x] No dashboard labels the final answer or overstates causality.
- [x] Analytics can be disabled locally without breaking the product flow.

---

## M7 — Participant fork, deployment, and real-person test

- [x] **M7-01** Write a zero-to-running participant guide for technical and non-technical
      paths.
- [x] **M7-02** Provide a one-command local setup that checks Node, installs dependencies,
      starts Supabase, resets fixtures, and verifies the selected case release.
- [x] **M7-03** Provide scoped agent context covering product intent, architecture, data
      dictionary, case stage, and current acceptance criteria.
- [x] **M7-04** Document how each participant forks without retaining instructor secrets or
      future-stage fixtures in a visible branch.
- [x] **M7-05** Create preview and participant deployment instructions for Vercel and
      isolated Supabase projects.
- [x] **M7-06** Add environment validation and fail-safe setup notices for missing Supabase,
      PostHog, or AI configuration.
- [x] **M7-07** Provide a week-3 test script, consent guidance, observation notes, and a way
      to record learning from one real person without collecting unnecessary PII.
- [ ] **M7-08** Verify that a participant can share an authenticated deployment with another
      person.
- [ ] **M7-09** Test the full fork → configure → build → deploy workflow from a clean GitHub
      account or isolated rehearsal organization.
- [x] **M7-10** Ensure release packets can be distributed without exposing later answers in
      git history, static assets, source maps, or database policies.

### M7 Definition of Done

- [ ] A participant can fork, configure, deploy, log in, and share the product.
- [ ] A real-person prototype test is feasible without instructor intervention.
- [x] Future case stages remain inaccessible until explicitly released.
- [x] The same guide works for a clean technical-path checkout.

---

## M8 — Organizational pilot, business case, and Demo Day

- [x] **M8-01** Define the fictional sponsor, employer organization, decision owner,
      operating constraints, and approval path.
- [x] **M8-02** Add synthetic cost inputs for AI usage, product operation, recruiter time,
      participant implementation, and support.
- [x] **M8-03** Add privacy and data-processing constraints covering candidate evidence,
      model providers, retention, access, and deletion.
- [x] **M8-04** Define adoption metrics separately for recruiters, hiring managers, and
      candidates.
- [x] **M8-05** Provide a 30-day pilot template with baseline, target, guardrails, owner,
      sample, instrumentation, decision rule, and rollback.
- [x] **M8-06** Provide a business-case calculator using the primary outcome and transparent
      assumptions rather than application volume alone.
- [x] **M8-07** Add a final result export suitable for a pitch deck without automatically
      writing the participant's conclusion.
- [x] **M8-08** Provide a Demo Day checklist covering live product, evidence trail,
      limitations, decision, next test, and fallback recording.
- [ ] **M8-09** Rehearse the complete six-week story with one technical and one non-technical
      participant proxy.

### M8 Definition of Done

- [x] The week-5 pilot is operationally and financially testable.
- [x] Privacy, sponsorship, adoption, and cost are part of the decision rather than an
      appendix.
- [x] Demo Day can trace one coherent story from initial belief to the next experiment.

---

## M9 — Security, accessibility, reliability, and course release

- [x] **M9-01** Run RLS integration tests across candidate, employer, other organization,
      operator, anonymous, and expired sessions.
- [x] **M9-02** Test every mutation for authentication, authorization, Zod validation,
      idempotency, and safe error messages.
- [x] **M9-03** Verify keyboard access, focus management, labels, errors, announcements,
      reflow, and contrast on core candidate and employer flows.
- [x] **M9-04** Add Playwright coverage for all release-stage journeys and role boundaries.
- [x] **M9-05** Add AI timeout, quota, invalid output, provider outage, and cost-limit tests.
- [x] **M9-06** Add seed reset, partial failure, stale release, and fixture-integrity tests.
- [ ] **M9-07** Verify analytics delivery in an isolated PostHog EU project and prove no PII
      appears in captured properties.
- [x] **M9-08** Run dependency, secret, and source-map reviews; resolve high-risk findings.
- [x] **M9-09** Run production build, CI, accessibility, performance, and deployment smoke
      tests.
- [x] **M9-10** Run an instructor dry run from baseline reset through final release and
      document every manual step.
- [ ] **M9-11** Freeze the cohort release tag and publish rollback and recovery steps.

### M9 Definition of Done

- [x] `./scripts/verify` and all integration/E2E suites pass from a clean clone.
- [x] No user can cross candidate or organization boundaries.
- [x] No production PII, credential, hidden reveal, or instructor-only fixture ships to a
      participant-visible surface.
- [x] Core flows meet WCAG AA and remain usable by keyboard.
- [x] The instructor can reset, release, observe, and recover the case without editing the
      database manually.
- [ ] A complete rehearsal produces the intended evidence without forcing one prescribed
      participant solution.

## External dependencies and decisions

- [ ] **EXT-01** Approve the final numeric shape of baseline, one-click, and post-AI
      datasets after red-team validation.
- [ ] **EXT-02** Select the course AI provider/model and define participant cost limits.
- [ ] **EXT-03** Decide whether participant Supabase projects are self-provisioned or
      instructor-provisioned.
- [ ] **EXT-04** Create the isolated PostHog EU course project and retention settings.
- [ ] **EXT-05** Recruit or schedule the real-person testing pool required in week 3.
- [ ] **EXT-06** Approve privacy wording and participant guidance for real-person tests.
- [ ] **EXT-07** Define how staged evidence is released without exposing future material.
- [ ] **EXT-08** Approve the fictional sponsor, cost inputs, and organizational constraints
      used in week 5.

## Final release definition

- [x] The product supports the complete candidate and employer transaction internally.
- [x] The same stable IDs connect exposure, text versions, fit scores, and outcomes.
- [x] The intended twist is discoverable but not disclosed by the interface or instructions.
- [x] Counterexamples prevent a simplistic anti-AI conclusion.
- [x] Every weekly result maps to the canonical AIPH3 program.
- [ ] Participants can deploy a working authenticated prototype and test it with a real
      person.
- [x] Instructors can stage, validate, reset, and recover the case reproducibly.
- [x] The final prototype and evidence can support a coherent Demo Day pitch.

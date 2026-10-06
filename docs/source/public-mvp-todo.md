# jobs.superhero.tech MVP — Engineering TODO

This checklist takes the repository from an empty project to the public launch of
`jobs.superhero.tech`. Complete milestones in order unless a task explicitly says
it can run in parallel.

## Fixed decisions

- Single Astro 7 application; no monorepo.
- TypeScript in strict mode, pnpm, and Node.js 24 LTS.
- Vercel hosting with the official Astro adapter.
- Supabase PostgreSQL in the EU, using Supabase CLI migrations, generated
  TypeScript types, `@supabase/supabase-js`, and Row Level Security.
- React is used only for interactive islands. Prefer Astro and native HTML for
  everything that does not require client-side state.
- Use shadcn/ui through `pnpm dlx shadcn@latest`, configured with the current Vega
  preset, Radix primitives, a neutral base, CSS variables, and Lucide icons.
- Extend the existing Superhero.tech visual identity instead of creating a new
  brand.
- PostHog Cloud EU is the product analytics provider. Use cookieless collection,
  no session replay, no person profiles, and no PII in events.
- Supabase Studio is the MVP admin interface. Do not build a custom admin panel.
- Employer form submissions are stored in Supabase. Do not send e-mail or Slack
  notifications in the MVP; Resend is the preferred later integration.
- Newsletter signup, delivery, CTAs, and analytics are excluded from this MVP.

## Explicitly out of scope

- Candidate or employer accounts and authentication.
- Public candidate profiles, CV uploads, and internal job applications.
- Applicant tracking, messaging, automated matching, or candidate scoring.
- Payments, paid listings, subscriptions, and personalized alerts.
- A custom admin dashboard or mass scraping infrastructure.
- A multilingual UI, native application, or large programmatic SEO surface.

## Delivery sprints

Sprints are outcome-based and intentionally have no time estimates. A sprint is done
only when its referenced milestone criteria are met.

| Sprint                               | Outcome                                                                                      | Included work            | Status                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------- |
| **S1 — Foundation and brand shell**  | A tested, deployable Astro application with the Superhero.tech visual foundation             | M0, M1 foundation, M2-01 | Local complete; preview pending EXT-05         |
| **S2 — Data backbone**               | Reproducible Supabase schema, security policies, typed queries, seeds, and operator workflow | M2, M3                   | Local code complete; Docker/cloud pending      |
| **S3 — Candidate experience**        | Complete candidate-facing browsing, filtering, job, company, methodology, and landing pages  | Remaining M1, M4         | Engineering complete; legal copy pending       |
| **S4 — Employer and growth systems** | Employer forms, SEO, analytics, expiry automation, and operational reporting                 | M5, M6                   | Engineering complete; cloud validation pending |
| **S5 — Hardening and preview**       | Automated coverage and an accepted private preview with representative data                  | M7, M8                   | Automated suite complete; preview pending      |
| **S6 — Public launch**               | Production data, domain, observability, smoke tests, and rollback readiness                  | M9                       | Not started                                    |

## External launch dependencies

These inputs are required before public launch but are not engineering tasks.

- [ ] **EXT-01** Supply the approved Superhero.tech logo and any licensed brand
      assets that cannot be taken from the existing site.
- [ ] **EXT-02** Approve final Polish copy for all public pages and form success/error
      states.
- [ ] **EXT-03** Supply approved privacy-policy text and data-processing disclosures.
- [ ] **EXT-04** Supply ten representative, publication-ready jobs with confirmed
      source and application URLs.
- [ ] **EXT-05** Supply access to Vercel, the preview and production Supabase
      projects, PostHog Cloud EU, Cloudflare Turnstile, DNS, and the production domain.

### Verified external blockers — 2026-10-04

- **Cloud ownership decision:** GitHub and Vercel sessions exist on this machine, but there is
  no matching repository or Vercel project. Confirm the target GitHub owner, repository
  visibility, and Vercel team before creating external resources.
- **Supabase access/runtime:** Supabase CLI has no access token and this machine has no Docker,
  Podman, Colima, or OrbStack runtime. This blocks local schema reset/type generation and both
  EU cloud projects.
- **Service configuration:** no scoped PostHog EU, Turnstile, Vercel protection, DNS, or domain
  credentials/configuration have been supplied.
- **Launch content and approval:** approved brand assets, final Polish copy, legal text, and ten
  publication-ready jobs remain outstanding under EXT-01 through EXT-04.
- **External verification:** CI, protected preview, Google Rich Results, deployed Lighthouse,
  analytics delivery, cron execution, backups, DNS/TLS, and production smoke tests can only be
  signed off after the resources above exist.

---

## M0 — Repository and project bootstrap

- [x] **M0-01** Initialize Git in the repository, set the default branch, and add a
      `.gitignore` covering Node, Astro, Vercel, Supabase local state, test artifacts,
      editor files, and environment files.
- [x] **M0-02** Pin Node.js 24 LTS in `.nvmrc` and `package.json#engines`, and pin the
      pnpm version in `packageManager`.
- [x] **M0-03** Scaffold an Astro 7 TypeScript project in the repository root with
      strict TypeScript settings and the `@/* -> src/*` import alias.
- [x] **M0-04** Add the official React, Tailwind CSS, and Vercel integrations plus an
      environment-aware dynamic sitemap endpoint. Configure server output so database-backed
      routes and Astro Actions render on demand while editorial/legal pages may opt into
      prerendering.
- [x] **M0-05** Initialize shadcn/ui with the current Vega/Radix/neutral preset, CSS
      variables, Lucide icons, and `rsc: false`. Commit `components.json` and the
      generated utility module.
- [x] **M0-06** Add only the initial shadcn primitives needed by the shared shell:
      `button`, `badge`, `card`, `input`, `textarea`, `label`, `native-select`,
      `separator`, `alert`, `skeleton`, and `sheet`. Add further components only when
      a concrete screen requires them.
- [x] **M0-07** Configure formatting, linting, `astro check`, Vitest, Playwright, and
      axe accessibility checks without auto-rewriting files in CI.
- [x] **M0-08** Add package scripts: `dev`, `build`, `preview`, `check`, `lint`,
      `format:check`, `test`, `test:watch`, `test:e2e`, `db:start`, `db:stop`,
      `db:reset`, and `db:types`.
- [x] **M0-09** Add a typed environment module and `.env.example`. Separate public
      variables from server-only secrets and fail fast when a required value is absent.
- [x] **M0-10** Document local prerequisites and the first-run workflow in `README.md`.
- [x] **M0-11** Add GitHub Actions that install with a frozen lockfile and run format
      checks, linting, type checks, unit tests, and the production build on every pull
      request.

### M0 Definition of Done

- [x] A fresh clone can be installed and started using only the documented commands.
- [ ] `pnpm check`, `pnpm lint`, `pnpm test`, and `pnpm build` pass in CI.
- [ ] The initial page deploys successfully to a Vercel preview URL.

---

## M1 — Design foundation and application shell

- [x] **M1-01** Audit the current Superhero.tech site and approved assets. Record the
      reusable font families, weights, color roles, radii, shadows, spacing, and logo
      variants without copying page layouts.
- [x] **M1-02** Map the brand values to semantic CSS tokens used by shadcn: background,
      foreground, surface, muted, border, primary, secondary, accent, destructive, and
      focus ring. Verify WCAG AA contrast for text and controls.
- [x] **M1-03** Create a global layout with Polish document metadata, skip link,
      responsive header, navigation, footer, canonical hook, default Open Graph image,
      and environment-aware `noindex` support.
- [x] **M1-04** Implement shared Astro components for page container, section header,
      breadcrumbs, job card, company identity, taxonomy badges, verification badge,
      compensation display, CTA group, empty state, error state, and form field errors.
- [x] **M1-05** Define consistent hover, active, focus-visible, disabled, validation,
      loading, and success states. Respect reduced-motion preferences.
- [x] **M1-06** Add responsive breakpoints and verify the shell at 320 px, 768 px,
      1024 px, and 1440 px widths.
- [x] **M1-07** Add a static component showcase route available only outside production
      so the shared UI states can be reviewed without creating application data.

### M1 Definition of Done

- [x] The application shell visibly belongs to Superhero.tech and has no unresolved
      placeholder styling.
- [x] Shared controls are keyboard operable, have visible focus, and meet WCAG AA.
- [x] No React component is hydrated unless it needs browser-side interaction.

---

## M2 — Supabase schema, security, and operational data

- [x] **M2-01** Add the Supabase CLI as a pinned development dependency and initialize
      a local Supabase project committed under `supabase/`.
- [ ] **M2-02** Create separate EU-hosted Supabase projects for preview and production.
      Link and deploy to them only through documented, explicit commands.
- [x] **M2-03** Create PostgreSQL enums:
  - `job_category`: `build`, `apply`, `lead`
  - `remote_status`: `onsite`, `hybrid`, `remote`
  - `publication_status`: `draft`, `review`, `published`, `hidden`, `expired`, `archived`
  - `verification_status`: `unverified`, `editorial`, `employer_verified`
  - controlled enums for job function, seniority, employment type, compensation
    period, compensation tax treatment, source type, inquiry type/status, and
    employer interaction type.
- [x] **M2-04** Create `companies` with public-only fields: UUID, unique slug, name,
      logo path, website, industry, description, AI usage statement, verification
      status, and timestamps.
- [x] **M2-05** Create `jobs` with UUID, unique slug, company FK, title, Markdown
      description, controlled taxonomy, display location, city/country, Poland
      eligibility, remote status, employment types, compensation minimum/maximum,
      currency, period, gross/net treatment, AI capabilities, editorial rationale,
      source/apply URLs, source type, publication/verification/expiry dates, statuses,
      featured rank, and timestamps.
- [x] **M2-06** Add database constraints for valid compensation ranges, HTTPS URLs,
      required publication fields, valid date ordering, non-empty slugs, and at least
      one employment type.
- [x] **M2-07** Add indexes for slug lookup, company lookup, publication/expiry status,
      category, function, seniority, remote status, location, and published date.
- [x] **M2-08** Create private `company_contacts`, `job_submissions`,
      `employer_inquiries`, and `employer_interactions` tables. Keep contact names,
      e-mails, phone numbers, notes, consent evidence, and outreach history out of all
      public tables.
- [x] **M2-09** Store submission source, landing page, referrer, UTM values, related
      job/company IDs, processing status, timestamps, and a server-generated request ID.
- [x] **M2-10** Enable RLS on every public-schema table. Revoke unnecessary default
      grants before adding policies.
- [x] **M2-11** Allow the publishable/anonymous role to select only public company
      fields and jobs with `published` or `expired` status. Deny all anonymous writes and
      all access to private tables.
- [x] **M2-12** Use a separate server-only Supabase client with a secret key for form
      inserts, expiry processing, and operational queries. Never expose this key through
      a `PUBLIC_` variable or browser bundle.
- [x] **M2-13** Create a public Supabase Storage bucket for approved company logos;
      allow public reads and administrative uploads only.
- [x] **M2-14** Add operational views for active jobs, jobs due for weekly verification,
      expired jobs, unprocessed submissions, employer funnel counts, and the 30-day MVP
      metrics excluding newsletter metrics.
- [x] **M2-15** Add deterministic development seed data covering Build, Apply, Lead,
      all remote modes, disclosed/undisclosed compensation, editorial/employer
      verification, and active/expired states.
- [ ] **M2-16** Generate and commit TypeScript database types. Make CI regenerate them
      against a clean local database and fail when committed types are stale.
- [x] **M2-17** Write a Supabase Studio runbook for creating, reviewing, publishing,
      hiding, expiring, archiving, importing, and exporting jobs and companies.

### M2 Definition of Done

- [ ] `pnpm db:reset` recreates the complete schema and seed from an empty database.
- [ ] RLS tests prove anonymous users cannot read private data or modify any table.
- [ ] Preview and production schemas can be recreated from committed migrations.
- [ ] An operator can manage the full job lifecycle using Supabase Studio alone.

---

## M3 — Data access, rendering rules, and shared domain logic

- [x] **M3-01** Implement typed public and administrative Supabase clients with clear
      server/client boundaries.
- [x] **M3-02** Add a repository/query layer for homepage jobs, filtered job listings,
      job details, company details, related jobs, landing-page counts, and operational
      expiry updates. Do not query Supabase directly from page templates.
- [x] **M3-03** Define the `/oferty` filter contract using repeated query parameters:
      `function`, `category`, `location`, `remote`, `seniority`, and `contract`, plus the
      one-based `page` parameter. Use 24 jobs per page.
- [x] **M3-04** Validate and normalize every filter value. Ignore unknown values,
      deduplicate repeats, clamp invalid pages, and produce a stable normalized URL.
- [x] **M3-05** Implement a shared active-job rule: a job is active only when its status
      is `published`, `published_at <= now`, and `expiry_at > now`.
- [x] **M3-06** Implement safe server-side Markdown rendering with raw HTML disabled,
      sanitized outbound links, and heading levels compatible with the page outline.
- [x] **M3-07** Implement mappings from database records to view models and Schema.org
      JSON-LD. Omit incomplete salary fields instead of emitting misleading data.
- [x] **M3-08** Define curated landing-page configuration for `ai-product`,
      `ai-transformation`, `ai-design`, `ai-marketing`, and `remote-poland`. Each entry
      contains a Polish title, description, filter definition, and canonical slug.

### M3 Definition of Done

- [x] Domain queries are type-safe and independently testable.
- [x] Invalid filters and malformed slugs cannot produce server errors.
- [x] Public rendering never returns a private contact field.

---

## M4 — Public candidate experience

- [x] **M4-01** Build `/` with the definition of AI-enabled work, Build/Apply/Lead
      explanations, latest and featured jobs, function entry points, methodology link,
      and employer CTAs. Do not include newsletter UI.
- [x] **M4-02** Build `/oferty` as server-rendered HTML with result count, active
      filters, clear-all control, sorting by featured rank and recency, pagination,
      empty state, and filter-preserving links.
- [x] **M4-03** Implement the job filters as a progressive-enhancement React island:
      inline controls on desktop and a shadcn Sheet on mobile. The underlying GET form
      must work without JavaScript.
- [x] **M4-04** Build `/oferty/[slug]` with company, metadata, compensation, AI
      capabilities, editorial rationale, description, source, verification/freshness
      dates, external apply CTA, employer correction CTA, and related active jobs.
- [x] **M4-05** Build `/firmy/[slug]` with company identity, description, AI usage,
      verification status, active jobs, verify/correct CTA, and shortlist CTA.
- [x] **M4-06** Build `/metodologia` as a prerendered editorial page explaining the
      taxonomy, inclusion/exclusion rules, verification statuses, freshness, and expiry.
- [x] **M4-07** Build `/praca/[slug]` for the five curated SEO landing pages. Return
      crawlable HTML for all valid routes, but mark a route indexable only when it has at
      least three active jobs.
- [ ] **M4-08** Build the approved privacy-policy page and link it from every form and
      the footer.
- [x] **M4-09** Add branded 404 and safe 500 responses with links back to active jobs.
- [x] **M4-10** Implement expired-job behavior: keep the page available, show an
      expiry notice and related jobs, remove the apply CTA and JobPosting JSON-LD, set
      `noindex,follow`, and exclude it from the sitemap. Hidden and archived jobs return 404.

### M4 Definition of Done

- [x] A candidate can discover, filter, inspect, and leave to apply for an active job
      on mobile and desktop.
- [x] All core candidate pages contain useful server-rendered HTML with JavaScript
      disabled.
- [x] Empty, invalid, expired, hidden, and unavailable states behave as specified.

---

## M5 — Employer experience and forms

- [x] **M5-01** Build `/dla-pracodawcow` with the audience, curation policy, and three
      explicit paths: submit a job, verify/correct a listing, and request candidates.
- [x] **M5-02** Build `/dla-pracodawcow/dodaj-oferte` and define a Zod-validated Astro
      Action for company/contact details, job details, source/apply URL, AI responsibility,
      compensation, consent, and optional notes.
- [x] **M5-03** Build `/dla-pracodawcow/zweryfikuj` and its Astro Action. Accept an
      optional job/company identifier from a query parameter, but validate it server-side
      and allow a user to paste a listing URL when no match is known.
- [x] **M5-04** Build `/dla-pracodawcow/kandydaci` and its Astro Action for company,
      contact, role/function, problem to solve, expected AI responsibility, timing, and
      consent.
- [x] **M5-05** Implement zero-JavaScript submission and server-rendered field errors,
      preserving non-sensitive user input after validation failures.
- [x] **M5-06** Add optional client-side enhancement for pending, success, and error
      states without making it the only submission path.
- [x] **M5-07** Add a hidden honeypot, Cloudflare Turnstile verification, input length
      limits, normalized e-mail/URL values, and safe free-text handling to every form.
- [x] **M5-08** Persist each accepted request once with a generated request ID, consent
      timestamp, source/referrer/UTM context, and initial `new` status.
- [x] **M5-09** Do not publish employer-submitted jobs automatically. Submissions must
      remain private until an operator creates or approves a public job in Supabase Studio.
- [x] **M5-10** Do not add Resend, newsletter, or other notification delivery code.

### M5 Definition of Done

- [x] All three forms work with and without client-side JavaScript.
- [x] Invalid, automated, or incomplete submissions do not create records.
- [x] Valid records appear only in private Supabase tables and contain enough context
      for manual follow-up.

---

## M6 — SEO, analytics, expiry, and observability

- [x] **M6-01** Add unique titles, descriptions, canonical URLs, Open Graph data, and
      semantic headings to every public page type.
- [x] **M6-02** Generate `JobPosting` JSON-LD for active jobs, including `datePosted`,
      `validThrough`, `employmentType`, hiring organization, applicable location or
      `TELECOMMUTE`, Poland eligibility, and salary only when the data is complete.
- [x] **M6-03** Generate `Organization` JSON-LD for companies and the site publisher.
- [x] **M6-04** Generate sitemap entries for static pages, active jobs, companies with
      active jobs, and qualifying curated landing pages. Exclude filter URLs, expired
      jobs, thin landing pages, preview deployments, and private routes.
- [x] **M6-05** Add environment-aware `robots.txt`. Preview must disallow crawling and
      set a global `noindex`; production must expose the canonical sitemap.
- [x] **M6-06** Make all filter and pagination combinations `noindex,follow` with
      `/oferty` as canonical. Link indexable curated landing pages separately.
- [x] **M6-07** Install PostHog Cloud EU with cookieless collection, anonymous-only
      events, session replay disabled, and an explicit property allowlist.
- [x] **M6-08** Implement and document the public event contract:
  - `job_viewed`: `job_id`, `company_id`, `category`, `function`, `remote_status`
  - `apply_clicked`: job properties plus `destination_host` and `source_page`
  - `filter_used`: normalized filter names/values and result count
  - `job_submitted`, `company_verification_started`, `talent_shortlist_requested`:
    request ID, related public IDs when present, and source page only.
- [x] **M6-09** Add automated tests that reject e-mail, phone, contact name, message,
      full URL query strings, and other PII from analytics payloads.
- [x] **M6-10** Record `contacted`, `replied`, `meeting_booked`, and `shortlist_requested`
      as `employer_interactions` managed in Supabase Studio. Include them in the MVP
      metrics view rather than emitting browser analytics events.
- [x] **M6-11** Add `/api/cron/expire-jobs`. Require a valid `CRON_SECRET`, update only
      published jobs whose `expiry_at <= now`, and make repeated or overlapping calls
      idempotent.
- [x] **M6-12** Configure a daily Vercel Cron invocation and structured logs containing
      the run ID, start/end timestamps, changed row count, and safe error details.
- [x] **M6-13** Add a lightweight health endpoint that checks application availability
      without disclosing database or environment details.

### M6 Definition of Done

- [ ] Active job and company structured data passes automated schema tests and manual
      Google Rich Results validation.
- [ ] Preview URLs cannot be indexed; production sitemap contains only eligible URLs.
- [ ] Required analytics events arrive in the EU project without PII.
- [x] The expiry cron is authenticated, observable, and safe to execute more than once.

---

## M7 — Automated verification

- [x] **M7-01** Add unit tests for filter parsing/normalization, pagination, active-job
      rules, Markdown sanitization, compensation formatting, canonical generation, and
      JSON-LD mapping.
- [x] **M7-02** Add database integration tests for migrations, constraints, indexes,
      seed data, public reads, private-table isolation, and all RLS policies.
- [x] **M7-03** Add integration tests for each Astro Action, including successful
      storage, field errors, invalid IDs, malformed URLs, honeypot rejection, Turnstile
      failure, and retry/idempotency behavior.
- [x] **M7-04** Add cron tests for no-op runs, mixed active/expired data, repeated runs,
      missing/invalid secrets, and database failure handling.
- [x] **M7-05** Add Playwright candidate-journey tests: homepage entry, filters,
      pagination, job view, company view, apply click, expired job, and 404.
- [x] **M7-06** Add Playwright employer-journey tests for all three forms with JavaScript
      enabled and disabled.
- [x] **M7-07** Run axe checks on the homepage, job index, job detail, company page,
      methodology page, and every employer form. Include keyboard-only filter and form
      navigation.
- [x] **M7-08** Add SEO regression tests for titles, canonicals, robots directives,
      sitemap membership, JSON-LD presence/absence, and filtered-page `noindex` behavior.
- [x] **M7-09** Add analytics contract tests using a mocked capture transport so no
      test data reaches PostHog.
- [ ] **M7-10** Run Lighthouse against the deployed preview homepage, job index, and job
      detail. Require at least 90 Performance and 95 Accessibility, Best Practices, and
      SEO on the agreed mobile profile.
- [x] **M7-11** Add the local Supabase integration suite and Playwright smoke tests to
      CI. Use Vercel's protection bypass secret only for automated preview checks.

### M7 Definition of Done

- [ ] All automated checks pass from a clean clone and a reset local database.
- [x] No known critical or serious accessibility violations remain.
- [ ] The deployed preview meets the Lighthouse and structured-data thresholds.

---

## M8 — Private preview acceptance

### Preview defect log

- Preview execution is blocked by **EXT-05** (no Vercel/Supabase/PostHog/Turnstile access in
  this workspace). No preview defects have been observed yet. When access is supplied, record
  each defect here with severity, owner, reproduction steps, and resolution commit.

- [ ] **M8-01** Connect Vercel to the repository and configure protected preview
      deployments using Vercel Authentication.
- [ ] **M8-02** Configure preview-only Supabase, PostHog, Turnstile, site URL, cron
      secret, and Vercel protection-bypass variables with correct preview scoping.
- [ ] **M8-03** Verify preview protection, global `noindex`, blocked robots, and the
      absence of preview URLs from the production sitemap.
- [ ] **M8-04** Load ten representative jobs across Build, Apply, and Lead through the
      documented operator workflow; do not embed them in application code.
- [ ] **M8-05** Conduct candidate acceptance: discover a role, combine filters, inspect
      job/company details, and leave through the original apply URL.
- [ ] **M8-06** Conduct employer acceptance: submit a role, verify/correct a listing,
      and request candidates; confirm private storage and operational status updates.
- [ ] **M8-07** Conduct operator acceptance: create, edit, verify, publish, hide, expire,
      archive, import, and export a job without changing application code.
- [ ] **M8-08** Verify PostHog events, expiry cron logs, health endpoint, error pages,
      broken links, mobile behavior, and cross-browser behavior.
- [ ] **M8-09** Record all preview defects in this file under the relevant milestone,
      fix launch blockers, and rerun the complete acceptance suite.

### M8 Definition of Done

- [ ] The product owner approves the candidate, employer, and operator journeys.
- [ ] Ten representative jobs render correctly and can be maintained without code.
- [ ] There are no open launch-blocking defects or unresolved security/privacy issues.

---

## M9 — Production launch

- [ ] **M9-01** Create and link the production Supabase project in the EU region.
      Apply the exact reviewed migrations that passed preview; never copy the preview
      database wholesale.
- [ ] **M9-02** Configure production-scoped Supabase, PostHog EU, Turnstile,
      `PUBLIC_SITE_URL`, and `CRON_SECRET` variables in Vercel. Verify no preview or local
      credentials are present.
- [ ] **M9-03** Import the ten approved jobs and companies into production through the
      documented workflow, including source, apply, verification, and expiry data.
- [ ] **M9-04** Configure `jobs.superhero.tech` DNS and TLS, redirect alternate hosts to
      the canonical HTTPS host, and verify canonical URLs use the production domain.
- [ ] **M9-05** Enable the production cron and verify one authenticated manual run
      before relying on its schedule.
- [ ] **M9-06** Confirm Supabase backup/restore settings and document the database
      rollback procedure. Document Vercel deployment rollback separately from database
      rollback.
- [ ] **M9-07** Run the full production smoke test: public routes, filters, external
      apply links, three forms, storage, analytics, JSON-LD, sitemap, robots, cron, health,
      404, and expired-job behavior.
- [ ] **M9-08** Remove preview-only global `noindex` behavior from production and confirm
      that only eligible pages are indexable.
- [ ] **M9-09** Submit the production sitemap to the chosen search-engine consoles and
      validate representative job URLs with Rich Results Test.
- [ ] **M9-10** Enable Vercel runtime/error monitoring, confirm Supabase logs are
      accessible, and assign an owner for checking form submissions and failed cron runs.
- [ ] **M9-11** Tag the launch release and record the deployed commit, migration version,
      smoke-test result, and rollback points.

### M9 Definition of Done

- [ ] `https://jobs.superhero.tech` is public, crawlable, secure, and uses the approved
      production data and brand assets.
- [ ] All launch smoke tests pass and required analytics events are visible in PostHog.
- [ ] Forms, expiry automation, backups, logs, and rollback procedures are verified.
- [ ] The team can operate the job board without editing application code.

---

## MVP complete

- [ ] Every milestone Definition of Done is checked.
- [ ] All external launch dependencies are resolved.
- [x] No newsletter or e-mail notification code has entered the MVP scope.
- [ ] The public product supports the candidate, employer, and internal operating
      journeys defined in `BRIEF.md`.

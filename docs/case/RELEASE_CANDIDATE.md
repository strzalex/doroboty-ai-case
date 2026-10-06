# AIPH3 case release candidate

Recorded: **2026-10-06**

This is an evidence record for the current release candidate, not the final cohort release. It
contains no credentials or participant data.

## Build identity

- GitHub repository: `strzalex/doroboty-ai-case`
- Pull request: `https://github.com/strzalex/doroboty-ai-case/pull/1`
- Candidate commit: `7fb2ac05d529fbbc86bc9b3d8671eaae7de94de6`
- Vercel project: `wstrzalk-gmailcoms-projects/doroboty-ai-case`
- Canonical deployment: `https://doroboty-ai-case.vercel.app`
- Last known-good deployment: `dpl_3QMDGaf4FFCMoiAm1dJrL1VB5n3L`

## Verified gates

- GitHub Actions run `37515319288`: **Quality and demo** passed.
- GitHub Actions run `37515319288`: **Supabase integration** passed.
- Public HTTPS deployment smoke passed for homepage, marketplace, representative job, sign-in,
  robots, and sitemap.
- Robots and sitemap use the canonical Vercel origin rather than localhost.
- The deployed public application is intentionally in fixture mode until an isolated Supabase
  project is connected.

## Remaining release gates

- Complete Supabase CLI authorization, provision the approved isolated EU project, push reviewed
  migrations, configure auth redirects, and run the authenticated role journey.
- Verify typed analytics in an isolated PostHog EU project with synthetic IDs and inspect captured
  properties for PII.
- Run the technical and non-technical proxy rehearsals, independent case-data review, and
  real-person test after the named external decisions in `TODO.md` are approved.
- Replace this record with a cohort record and tag only after every release gate passes.

## Recovery point

The Vercel deployment above is the current code rollback point. Database rollback remains a
separate forward-only recovery procedure as documented in [`INSTRUCTOR_RUNBOOK.md`](INSTRUCTOR_RUNBOOK.md)
and [`../deployment.md`](../deployment.md).

# Separate the AIPH3 Case Application from the Public Portal

Date: 2026-10-06  
Status: Accepted

## Context

The public DoRoboty.ai application is an Astro job board optimized for crawlable jobs,
curation, employer acquisition, and external application links. The AIPH3 spanning case
requires authenticated candidates and employers, internal applications, recruiting-stage
outcomes, controlled interventions, and participant forks.

Rewriting the public product would risk its working SEO and operational flows while still
requiring most case-specific domain work. Superstarter already provides Next.js,
Supabase Auth, a protected application shell, shadcn/ui, and local auth integration tests.

## Decision

Build the AIPH3 prepared case in a separate fork of Superstarter named DoRoboty.ai Case.
Keep the public DoRoboty.ai repository independent.

Share concepts and selected assets deliberately:

- DoRoboty.ai brand and Polish product language;
- Build / Apply / Lead taxonomy;
- selected company and job domain logic;
- synthetic versions of job and company fixtures;
- accessibility and analytics conventions.

Do not share production databases, user identities, secrets, or candidate data.

## Consequences

- The course application can optimize for authenticated product work and participant forks.
- The public job board can continue shipping without a framework migration.
- Some UI and domain logic will be implemented twice or extracted later only when a stable
  shared boundary becomes obvious.
- Course-specific fixtures and staged reveals remain isolated from public production data.

## Alternatives considered

- Rewrite the public Astro portal in Next.js: rejected because auth is not enough to justify
  rebuilding the working public surface.
- Add the complete case flow to the public Astro application: rejected because it mixes
  synthetic teaching state with production operations and creates avoidable privacy risk.
- Build a static case prototype only: rejected because weeks 3 and 4 require a database,
  login, deployment, and analytics.

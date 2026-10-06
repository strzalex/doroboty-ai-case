# jobs.superhero.tech — Project Brief

**Status:** MVP definition  
**Created:** 2026-10-04  
**Domain:** `jobs.superhero.tech`

## One sentence

`jobs.superhero.tech` is a curated job board for professionals who build with AI, apply AI in their function, or lead AI adoption inside organizations — and a public acquisition layer for connecting employers with verified AI Product Heroes talent.

## Why this project exists

Companies increasingly need people who do more than list AI tools on a CV. They need operators who can identify useful applications, build or supervise implementation, navigate organizational constraints, help colleagues adopt new workflows, and connect the work to a measurable outcome.

Superhero.tech has three relevant assets:

- access to approximately 1,800 AI Product Heroes participants/alumni; the exact number of graduates, active job seekers, and people meeting a future verification standard still needs to be established;
- proof-of-work produced during AI Product Heroes;
- distribution and credibility through the founders' LinkedIn presence and the AIPH brand.

A generic AI job board is not defensible. The strategic opportunity is to define what an **AI-enabled professional** or **AI Champion** actually is, observe employer demand, build relationships with companies, and eventually connect verified people with those companies.

The job board is therefore not the final marketplace. It is the public SEO, content, data, and business-development layer of a future talent network.

## MVP purpose

This is a **build-to-learn MVP**.

It must answer:

> Can a curated job board with a distinctive definition of AI-enabled work create qualified employer conversations and lead to real requests for candidates from the AIPH network?

The MVP does not need to prove automated matching, recruitment revenue, or marketplace liquidity.

## Product hypothesis

If Superhero.tech publishes a high-quality, narrowly curated index of roles where AI is part of the person's responsibility and expected outcome, then:

1. professionals interested in AI-enabled work will browse, subscribe, and apply;
2. employers will verify or submit roles because the category and audience are relevant;
3. some employers will ask Superhero.tech to introduce verified candidates;
4. those interactions will reveal whether the long-term product should become a talent marketplace, recruitment service, employer-branding product, corporate AI Champion program, or some combination of them.

## Target market

### Geography

- Poland-first.
- Remote roles are included when candidates based in Poland can apply.
- The initial interface is Polish; original job descriptions may remain in Polish or English.

### Candidate

Mid- and senior-level professionals who use AI to deliver work, not merely to increase personal productivity:

- product managers and product builders;
- designers;
- software and product engineers;
- marketing and growth professionals;
- operations and transformation professionals;
- selected HR, legal, finance, and consulting professionals when AI is central to the role.

AIPH alumni are the initial proprietary supply pool, but the public job board may serve a broader audience.

### Employer

Polish companies and international companies hiring in Poland that need someone who can introduce, build, or scale AI-enabled ways of working inside a function or team.

The initial buyer/contact is likely to be one of:

- founder or CEO;
- Head of Product, Design, Engineering, Operations, Marketing, HR, or Transformation;
- talent acquisition or internal recruiter;
- executive responsible for AI adoption.

## Category definition

Every published role must fit at least one of three categories:

### Build

The person builds AI-powered products, agents, automations, or workflows.

### Apply

The person uses AI as a material part of a domain role such as product, design, marketing, operations, HR, legal, or finance.

### Lead

The person owns AI adoption, enablement, governance, or transformation across a team or organization.

### Inclusion rule

A role qualifies when AI is visible in its responsibilities, expected outcomes, decision rights, or required evidence of competence.

### Exclusions

Do not publish:

- every job at a company that happens to sell AI;
- generic software roles with AI mentioned only in employer branding;
- low-quality data-labeling or microtask work;
- roles unavailable to candidates based in Poland;
- expired, unverifiable, duplicated, or misleading listings;
- pure ML research roles unless they are deliberately added as a separate category later.

## Core user journeys

### Candidate journey

1. Arrive on the homepage, category page, company page, or job detail page.
2. Understand what qualifies as AI-enabled work.
3. Browse or filter relevant roles.
4. Open a job detail page.
5. Continue to the employer's ATS or application page.
6. Subscribe to the weekly jobs digest.

Candidates do not create accounts or upload CVs in the MVP.

### Employer journey

1. Discover the board or receive outreach about an existing listing.
2. Verify, correct, claim, or submit a role.
3. Optionally describe how AI changes the role.
4. Request a curated shortlist of AIPH candidates.
5. Continue the conversation with the Superhero.tech team manually.

Employers do not need accounts or a self-service dashboard in the MVP.

### Internal journey

1. Add or import a job.
2. Review it against the inclusion criteria.
3. Assign company, function, category, and metadata.
4. Publish and contact the employer.
5. Record verification, reply, meeting, and talent request.
6. Recheck or expire the listing.

## MVP scope

### Public pages

#### Homepage

- Clear definition of AI-enabled professionals and AI Champions.
- Explanation of Build, Apply, and Lead.
- Latest and featured jobs.
- Browse-by-function entry points.
- Candidate newsletter CTA.
- Employer CTA: submit a job or request candidates.

#### Job index

Filters:

- function;
- Build / Apply / Lead;
- location and remote status;
- seniority;
- employment or contract type.

#### Job detail

- title and company;
- full job description;
- location and working model;
- employment or contract type;
- seniority;
- compensation when disclosed;
- required AI capabilities;
- editorial explanation: "Why this role is AI-enabled";
- original source;
- publication, verification, and expiry dates;
- external apply CTA;
- newsletter CTA.

#### Company page

- company name, logo, website, description, and industry;
- active roles;
- short description of how the company uses AI, when known;
- employer-verification status;
- CTA to verify, correct, or claim the page;
- CTA to request AIPH candidates.

#### Employer page

- submit a job;
- verify or correct an existing listing;
- request a curated shortlist;
- explain the intended audience and curation policy.

#### Methodology page

- definition of an AI-enabled role;
- Build / Apply / Lead taxonomy;
- inclusion and exclusion rules;
- meaning of employer-verified and editorially verified statuses;
- freshness and expiry policy.

#### Newsletter signup

- one general weekly digest;
- no personalized alerts in the MVP.

### Internal operations

The MVP needs a lightweight way to:

- create and edit jobs and companies;
- review employer submissions;
- deduplicate listings;
- record source and original apply URL;
- assign taxonomy and editorial notes;
- publish, hide, expire, or archive jobs;
- record employer outreach and outcomes;
- export data for analysis.

A custom admin panel is not required. The database interface is sufficient initially.

## SEO requirements

SEO is part of the product, not a later marketing task.

The MVP must include:

- crawlable HTML for every public job and company page;
- stable, human-readable URLs;
- unique titles and meta descriptions;
- `JobPosting` structured data;
- `Organization` structured data;
- sitemap generation;
- canonical URLs;
- correct handling of expired roles;
- semantic HTML and accessible forms;
- internal links between jobs, companies, functions, and categories.

Only category pages with enough real inventory should be indexable. Do not generate empty combinations of role, location, seniority, and skill.

Initial indexable landing pages may include:

- AI Product jobs;
- AI Transformation jobs;
- AI-enabled Design jobs;
- AI-enabled Marketing jobs;
- remote AI-enabled jobs available from Poland.

## Minimal data model

### Job

- id;
- title;
- slug;
- company id;
- description;
- function;
- category: Build, Apply, or Lead;
- seniority;
- location;
- remote status;
- employment or contract type;
- compensation range and currency;
- required AI capabilities;
- editorial AI-enabled rationale;
- source URL;
- apply URL;
- source type;
- published date;
- last verified date;
- expiry date;
- verification status;
- publication status.

### Company

- id;
- name;
- slug;
- logo;
- website;
- industry;
- description;
- AI usage statement;
- verification status;
- contact status;
- contact details kept private.

Candidate profiles are not part of the public MVP data model. Initial AIPH matching remains an internal manual process.

## Analytics

Track at minimum:

- `job_viewed`;
- `apply_clicked`;
- `filter_used`;
- `newsletter_subscribed`;
- `job_submitted`;
- `company_verification_started`;
- `talent_shortlist_requested`;
- `employer_contacted`;
- `employer_replied`;
- `employer_meeting_booked`.

### Primary metric

Number of qualified employer conversations that result in at least one of:

- an employer-verified job;
- a directly submitted job;
- a request for AIPH candidates;
- a concrete discussion about an internal AI Champion need.

Traffic, indexed pages, and raw job count are supporting signals, not the primary outcome.

## Validation gate

Evaluate the MVP after its first 30 days in public.

Target:

- at least 30 active, qualifying jobs;
- at least 15 companies represented;
- every represented company contacted;
- at least 10 employer replies;
- at least 5 employer conversations;
- at least 3 requests for candidates, shortlist pilots, or equivalent concrete hiring support;
- at least 250 newsletter subscribers;
- at least 100 outbound apply clicks;
- more than 90% of published jobs confirmed active during weekly freshness checks.

### Decision rule

- **Employer requests appear:** continue toward a curated talent network and matching workflow.
- **Candidate interest appears but employer requests do not:** treat the product as a media/SEO asset and reconsider marketplace investment.
- **Employer demand appears but public traffic is weak:** the board may still be successful as a business-development surface; continue the concierge service without prematurely building a marketplace.
- **Neither side responds:** stop feature development and revisit category definition, employer problem, and distribution.

## Out of scope for MVP

- candidate or employer accounts;
- public AIPH talent profiles;
- CV upload or internal applications;
- applicant tracking;
- messaging or inbox;
- automated or AI-based matching;
- candidate scoring;
- employer dashboard;
- payments, paid listings, subscriptions, or success fees;
- personalized job alerts;
- mass scraping infrastructure;
- salary database;
- public company reviews;
- multilingual interface;
- native mobile application;
- large programmatic SEO surface;
- automated content generation.

## Technical direction

- Astro 7 with TypeScript.
- PostgreSQL, likely through Supabase, as the source of truth for jobs and companies.
- Static or cached public pages where practical; on-demand rendering for fresh data and forms.
- Astro Actions or server endpoints for submissions and verification requests.
- Minimal client-side JavaScript; interactive islands only for filters and other necessary controls.
- No custom authentication in the MVP.
- No custom admin panel in the MVP.
- Hosting and deployment platform remain open; choose an official Astro adapter.

Job and company data must not live as Markdown files. Editorial pages and future reports may use Markdown or MDX.

## Operating model

- Listings are curated before publication.
- Every listing stores its original source and application URL.
- Employers are contacted after publication or before verification.
- Listings are reviewed weekly and expire automatically unless reconfirmed.
- Candidate introductions are manual and limited to a small number of clearly relevant people.
- Reasons for employer acceptance and rejection are recorded to develop the future matching rulebook.

## Open questions

- What is the public launch date?
- Who owns daily curation, employer outreach, and weekly freshness checks?
- What exact evidence will qualify an AIPH participant as verified talent?
- Will the first listings be direct submissions, manually sourced listings, or both?
- Can employer logos and job descriptions be republished before explicit verification?
- Which newsletter and CRM systems will be used?
- What privacy and legal review is required before storing candidate information or introducing candidates?
- Should pure AI engineering and ML roles remain excluded permanently or become a separate category after MVP validation?
- What commercial model should be tested after the first three concrete employer requests?

## First implementation milestone

Ship a private preview containing:

- homepage;
- methodology page;
- job index;
- job detail page;
- company page;
- employer submission and talent-request forms;
- database schema;
- 10 representative jobs across Build, Apply, and Lead;
- analytics events;
- structured-data validation;
- automated expiry behavior.

The preview is ready for public launch only after the team can add, verify, publish, expire, and measure a job without editing application code.

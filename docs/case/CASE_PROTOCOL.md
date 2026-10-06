# DoRoboty.ai AIPH3 Case Protocol

**Status:** canonical build contract  
**Audience:** product designers, instructors, dataset authors, and implementation agents

## Purpose

This protocol keeps the application, data, weekly reveals, and teaching narrative aligned.
It defines what the system must make observable, what participants may see at each stage,
and which conclusions must remain open until supported by evidence.

## Narrative contract

The case uses one marketplace stream:

1. Employers publish jobs inside DoRoboty.ai.
2. Candidates apply inside DoRoboty.ai.
3. Employers review applications and record whether they invite, meet, and continue with a
   candidate.
4. The platform can therefore connect product changes to downstream recruiting outcomes.

The initial executive belief is that more completed applications and better text matching
will create better matches. Treat this as a hypothesis, not as the product diagnosis.

## Required outcome chain

Every synthetic application must be joinable across this chain:

`job viewed → application started → application submitted → employer reviewed → interview
invited → first conversation held → employer continued or rejected → hired or not hired`

The case's primary outcome is `employer_continued_after_first_conversation` per job. A
submission, invitation, or computed fit score is not the final outcome.

## Release stages

### Stage A — Baseline

Participant sees:

- public jobs and companies;
- a long internal application form;
- baseline funnel data with visible application abandonment;
- the CEO hypothesis that reducing friction will improve matching.

Participant must not yet see:

- AI writing assistance;
- the later text-provenance comparison;
- the final work-evidence direction.

### Stage B — One-click apply

Participant sees:

- a one-click variant using a saved candidate profile;
- more submitted applications;
- a flat rate of employers continuing after the first conversation.

The data must distinguish improvement in application completion from the unchanged
downstream outcome.

### Stage C — Discovery evidence

Participant receives:

- candidate and employer interview transcripts;
- examples of unclear job posts and weak application answers;
- historical data in which detailed text previously predicted invitations more strongly;
- support or sales evidence needed by participants without live user access.

This stage must support several plausible explanations. It must not state the final twist.

### Stage D — AI writing assistance

The product introduces two separately assignable interventions:

- employer job-post drafting from a private source brief;
- candidate “why I fit” drafting from source experience.

Every use stores source text, generated text, final approved text, edits, model metadata,
and experiment exposure. Human approval is mandatory.

### Stage E — Measurement and twist

Participant sees:

- higher completion and better text-quality ratings;
- a higher text-similarity fit score;
- no corresponding improvement in the primary recruiting outcome;
- a weaker relationship between the same fit score and downstream decisions after AI
  assistance is introduced;
- examples where polished text omits the employer's real requirement or the candidate's
  demonstrated result.

Participants must calculate or discover this relationship. The UI and packet may not name
the answer for them.

### Stage F — Participant direction

Participants choose and test one intervention, such as:

- a small set of explicit employer decision criteria;
- candidate work samples with context and measurable outcomes;
- a link or optional collaborator confirmation;
- AI that structures source evidence instead of inventing a narrative.

The baseline product must provide extension points for these ideas but must not ship a
finished version of them.

## Data invariants

- All shared course data is synthetic and deterministic.
- IDs remain stable across stage snapshots unless a migration explicitly changes them.
- Timestamps permit cohort and before/after analysis.
- Experiment assignment and actual exposure are stored separately.
- Employer AI and candidate AI are independently assignable.
- Source, generated, edited, and published/submitted text are separate immutable versions.
- The source employer brief contains information not guaranteed to appear in the public job
  post.
- Candidate source experience contains information not guaranteed to appear in the final
  application answer.
- Outcomes include reviews, invitations, completed first conversations, continuation, and
  eventual hiring when available.
- Job family, seniority, employer readiness, candidate experience, and language background
  support confounder and segment analysis.
- Fixtures include counterexamples where AI improves clarity without degrading the signal.
- Fixture validation fails if aggregate numbers no longer support the intended comparisons.

## Minimum domain records

- `profiles`
- `candidate_profiles`
- `candidate_experiences`
- `candidate_work_samples`
- `organizations`
- `organization_memberships`
- `companies`
- `employer_briefs`
- `jobs`
- `job_text_versions`
- `applications`
- `application_answer_versions`
- `application_stage_events`
- `interview_outcomes`
- `experiment_assignments`
- `experiment_exposures`
- `fit_scores`
- `ai_generations`
- `case_releases`

Exact schema boundaries may change, but no implementation may collapse source truth,
generated text, final text, exposure, and downstream outcome into a single record.

## Analytics boundary

PostHog receives anonymous or pseudonymous product interaction events only. Supabase stores
operational case records and synthetic profile content.

Required product events include:

- `job_viewed`
- `application_started`
- `application_submitted`
- `one_click_used`
- `ai_generation_started`
- `ai_generation_completed`
- `ai_generation_approved`
- `employer_reviewed`

Abandonment is derived from starts without submissions. Recruiting stage changes and
interview outcomes remain operational records, not browser telemetry.

## Anti-spoiler rules

- Do not label any dashboard “signal loss”, “AI failure”, or equivalent.
- Do not reveal the post-AI comparison before the participant has chosen a week-2 direction.
- Do not make AI-generated text visibly worse than human text.
- Do not encode “AI used” as a direct negative input to the fit score or outcome.
- Do not solve the case by hiding stale jobs or throttling applications; those were rejected
  case directions.
- Do not imply causality from a simple before/after chart.
- Do not require references from every candidate or present costly signaling as the only
  valid solution.

## Weekly deliverable contract

| Week | Application state            | Evidence packet                                        | Participant result                                     |
| ---- | ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| 1    | Baseline product             | company context and architecture                       | agent with durable product context                     |
| 2    | Baseline + one-click history | quantitative data, research, three qualitative sources | one chosen solution direction                          |
| 3    | extension points enabled     | prototype constraints and test script                  | database-backed AI prototype tested with a real person |
| 4    | deployed participant fork    | staged experiment and analytics data                   | live authenticated product and evidence-based learning |
| 5    | organization constraints     | sponsor, privacy, cost, and adoption inputs            | 30-day pilot and business case                         |
| 6    | stable demo fixtures         | full trace and pitch outline                           | working demo and coherent decision story               |

## Case validation gate

Before releasing a stage to participants, an independent reviewer must be able to:

1. reproduce the expected funnel from a clean seed;
2. join source text, final text, exposure, and recruiting outcome;
3. find at least two plausible alternative explanations;
4. verify that the intended insight requires both quantitative and qualitative evidence;
5. identify counterexamples to the blanket claim that AI writing assistance is harmful;
6. confirm that no future-stage conclusion is visible early;
7. reset the environment without manual database repair.

# DoRoboty.ai case data dictionary

## Unit of analysis

The primary analytical row is a candidate journey for one job and one case release. A
journey starts at `viewedAt` and may progress through application, employer review,
invitation, first conversation, and the employer's continue/reject decision.

The business outcome is the count of `employerContinued = true` per job. Application
submission, invitation, text quality, and fit score are intermediate or proxy measures.

## Release keys

| Key              | Meaning                                                   | Initially visible |
| ---------------- | --------------------------------------------------------- | ----------------- |
| `baseline`       | Long-form application before the first intervention       | yes               |
| `post_one_click` | One-click history with increased submissions              | yes               |
| `discovery`      | Interviews, tickets, sales notes, and plausible diagnoses | yes               |
| `post_ai`        | Independently assigned employer and candidate AI tools    | no                |
| `pilot`          | Organizational constraints and pilot evidence             | no                |
| `demo_day`       | Stable full narrative and presentation data               | no                |

## Journey fields

| Field                         | Meaning                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `candidateId`, `jobId`        | Stable synthetic identifiers used across releases               |
| `jobFamily`, `seniority`      | Segments for checking mix and confounding                       |
| `employerReadiness`           | Synthetic organizational readiness segment                      |
| `languageBackground`          | Synthetic language segment used for positive AI counterexamples |
| `variant`                     | `long_form` or `one_click`; interface treatment actually used   |
| `*AiAssigned`                 | Experiment assignment, whether or not the tool rendered         |
| `*AiExposed`                  | Actual treatment exposure; never infer it from assignment       |
| `viewedAt` … `conversationAt` | Nullable, ordered funnel timestamps                             |
| `employerContinued`           | Decision after the first conversation; the primary outcome      |
| `sourceSignalScore`           | Case-only rating of concrete source evidence before rewriting   |
| `finalTextSignalScore`        | Case-only rating of decision-useful evidence in the final text  |
| `fitScore`                    | Text similarity proxy, not a hiring recommendation              |
| `textQualityScore`            | Readability/quality proxy, not a business outcome               |

## Operational tables

`applications`, `application_stage_events`, and `interview_outcomes` contain the live
transactional path. `experiment_assignments` and `experiment_exposures` deliberately keep
assignment apart from actual exposure. `employer_briefs`, `job_text_versions`, candidate
experiences, work samples, and application snapshots preserve provenance.

## Missing values

Null timestamps mean that the journey did not reach the stage. A null decision means no
first conversation was recorded. Null proxy scores mean that no application text existed.
These values must not be silently converted to zero.

## Reproduction

Run `npm run case:validate` for invariants. Run
`npm run case:export -- post_one_click` to create an analysis-ready CSV in the repository
root; generated exports are disposable and must not be committed.

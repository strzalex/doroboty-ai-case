# Instructor release, reset, and recovery runbook

Use only synthetic course data. Never point these commands at a production or participant-owned
Supabase project.

## Clean rehearsal

1. Confirm Node 24, Docker, and a clean checkout of the protected release branch.
2. Run `./scripts/setup-case`. This installs the lockfile, starts local Supabase, resets all
   migrations and fixtures, creates deterministic role accounts, and executes the verification
   gates.
3. Sign in as `operator@doroboty.local` using the password printed by the local account script.
4. Open `/app/case`. Starting with `baseline`, select every release in order and use **Ustaw i ukryj
   późniejsze etapy**. At each step, confirm the active value, fixture validation, and stage warning.
5. For each stage, run `npm run case:packet -- <release>` followed by
   `npm run case:verify-packet -- <release>`. Distribute only the verified `artifacts/participant-*`
   directory through a clean, history-free participant repository.
6. At `post_one_click`, complete both the forced long-form and one-click fixture journeys. Confirm
   deliberate consent and separate assignment/exposure records.
7. At `post_ai`, generate a candidate and employer draft, edit both, and approve them. Confirm no
   application or public job text changes before the explicit human action, and that approved job
   copy remains a private version until a separate publication decision.
8. At `pilot`, verify cost/adoption assumptions and the decision rule in `/app/case/pilot`.
9. At `demo_day`, export the final result and walk the Demo Day checklist. Record limitations and
   the next experiment; do not let the product write the participant's conclusion.
10. Run `./scripts/verify`, `npm run test:integration`, `npm run test:lighthouse`, and
    `npm run security:check`. Record the commit SHA, CI run, release key, and packet checksums.

The CI integration suite automates the role boundaries, both application variants, organization
onboarding, staged release sequence, AI approval boundaries, accessibility scans, and recruiting
outcome chain. A human rehearsal still owns facilitation quality and whether the narrative feels
discoverable rather than prescribed.

## Reset

Run `npm run db:reset`, then `npm run case:accounts`. Verify `current_case_release()` returns the
expected seed stage (`discovery`) before changing it. Regenerate participant packets; never reuse a
packet after changing its source fixture or release policy.

## Recovery

- Product regression: restore the last known-good Vercel deployment and prepare a normal revert PR.
- Database migration failure: stop the release, preserve logs, restore a backup into an isolated
  project, and test a forward-only corrective migration. Do not run reset in a remote environment.
- Incorrect stage release: use the operator control to select the last allowed stage. Rotate any
  packet or link that exposed a later stage; hiding a route does not retract downloaded evidence.
- Credential or PII leak: revoke/rotate the credential, remove the participant artifact, notify the
  course owner, and follow the approved privacy incident process before resuming.
- Analytics or AI outage: keep the deterministic provider/no-op analytics path, record the degraded
  state, and continue only if the week's learning goal remains valid.

## Release record

For each cohort, record:

- release tag and commit SHA;
- successful **Quality and demo** and **Supabase integration** checks;
- Supabase, Vercel, PostHog, and AI project owners (never credentials);
- current case release and packet SHA-256 manifest;
- backup/restore rehearsal date;
- technical and non-technical rehearsal notes;
- rollback owner and last known-good deployment.

Use [`RELEASE_CANDIDATE.md`](RELEASE_CANDIDATE.md) for the current pre-release evidence. Replace
its candidate values with the final cohort owners, tag, deployment, and rehearsal dates only after
all release gates pass.

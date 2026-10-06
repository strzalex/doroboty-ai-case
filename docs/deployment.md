# Deployment and maintenance

The repository contains configuration, but does not automatically create accounts, a Vercel project, or a remote database.

## GitHub

Publish the repository and set `main` as the default branch. After the first CI run, enable a ruleset requiring a pull request and the **Quality and demo** and **Supabase integration** checks. Rule availability depends on your plan and repository visibility. A workflow YAML file alone does not protect a branch.

CI runs without production secrets and uses the minimum `contents: read` permission. The second job runs its own Supabase instance on the runner. Playwright reports and traces are available as artifacts for 7 days. Dependencies are updated manually; automated Dependabot pull requests are disabled.

## Vercel

1. Import the repository into Vercel. Select Next.js, Node 24, `npm run build` as the build command, and `npm ci` as the install command.
2. For the initial demo deployment, leave Supabase variables empty. The build must work without them.
3. For production, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Configure auth using the [Supabase instructions](supabase.md).
4. For Preview, use a **separate Supabase project** and separate variables. You can also keep previews in demo mode. Do not copy production databases or secrets into pull requests.
5. Configure callback URLs separately for each environment. Next.js public variables are embedded at build time; changing them requires a new deployment.
6. The Vercel integration creates a preview for each pull request. Deploy production after merging into a protected `main` with passing CI. The branch protection described above is part of this setup.

## Verifying a deployment

Open the demo and check the mobile layout. Create a test account, confirm its email, and verify dashboard access after signing in again. Complete password recovery on the target domain. Check Vercel logs and SMTP delivery. Do not log passwords or tokens.

The starter does not include external monitoring or a backup guarantee. Before collecting important data, configure database backups for your Supabase plan and verify the recovery procedure.

## Rollback

In Vercel, restore the previous working deployment. In GitHub, prepare a revert of the faulty change. **Rolling back code does not roll back migrations or data.** Keep migrations compatible with both old and new versions; destructive changes require a data backup and a separate plan. Never run `db reset` in production.

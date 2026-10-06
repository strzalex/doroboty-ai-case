# Supabase

The demo runs without Supabase or Docker. The steps below enable user accounts. The dashboard continues to use static data. The starter contains no domain tables or SQL migrations.

## Cloud project

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Enter the URL and publishable key from the Connect panel. A legacy anon key also works. **Never use a service_role or secret key.**
3. In Auth, set Site URL to the application URL. Add `/auth/callback` to Redirect URLs with its parameters: `/auth/callback?next=/app` and `/auth/callback?next=/auth/update-password`. For local development, use `http://localhost:3000` and the equivalent callback URLs.
4. Enable email confirmation. Copy `supabase/templates/confirmation.html` and `recovery.html` into the Confirm signup and Reset password templates in the Auth panel. Our forms always set RedirectTo with a next parameter. Do not use these templates in other clients without that parameter.
5. Connect your own SMTP service before sharing the application with users, and verify email delivery. The local test mailbox is not an email delivery service.
6. Restart `npm run dev` and open `/app`.

After signing in, users see the sample dashboard. Add domain tables and RLS when implementing product features. Incomplete configuration shows setup instructions without switching to demo mode.

## Local integration tests

Docker must be running. The Supabase CLI is a development dependency:

```sh
npm run db:start
npx playwright install chromium
npm run test:integration
npm run db:stop
```

The first start downloads images. Ports: 54321 for the API, 54322 for the database, 54323 for Studio, 54324 for the Mailpit test mailbox, and 3107 for the test application. Do not run demo and integration tests in parallel: both rebuild `.next`.

The integration script reads the public key from the local CLI, rejects remote URLs, and builds the application against the local stack. It does not save keys to the repository. Tests cover sign-up, email confirmation, application access, sign-out, sign-in, password recovery, and independent sessions for two accounts. Emails go only to the local mailbox.

`npm run db:reset` deletes **local** data and reapplies migrations. Do not use it for a normal start; tests create unique accounts. After integration tests, `npm run test:e2e` rebuilds the application without Supabase configuration. Local email rate limits are increased only for tests.

The callback supports PKCE code and token_hash. Only `/app` and `/auth/update-password` are accepted redirect targets. Expired or invalid links lead to an error message on the sign-in screen.

## Domain tables

When adding a feature that needs a database, save its schema and RLS as a new migration. Before deployment, check `npx supabase db push --dry-run` for the correct project. Test RLS with two accounts in the local stack. The starter does not delete tables from previously configured databases.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (
    id uuid primary key default gen_random_uuid(),
    raw_user_meta_data jsonb not null default '{}'::jsonb
  );
  create or replace function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
`);

const directory = join(process.cwd(), "supabase", "migrations");
const migrations = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
for (const migration of migrations) {
  try {
    const sql = (await readFile(join(directory, migration), "utf8")).replace(
      "create extension if not exists pgcrypto;",
      "-- pgcrypto is built into Supabase; PGlite smoke tests the remaining migration",
    );
    await db.exec(sql);
    console.log(`migration ok: ${migration}`);
  } catch (error) {
    throw new Error(
      `Migration failed: ${migration}\n${error instanceof Error ? error.message : error}`,
    );
  }
}
await db.exec(await readFile(join(process.cwd(), "supabase", "seed.sql"), "utf8"));

const candidateA = "70000000-0000-4000-8000-000000000001";
const candidateB = "70000000-0000-4000-8000-000000000002";
await db.exec(`insert into auth.users (id, raw_user_meta_data) values
  ('${candidateA}', '{"display_name":"Candidate A"}'),
  ('${candidateB}', '{"display_name":"Candidate B"}')`);
async function actAs(id) {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub', '${id}', false); set role authenticated;`,
  );
}
await actAs(candidateA);
const ownProfiles = (await db.query("select id from public.profiles order by id")).rows;
if (ownProfiles.length !== 1 || ownProfiles[0].id !== candidateA) {
  throw new Error("Candidate profile RLS did not restrict reads to the current actor.");
}
const assignment = (
  await db.query("select (public.assign_experiment('application_flow')).id as id")
).rows[0];
await db.query("select public.record_experiment_exposure($1, null)", [assignment.id]);
const submitted = await db.query(`select public.submit_application_with_evidence(
  '20000000-0000-4000-8000-000000000001', 'long_form',
  'Prowadziłem discovery procesu i dowiozłem mierzalne wdrożenie z zespołem operacyjnym.',
  null, '{"fixture":true}', '{}', 'text-v1', '{"overlap":0.5}', 0.5
) as id`);
const applicationId = submitted.rows[0].id;
await actAs(candidateB);
const foreignApplications = (
  await db.query("select id from public.applications where id = $1", [applicationId])
).rows;
if (foreignApplications.length !== 0)
  throw new Error("Application RLS leaked another candidate's record.");
await db.query(`select public.submit_application_with_evidence(
  '20000000-0000-4000-8000-000000000002', 'long_form',
  'Budowałem ewaluacje systemów AI i wdrożyłem nadzór człowieka w regulowanym środowisku.',
  null, '{"fixture":true}', '{}', 'text-v1', '{"overlap":0.6}', 0.6
)`);
const employerA = "70000000-0000-4000-8000-000000000003";
const employerB = "70000000-0000-4000-8000-000000000004";
await db.exec(`reset role;
  insert into auth.users (id, raw_user_meta_data) values
    ('${employerA}', '{"display_name":"Employer A"}'),
    ('${employerB}', '{"display_name":"Employer B"}');
  update public.profiles set role = 'employer' where id in ('${employerA}', '${employerB}');
  insert into public.organization_memberships (organization_id, user_id, role) values
    ('40000000-0000-4000-8000-000000000001', '${employerA}', 'recruiter'),
    ('40000000-0000-4000-8000-000000000002', '${employerB}', 'recruiter');`);
await actAs(employerA);
const employerAApplications = (await db.query("select id from public.applications")).rows;
if (employerAApplications.length !== 1 || employerAApplications[0].id !== applicationId) {
  throw new Error("Organization RLS did not isolate employer applications.");
}
await db.exec("reset role; select set_config('request.jwt.claim.sub', '', false);");

const jobs = (await db.query("select count(*)::int as count from public.jobs")).rows[0].count;
const companies = (await db.query("select count(*)::int as count from public.companies")).rows[0]
  .count;
const releases = (await db.query("select count(*)::int as count from public.case_releases")).rows[0]
  .count;
const rlsTables = (
  await db.query(
    "select count(*)::int as count from pg_class where relnamespace = 'public'::regnamespace and relrowsecurity",
  )
).rows[0].count;
if (jobs !== 6 || companies !== 3 || releases !== 6 || rlsTables < 15) {
  throw new Error(
    `Unexpected seed/schema counts: jobs=${jobs}, companies=${companies}, releases=${releases}, RLS=${rlsTables}`,
  );
}
await db.close();
console.log(
  `Migration gate passed: ${migrations.length} migrations, deterministic seed, and ${rlsTables} RLS tables.`,
);

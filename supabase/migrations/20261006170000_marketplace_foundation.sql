create extension if not exists pgcrypto;

create type public.job_category as enum ('build', 'apply', 'lead');
create type public.job_function as enum ('product', 'engineering', 'data', 'design', 'marketing', 'operations');
create type public.remote_status as enum ('onsite', 'hybrid', 'remote');
create type public.seniority_level as enum ('junior', 'mid', 'senior', 'lead');
create type public.contract_type as enum ('employment', 'b2b', 'mandate');
create type public.publication_status as enum ('draft', 'review', 'published', 'hidden', 'expired', 'archived');
create type public.verification_status as enum ('unverified', 'editorial', 'employer_verified');
create type public.salary_period as enum ('month', 'year');
create type public.salary_kind as enum ('gross', 'net');
create type public.text_version_source as enum ('human', 'ai_generated', 'human_edited');
create type public.text_visibility as enum ('private', 'public');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  summary text not null check (char_length(summary) between 10 and 240),
  description text not null check (char_length(description) between 20 and 5000),
  website_url text not null check (website_url ~ '^https://'),
  location text not null check (char_length(location) between 2 and 120),
  size_label text not null check (char_length(size_label) between 2 and 80),
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employer_briefs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  source_text text not null check (char_length(source_text) between 20 and 20000),
  decision_criteria jsonb not null default '[]'::jsonb check (jsonb_typeof(decision_criteria) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  company_id uuid not null references public.companies(id) on delete cascade,
  employer_brief_id uuid references public.employer_briefs(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 160),
  summary text not null check (char_length(summary) between 20 and 300),
  description text not null check (char_length(description) between 50 and 30000),
  category public.job_category not null,
  function public.job_function not null,
  remote_status public.remote_status not null,
  locations text[] not null check (cardinality(locations) > 0),
  seniority public.seniority_level not null,
  contract_type public.contract_type not null,
  salary_min integer check (salary_min is null or salary_min > 0),
  salary_max integer check (salary_max is null or salary_max > 0),
  salary_currency text check (salary_currency in ('PLN', 'EUR')),
  salary_period public.salary_period,
  salary_kind public.salary_kind,
  publication_status public.publication_status not null default 'draft',
  verification_status public.verification_status not null default 'unverified',
  published_at timestamptz,
  expiry_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_range check (salary_min is null or salary_max is null or salary_min <= salary_max),
  constraint jobs_salary_complete check (
    (salary_min is null and salary_max is null and salary_currency is null and salary_period is null and salary_kind is null)
    or (coalesce(salary_min, salary_max) is not null and salary_currency is not null and salary_period is not null and salary_kind is not null)
  ),
  constraint jobs_publication_dates check (
    publication_status not in ('published', 'expired')
    or (published_at is not null and expiry_at is not null and expiry_at > published_at)
  )
);

create table public.job_text_versions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  version integer not null check (version > 0),
  source public.text_version_source not null,
  visibility public.text_visibility not null default 'private',
  title text not null check (char_length(title) between 2 and 160),
  summary text not null check (char_length(summary) between 20 and 300),
  description text not null check (char_length(description) between 50 and 30000),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, version)
);

create index jobs_public_listing_idx
  on public.jobs (publication_status, published_at desc)
  where publication_status = 'published';
create index jobs_filter_idx on public.jobs (category, function, remote_status, seniority, contract_type);
create index jobs_company_idx on public.jobs (company_id, publication_status);
create index job_text_versions_job_idx on public.job_text_versions (job_id, version desc);
create index employer_briefs_company_idx on public.employer_briefs (company_id, created_at desc);

alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.employer_briefs enable row level security;
alter table public.job_text_versions enable row level security;

create policy "published jobs are public"
  on public.jobs for select
  to anon, authenticated
  using (publication_status = 'published');

create policy "companies with published jobs are public"
  on public.companies for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.jobs
      where jobs.company_id = companies.id and jobs.publication_status = 'published'
    )
  );

create policy "approved public job text is public"
  on public.job_text_versions for select
  to anon, authenticated
  using (
    visibility = 'public'
    and approved_at is not null
    and exists (
      select 1 from public.jobs
      where jobs.id = job_text_versions.job_id and jobs.publication_status = 'published'
    )
  );

grant usage on schema public to anon, authenticated;
grant select on public.companies, public.jobs, public.job_text_versions to anon, authenticated;
revoke all on public.employer_briefs from anon, authenticated;

comment on table public.employer_briefs is 'Private source truth for a role; never exposed through public APIs.';
comment on table public.job_text_versions is 'Immutable job copy provenance. Only approved public versions are readable publicly.';

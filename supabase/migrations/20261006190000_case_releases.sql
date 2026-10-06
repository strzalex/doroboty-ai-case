create type public.case_release_key as enum ('baseline', 'post_one_click', 'discovery', 'post_ai', 'pilot', 'demo_day');
create type public.case_evidence_kind as enum ('interview', 'support_ticket', 'sales_note', 'public_review', 'metric_snapshot');
create type public.experiment_surface as enum ('application_flow', 'employer_job_copy', 'candidate_answer');

create table public.case_releases (
  key public.case_release_key primary key,
  sequence smallint not null unique check (sequence between 1 and 6),
  title text not null,
  participant_summary text not null,
  unlocked boolean not null default false,
  released_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.case_evidence_documents (
  id uuid primary key default gen_random_uuid(),
  release_key public.case_release_key not null references public.case_releases(key) on delete cascade,
  kind public.case_evidence_kind not null,
  source_label text not null check (char_length(source_label) between 2 and 160),
  title text not null check (char_length(title) between 2 and 200),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  visible_to_participants boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.experiment_assignments (
  id uuid primary key default gen_random_uuid(),
  subject_key text not null,
  surface public.experiment_surface not null,
  variant text not null check (char_length(variant) between 1 and 80),
  release_key public.case_release_key not null references public.case_releases(key),
  assigned_at timestamptz not null default now(),
  unique (subject_key, surface, release_key)
);

create table public.experiment_exposures (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.experiment_assignments(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  exposed_at timestamptz not null default now(),
  unique (assignment_id, application_id)
);

create index case_evidence_release_idx on public.case_evidence_documents (release_key, kind);
create index experiment_assignments_release_idx on public.experiment_assignments (release_key, surface, variant);
create index experiment_exposures_application_idx on public.experiment_exposures (application_id, exposed_at);

alter table public.case_releases enable row level security;
alter table public.case_evidence_documents enable row level security;
alter table public.experiment_assignments enable row level security;
alter table public.experiment_exposures enable row level security;

create policy "operators manage case releases" on public.case_releases for all to authenticated using (public.is_operator()) with check (public.is_operator());
create policy "operators manage case evidence" on public.case_evidence_documents for all to authenticated using (public.is_operator()) with check (public.is_operator());
create policy "participants read unlocked evidence" on public.case_evidence_documents for select to authenticated
  using (
    visible_to_participants
    and exists (select 1 from public.case_releases where key = case_evidence_documents.release_key and unlocked)
  );
create policy "involved parties read assignments" on public.experiment_assignments for select to authenticated
  using (subject_key = auth.uid()::text or public.is_operator());
create policy "involved parties read exposure" on public.experiment_exposures for select to authenticated
  using (
    public.is_operator()
    or exists (select 1 from public.applications where id = experiment_exposures.application_id)
  );

revoke all on public.case_releases, public.case_evidence_documents, public.experiment_assignments, public.experiment_exposures from anon;
grant select on public.case_releases, public.case_evidence_documents, public.experiment_assignments, public.experiment_exposures to authenticated;
grant insert, update, delete on public.case_releases, public.case_evidence_documents, public.experiment_assignments, public.experiment_exposures to authenticated;

comment on table public.case_releases is 'Instructor-controlled reveal sequence. Never unlock a later stage early.';
comment on table public.experiment_exposures is 'Actual treatment exposure, stored separately from assignment.';

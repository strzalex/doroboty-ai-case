create type public.profile_role as enum ('candidate', 'employer', 'operator');
create type public.membership_role as enum ('recruiter', 'hiring_manager');
create type public.application_variant as enum ('long_form', 'one_click');
create type public.application_status as enum ('submitted', 'in_review', 'interview', 'continued', 'rejected', 'withdrawn', 'hired');
create type public.application_stage as enum ('submitted', 'reviewed', 'interview_invited', 'first_conversation_held', 'continued', 'rejected', 'withdrawn', 'hired');
create type public.first_conversation_decision as enum ('continue', 'reject', 'pending');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.profile_role not null default 'candidate',
  display_name text check (display_name is null or char_length(display_name) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.candidate_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text check (headline is null or char_length(headline) <= 160),
  bio text check (bio is null or char_length(bio) <= 3000),
  city text check (city is null or char_length(city) <= 120),
  experience_years smallint check (experience_years is null or experience_years between 0 and 60),
  language_background text check (language_background is null or char_length(language_background) <= 120),
  updated_at timestamptz not null default now()
);

create table public.candidate_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  company_name text not null check (char_length(company_name) between 2 and 160),
  description text not null check (char_length(description) between 20 and 5000),
  measurable_outcome text check (measurable_outcome is null or char_length(measurable_outcome) <= 1000),
  started_on date,
  ended_on date,
  created_at timestamptz not null default now(),
  constraint experience_date_order check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.candidate_work_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  url text check (url is null or url ~ '^https://'),
  context text not null check (char_length(context) between 20 and 3000),
  outcome text not null check (char_length(outcome) between 10 and 2000),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.profiles(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  variant public.application_variant not null,
  answer text not null check (char_length(answer) between 40 and 5000),
  source_snapshot jsonb not null check (jsonb_typeof(source_snapshot) = 'object'),
  status public.application_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

create table public.application_stage_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  stage public.application_stage not null,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  note text check (note is null or char_length(note) <= 2000),
  occurred_at timestamptz not null default now()
);

create table public.interview_outcomes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  first_conversation_at timestamptz not null,
  decision public.first_conversation_decision not null,
  later_hired boolean,
  recorded_by uuid not null references public.profiles(id) on delete restrict,
  notes text check (notes is null or char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.append_submitted_event()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.application_stage_events (application_id, stage, actor_id)
  values (new.id, 'submitted', new.candidate_id);
  return new;
end;
$$;

create trigger on_application_submitted
  after insert on public.applications
  for each row execute procedure public.append_submitted_event();

create index memberships_user_idx on public.organization_memberships (user_id, organization_id);
create index candidate_experiences_user_idx on public.candidate_experiences (user_id, created_at desc);
create index candidate_work_samples_user_idx on public.candidate_work_samples (user_id, created_at desc);
create index applications_candidate_idx on public.applications (candidate_id, submitted_at desc);
create index applications_organization_idx on public.applications (organization_id, status, submitted_at desc);
create index applications_job_idx on public.applications (job_id, submitted_at desc);
create index application_events_timeline_idx on public.application_stage_events (application_id, occurred_at);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (new.id, 'candidate', nullif(new.raw_user_meta_data ->> 'display_name', ''));
  insert into public.candidate_profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_profile_role()
returns public.profile_role
language sql
stable
security definer set search_path = ''
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.organization_memberships
    where organization_id = target_organization_id and user_id = auth.uid()
  )
$$;

create or replace function public.is_operator()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce(public.current_profile_role() = 'operator', false)
$$;

create or replace function public.record_application_stage(
  target_application_id uuid,
  next_stage public.application_stage,
  event_note text default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target_organization uuid;
  next_status public.application_status;
  outcome_decision public.first_conversation_decision;
begin
  if actor is null then raise exception 'authentication required'; end if;
  if next_stage not in ('reviewed', 'interview_invited', 'first_conversation_held', 'continued', 'rejected', 'hired') then
    raise exception 'unsupported employer stage';
  end if;
  if event_note is not null and char_length(event_note) > 2000 then raise exception 'note too long'; end if;

  select organization_id into target_organization
  from public.applications where id = target_application_id;
  if target_organization is null then raise exception 'application not found'; end if;
  if not public.is_organization_member(target_organization) and not public.is_operator() then
    raise exception 'forbidden';
  end if;

  next_status := case next_stage
    when 'reviewed' then 'in_review'
    when 'interview_invited' then 'interview'
    when 'first_conversation_held' then 'interview'
    when 'continued' then 'continued'
    when 'rejected' then 'rejected'
    when 'hired' then 'hired'
  end;

  insert into public.application_stage_events (application_id, stage, actor_id, note)
  values (target_application_id, next_stage, actor, event_note);
  update public.applications set status = next_status, updated_at = now() where id = target_application_id;

  if next_stage in ('first_conversation_held', 'continued', 'rejected') then
    outcome_decision := case next_stage
      when 'continued' then 'continue'
      when 'rejected' then 'reject'
      else 'pending'
    end;
    insert into public.interview_outcomes (
      application_id, first_conversation_at, decision, recorded_by, notes
    ) values (
      target_application_id, now(), outcome_decision, actor, event_note
    )
    on conflict (application_id) do update set
      decision = excluded.decision,
      recorded_by = excluded.recorded_by,
      notes = excluded.notes,
      updated_at = now();
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.candidate_experiences enable row level security;
alter table public.candidate_work_samples enable row level security;
alter table public.applications enable row level security;
alter table public.application_stage_events enable row level security;
alter table public.interview_outcomes enable row level security;

create policy "profiles are self readable" on public.profiles for select to authenticated using (id = auth.uid() or public.is_operator());
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "organizations are visible to signed in users" on public.organizations for select to authenticated using (true);
create policy "memberships are self readable" on public.organization_memberships for select to authenticated using (user_id = auth.uid() or public.is_operator());

create policy "candidate profile ownership" on public.candidate_profiles for all to authenticated using (user_id = auth.uid() or public.is_operator()) with check (user_id = auth.uid() or public.is_operator());
create policy "candidate experience ownership" on public.candidate_experiences for all to authenticated using (user_id = auth.uid() or public.is_operator()) with check (user_id = auth.uid() or public.is_operator());
create policy "candidate work sample ownership" on public.candidate_work_samples for all to authenticated using (user_id = auth.uid() or public.is_operator()) with check (user_id = auth.uid() or public.is_operator());

create policy "applications visible to involved parties" on public.applications for select to authenticated
  using (candidate_id = auth.uid() or public.is_organization_member(organization_id) or public.is_operator());
create policy "candidates submit their applications" on public.applications for insert to authenticated
  with check (
    candidate_id = auth.uid()
    and public.current_profile_role() = 'candidate'
    and exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
        and jobs.company_id = (select company_id from public.organizations where id = applications.organization_id)
        and jobs.publication_status = 'published'
    )
  );
create policy "application events visible to involved parties" on public.application_stage_events for select to authenticated
  using (exists (select 1 from public.applications where applications.id = application_stage_events.application_id));

create policy "interview outcomes visible to involved parties" on public.interview_outcomes for select to authenticated
  using (exists (select 1 from public.applications where applications.id = interview_outcomes.application_id));

revoke all on public.profiles, public.organizations, public.organization_memberships, public.candidate_profiles, public.candidate_experiences, public.candidate_work_samples, public.applications, public.application_stage_events, public.interview_outcomes from anon;
grant select on public.profiles, public.organizations, public.organization_memberships, public.candidate_profiles, public.candidate_experiences, public.candidate_work_samples, public.applications, public.application_stage_events, public.interview_outcomes to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant insert, update on public.candidate_profiles to authenticated;
grant insert, update, delete on public.candidate_experiences, public.candidate_work_samples to authenticated;
grant insert on public.applications to authenticated;
grant execute on function public.current_profile_role(), public.is_organization_member(uuid), public.is_operator(), public.record_application_stage(uuid, public.application_stage, text) to authenticated;

comment on column public.applications.source_snapshot is 'Immutable candidate source evidence captured at submission time.';
comment on table public.application_stage_events is 'Append-only recruiting audit trail.';

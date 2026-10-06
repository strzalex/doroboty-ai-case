create type public.ai_generation_purpose as enum ('job_draft', 'candidate_answer');
create type public.ai_generation_status as enum ('succeeded', 'failed');

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  purpose public.ai_generation_purpose not null,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  provider text not null check (char_length(provider) between 2 and 80),
  model text not null check (char_length(model) between 2 and 160),
  prompt_version text not null check (char_length(prompt_version) between 1 and 80),
  source_payload jsonb not null check (jsonb_typeof(source_payload) = 'object'),
  output_text text check (output_text is null or char_length(output_text) <= 30000),
  latency_ms integer not null check (latency_ms >= 0),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  estimated_cost_usd numeric(12, 6) check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  status public.ai_generation_status not null,
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.applications
  add column answer_generation_id uuid references public.ai_generations(id) on delete set null;

alter table public.job_text_versions
  add column generation_id uuid references public.ai_generations(id) on delete set null;

create table public.application_answer_versions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  version integer not null check (version > 0),
  source public.text_version_source not null,
  generation_id uuid references public.ai_generations(id) on delete set null,
  source_evidence_ids text[] not null default '{}',
  answer text not null check (char_length(answer) between 40 and 5000),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (application_id, version)
);

create table public.fit_scores (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  version text not null check (char_length(version) between 1 and 40),
  input_job_text_version integer,
  input_answer_version integer not null,
  components jsonb not null check (jsonb_typeof(components) = 'object'),
  score numeric(5, 4) not null check (score between 0 and 1),
  calculated_at timestamptz not null default now(),
  unique (application_id, version, input_answer_version)
);

create index ai_generations_requester_idx on public.ai_generations (requested_by, created_at desc);
create index ai_generations_job_idx on public.ai_generations (job_id, purpose, created_at desc);
create index answer_versions_application_idx on public.application_answer_versions (application_id, version desc);
create index fit_scores_application_idx on public.fit_scores (application_id, calculated_at desc);

alter table public.ai_generations enable row level security;
alter table public.application_answer_versions enable row level security;
alter table public.fit_scores enable row level security;

create policy "requesters and involved employers read AI generations" on public.ai_generations for select to authenticated
  using (
    requested_by = auth.uid()
    or public.is_operator()
    or exists (
      select 1 from public.jobs
      join public.organizations on organizations.company_id = jobs.company_id
      where jobs.id = ai_generations.job_id
        and public.is_organization_member(organizations.id)
    )
  );
create policy "users create their own AI generations" on public.ai_generations for insert to authenticated
  with check (
    requested_by = auth.uid()
    and application_id is null
    and (
      (purpose = 'candidate_answer' and public.current_profile_role() = 'candidate')
      or (
        purpose = 'job_draft'
        and exists (
          select 1 from public.jobs
          join public.organizations on organizations.company_id = jobs.company_id
          where jobs.id = ai_generations.job_id
            and public.is_organization_member(organizations.id)
        )
      )
      or public.is_operator()
    )
  );
create policy "answer versions visible to involved parties" on public.application_answer_versions for select to authenticated
  using (exists (select 1 from public.applications where id = application_answer_versions.application_id));
create policy "candidates create answer versions" on public.application_answer_versions for insert to authenticated
  with check (
    exists (
      select 1 from public.applications
      where id = application_answer_versions.application_id and candidate_id = auth.uid()
    )
  );
create policy "fit scores visible to involved parties" on public.fit_scores for select to authenticated
  using (exists (select 1 from public.applications where id = fit_scores.application_id));
create policy "candidates create initial fit score" on public.fit_scores for insert to authenticated
  with check (
    exists (
      select 1 from public.applications
      where id = fit_scores.application_id and candidate_id = auth.uid()
    )
  );

create policy "employers read their briefs" on public.employer_briefs for select to authenticated
  using (
    public.is_operator()
    or exists (
      select 1 from public.organizations
      where organizations.company_id = employer_briefs.company_id
        and public.is_organization_member(organizations.id)
    )
  );

create or replace function public.approve_job_text_version(
  target_job_id uuid,
  target_generation_id uuid,
  approved_title text,
  approved_summary text,
  approved_description text
)
returns integer
language plpgsql
security definer set search_path = ''
as $$
declare
  target_company uuid;
  target_organization uuid;
  next_version integer;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if char_length(approved_title) not between 2 and 160 then raise exception 'invalid title'; end if;
  if char_length(approved_summary) not between 20 and 300 then raise exception 'invalid summary'; end if;
  if char_length(approved_description) not between 50 and 30000 then raise exception 'invalid description'; end if;

  select company_id into target_company from public.jobs where id = target_job_id;
  select id into target_organization from public.organizations where company_id = target_company;
  if target_organization is null or (not public.is_organization_member(target_organization) and not public.is_operator()) then
    raise exception 'forbidden';
  end if;
  if not exists (
    select 1 from public.ai_generations
    where id = target_generation_id and job_id = target_job_id
      and (requested_by = auth.uid() or public.is_operator())
      and purpose = 'job_draft' and status = 'succeeded'
  ) then raise exception 'generation not found'; end if;

  select coalesce(max(version), 0) + 1 into next_version
  from public.job_text_versions where job_id = target_job_id;
  insert into public.job_text_versions (
    job_id, version, source, visibility, generation_id, title, summary, description, approved_at
  ) values (
    target_job_id, next_version, 'human_edited', 'private', target_generation_id, approved_title,
    approved_summary, approved_description, now()
  );
  update public.jobs set title = approved_title, summary = approved_summary,
    description = approved_description, updated_at = now()
  where id = target_job_id;
  return next_version;
end;
$$;

create or replace function public.submit_application_with_evidence(
  target_job_id uuid,
  target_variant public.application_variant,
  final_answer text,
  target_generation_id uuid,
  source_snapshot jsonb,
  source_evidence_ids text[],
  fit_version text,
  fit_components jsonb,
  fit_score numeric
)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target_organization uuid;
  created_application uuid;
begin
  if actor is null or public.current_profile_role() <> 'candidate' then
    raise exception 'candidate authentication required';
  end if;
  if char_length(final_answer) not between 40 and 5000 then raise exception 'invalid answer'; end if;
  if jsonb_typeof(source_snapshot) <> 'object' then raise exception 'invalid source snapshot'; end if;
  if jsonb_typeof(fit_components) <> 'object' or fit_score not between 0 and 1 then
    raise exception 'invalid fit score';
  end if;

  select organizations.id into target_organization
  from public.jobs
  join public.organizations on organizations.company_id = jobs.company_id
  where jobs.id = target_job_id and jobs.publication_status = 'published';
  if target_organization is null then raise exception 'job unavailable'; end if;

  if target_generation_id is not null and not exists (
    select 1 from public.ai_generations
    where id = target_generation_id and requested_by = actor and job_id = target_job_id
      and purpose = 'candidate_answer' and status = 'succeeded' and application_id is null
  ) then raise exception 'generation unavailable'; end if;

  insert into public.applications (
    candidate_id, job_id, organization_id, variant, answer, answer_generation_id, source_snapshot
  ) values (
    actor, target_job_id, target_organization, target_variant, final_answer,
    target_generation_id, source_snapshot
  ) returning id into created_application;

  insert into public.application_answer_versions (
    application_id, version, source, generation_id, source_evidence_ids, answer, approved_at
  ) values (
    created_application, 1,
    case when target_generation_id is null then 'human'::public.text_version_source
      else 'human_edited'::public.text_version_source end,
    target_generation_id, source_evidence_ids, final_answer, now()
  );

  insert into public.fit_scores (
    application_id, version, input_answer_version, components, score
  ) values (created_application, fit_version, 1, fit_components, fit_score);

  if target_generation_id is not null then
    update public.ai_generations set application_id = created_application
    where id = target_generation_id;
  end if;

  insert into public.experiment_exposures (assignment_id, application_id)
  select distinct experiment_exposures.assignment_id, created_application
  from public.experiment_exposures
  join public.experiment_assignments
    on experiment_assignments.id = experiment_exposures.assignment_id
  where experiment_assignments.subject_key = actor::text
    and experiment_exposures.application_id is null
  on conflict (assignment_id, application_id) do nothing;
  return created_application;
end;
$$;

revoke all on public.ai_generations, public.application_answer_versions, public.fit_scores from anon;
grant select on public.employer_briefs to authenticated;
grant select, insert on public.ai_generations to authenticated;
grant select on public.application_answer_versions, public.fit_scores to authenticated;
revoke insert on public.applications from authenticated;
grant execute on function public.approve_job_text_version(uuid, uuid, text, text, text) to authenticated;
grant execute on function public.submit_application_with_evidence(uuid, public.application_variant, text, uuid, jsonb, text[], text, jsonb, numeric) to authenticated;

comment on table public.fit_scores is 'Versioned text similarity proxy. It must never automate a hiring action.';
comment on table public.ai_generations is 'Immutable AI provenance. Browser telemetry must not contain source_payload or output_text.';

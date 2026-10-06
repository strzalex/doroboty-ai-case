create policy "involved employers read private job text versions"
on public.job_text_versions for select to authenticated
using (
  public.is_operator()
  or exists (
    select 1
    from public.jobs
    join public.organizations on organizations.company_id = jobs.company_id
    where jobs.id = job_text_versions.job_id
      and public.is_organization_member(organizations.id)
  )
);

create or replace function public.can_use_ai(target_surface public.experiment_surface)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce(public.is_operator() or exists (
    select 1
    from public.experiment_assignments
    join public.experiment_exposures
      on experiment_exposures.assignment_id = experiment_assignments.id
    where experiment_assignments.subject_key = auth.uid()::text
      and experiment_assignments.surface = target_surface
      and experiment_assignments.variant = 'ai_draft'
      and experiment_assignments.release_key = public.current_case_release()
  ), false)
$$;

create or replace function public.record_experiment_exposure(
  target_assignment_id uuid,
  target_application_id uuid default null
)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  exposure_id uuid;
begin
  if actor is null then raise exception 'authentication required'; end if;
  if not exists (
    select 1 from public.experiment_assignments
    where id = target_assignment_id
      and (subject_key = actor::text or public.is_operator())
      and (release_key = public.current_case_release() or public.is_operator())
  ) then raise exception 'assignment unavailable'; end if;
  if target_application_id is not null and not exists (
    select 1 from public.applications
    where id = target_application_id
      and (candidate_id = actor or public.is_organization_member(organization_id) or public.is_operator())
  ) then raise exception 'application unavailable'; end if;

  select id into exposure_id from public.experiment_exposures
  where assignment_id = target_assignment_id
    and application_id is not distinct from target_application_id;
  if exposure_id is null then
    insert into public.experiment_exposures (assignment_id, application_id)
    values (target_assignment_id, target_application_id)
    returning id into exposure_id;
  end if;
  return exposure_id;
end;
$$;

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
  return next_version;
end;
$$;

comment on function public.approve_job_text_version(uuid, uuid, text, text, text) is
  'Approves a private, immutable draft version. Publishing remains a separate operator decision.';

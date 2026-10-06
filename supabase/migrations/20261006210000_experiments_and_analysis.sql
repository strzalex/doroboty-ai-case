create or replace function public.current_case_release()
returns public.case_release_key
language sql
stable
security definer set search_path = ''
as $$
  select key from public.case_releases where unlocked order by sequence desc limit 1
$$;

create or replace function public.release_case(target_release public.case_release_key)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  target_sequence smallint;
begin
  if not public.is_operator() then raise exception 'operator required'; end if;
  select sequence into target_sequence from public.case_releases where key = target_release;
  if target_sequence is null then raise exception 'unknown release'; end if;
  update public.case_releases set
    unlocked = sequence <= target_sequence,
    released_at = case
      when sequence <= target_sequence then coalesce(released_at, now())
      else null
    end;
end;
$$;

create or replace function public.assign_experiment(target_surface public.experiment_surface)
returns public.experiment_assignments
language plpgsql
security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  active_release public.case_release_key;
  active_sequence smallint;
  assigned_variant text;
  assignment public.experiment_assignments;
begin
  if actor is null then raise exception 'authentication required'; end if;
  select key, sequence into active_release, active_sequence
  from public.case_releases where unlocked order by sequence desc limit 1;
  if active_release is null then raise exception 'no active case release'; end if;

  assigned_variant := case target_surface
    when 'application_flow' then
      case when active_sequence < 2 then 'long_form'
        when mod(hashtext(actor::text || ':' || target_surface::text), 2) = 0 then 'long_form'
        else 'one_click' end
    when 'employer_job_copy' then
      case when active_sequence < 4 then 'manual'
        when mod(hashtext(actor::text || ':' || target_surface::text), 2) = 0 then 'manual'
        else 'ai_draft' end
    when 'candidate_answer' then
      case when active_sequence < 4 then 'manual'
        when mod(hashtext(actor::text || ':' || target_surface::text), 2) = 0 then 'manual'
        else 'ai_draft' end
  end;

  insert into public.experiment_assignments (subject_key, surface, variant, release_key)
  values (actor::text, target_surface, assigned_variant, active_release)
  on conflict (subject_key, surface, release_key) do update
    set subject_key = excluded.subject_key
  returning * into assignment;
  return assignment;
end;
$$;

create unique index experiment_exposures_assignment_without_application_idx
  on public.experiment_exposures (assignment_id) where application_id is null;

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

create view public.application_outcome_analysis
with (security_invoker = true)
as
select
  applications.id as application_id,
  applications.job_id,
  applications.organization_id,
  applications.variant,
  applications.submitted_at,
  fit_scores.score as text_fit_score,
  interview_outcomes.first_conversation_at,
  interview_outcomes.decision as first_conversation_decision,
  interview_outcomes.later_hired,
  applications.status
from public.applications
left join public.fit_scores on fit_scores.application_id = applications.id
left join public.interview_outcomes on interview_outcomes.application_id = applications.id;

grant select on public.application_outcome_analysis to authenticated;
grant execute on function public.current_case_release(), public.release_case(public.case_release_key), public.assign_experiment(public.experiment_surface), public.record_experiment_exposure(uuid, uuid) to authenticated;

comment on view public.application_outcome_analysis is 'Joinable proxy and downstream outcomes. Text fit is not a hiring decision.';

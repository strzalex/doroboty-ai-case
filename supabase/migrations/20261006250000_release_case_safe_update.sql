create or replace function public.release_case(target_release public.case_release_key)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  target_sequence smallint;
begin
  if not public.is_operator() then raise exception 'operator required'; end if;

  select sequence into target_sequence
  from public.case_releases
  where key = target_release;

  if target_sequence is null then raise exception 'unknown release'; end if;

  update public.case_releases
  set
    unlocked = case_releases.sequence <= target_sequence,
    released_at = case
      when case_releases.sequence <= target_sequence then coalesce(case_releases.released_at, now())
      else null
    end
  where case_releases.sequence between 1 and 6;
end;
$$;

comment on function public.release_case(public.case_release_key) is
  'Atomically unlocks the selected release and its predecessors, and hides all later stages.';

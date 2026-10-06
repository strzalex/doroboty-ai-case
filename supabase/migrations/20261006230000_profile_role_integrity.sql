revoke update on table public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create or replace function public.prevent_untrusted_profile_role_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if auth.uid() is not null
    and old.role is distinct from new.role
    and not public.is_operator()
  then
    raise insufficient_privilege using message = 'profile role cannot be changed by this account';
  end if;
  return new;
end;
$$;

create trigger profiles_role_integrity
before update of role on public.profiles
for each row execute function public.prevent_untrusted_profile_role_change();

revoke all on function public.prevent_untrusted_profile_role_change() from public, anon, authenticated;

comment on function public.prevent_untrusted_profile_role_change() is
  'Defense in depth: role changes require an operator or a trusted server context.';

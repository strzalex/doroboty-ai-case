create or replace function public.create_employer_organization(
  organization_name text,
  organization_slug text,
  organization_summary text,
  organization_description text,
  organization_website text,
  organization_location text,
  organization_size text
)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  company_id uuid;
  organization_id uuid;
begin
  if actor is null or public.current_profile_role() <> 'employer' then
    raise exception 'employer authentication required';
  end if;
  if exists (select 1 from public.organization_memberships where user_id = actor) then
    raise exception 'organization already assigned';
  end if;
  if char_length(organization_name) not between 2 and 120
    or organization_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    or char_length(organization_summary) not between 10 and 240
    or char_length(organization_description) not between 20 and 5000
    or organization_website !~ '^https://'
    or char_length(organization_location) not between 2 and 120
    or char_length(organization_size) not between 2 and 80 then
    raise exception 'invalid organization data';
  end if;

  insert into public.companies (slug, name, summary, description, website_url, location, size_label)
  values (organization_slug, organization_name, organization_summary, organization_description,
    organization_website, organization_location, organization_size)
  returning id into company_id;
  insert into public.organizations (company_id, name, slug)
  values (company_id, organization_name, organization_slug)
  returning id into organization_id;
  insert into public.organization_memberships (organization_id, user_id, role)
  values (organization_id, actor, 'recruiter');
  return organization_id;
end;
$$;

grant execute on function public.create_employer_organization(text, text, text, text, text, text, text) to authenticated;

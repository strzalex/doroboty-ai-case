import { OrganizationOnboardingForm } from "@/features/organizations/onboarding-form";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  if (!getSupabaseConfig().configured) return null;
  const { client, user } = await requireProfile(["employer"]);
  const { data } = await client
    .from("organization_memberships")
    .select("role, organization:organizations(name, slug)")
    .eq("user_id", user.id)
    .maybeSingle();
  const organization =
    data && (Array.isArray(data.organization) ? data.organization[0] : data.organization);
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Organizacja</h1>
          <p>Firma, członkostwo i bezpieczny start strefy pracodawcy.</p>
        </div>
      </div>
      {organization ? (
        <div className="max-w-2xl border-2 bg-secondary p-6">
          <p className="font-ui text-xs font-bold uppercase">{data.role}</p>
          <h2 className="mt-2 font-display text-4xl uppercase">{organization.name}</h2>
          <p className="mt-2">
            Slug: <code>{organization.slug}</code>
          </p>
        </div>
      ) : (
        <OrganizationOnboardingForm />
      )}
    </div>
  );
}

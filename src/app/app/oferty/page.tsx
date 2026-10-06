import { JobDraftWorkspace } from "@/features/ai/job-draft-workspace";
import { ExperimentExposure } from "@/features/experiments/exposure";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function EmployerJobsPage() {
  if (!getSupabaseConfig().configured) return null;
  const { client, user, profile } = await requireProfile(["employer", "operator"]);
  let companyIds: string[] | null = null;
  if (profile.role === "employer") {
    const { data: memberships } = await client
      .from("organization_memberships")
      .select("organization:organizations(company_id)")
      .eq("user_id", user.id);
    companyIds = (memberships ?? []).flatMap((membership) => {
      const organization = Array.isArray(membership.organization)
        ? membership.organization[0]
        : membership.organization;
      return organization?.company_id ? [organization.company_id] : [];
    });
  }
  let query = client.from("jobs").select("id, title, company_id").order("title");
  if (companyIds) query = query.in("company_id", companyIds);
  const { data, error } = await query;
  if (error) throw new Error("Nie udało się wczytać ofert firmy.");
  const { data: assignment, error: assignmentError } = await client.rpc("assign_experiment", {
    target_surface: "employer_job_copy",
  });
  if (assignmentError) throw new Error("Nie udało się przydzielić wariantu eksperymentu.");
  const treatment = assignment as { id: string; variant: "manual" | "ai_draft" };
  const allowAi = profile.role === "operator" || treatment.variant === "ai_draft";

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Oferty firmy</h1>
          <p>Generuj z prywatnego briefu, edytuj i zatwierdzaj świadomie.</p>
        </div>
      </div>
      {allowAi && profile.role !== "operator" && <ExperimentExposure assignmentId={treatment.id} />}
      <JobDraftWorkspace
        jobs={(data ?? []).map((job) => ({ id: job.id, title: job.title }))}
        allowAi={allowAi}
      />
    </div>
  );
}

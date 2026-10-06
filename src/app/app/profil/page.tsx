import {
  CandidateProfileForm,
  ExperienceForm,
  WorkSampleForm,
} from "@/features/candidates/profile-forms";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  if (!getSupabaseConfig().configured) return null;
  const { client, user, profile } = await requireProfile(["candidate"]);
  const [candidateResult, experiencesResult, samplesResult] = await Promise.all([
    client.from("candidate_profiles").select("*").eq("user_id", user.id).single(),
    client
      .from("candidate_experiences")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    client
      .from("candidate_work_samples")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  if (candidateResult.error) throw new Error("Nie udało się wczytać profilu.");

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Twój profil</h1>
          <p>Źródłowe doświadczenie, z którego korzystasz podczas aplikowania.</p>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <CandidateProfileForm
          profile={{ ...candidateResult.data, display_name: profile.display_name }}
        />
        <div className="grid gap-6">
          <ExperienceForm />
          <WorkSampleForm />
        </div>
      </div>
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl uppercase">Doświadczenia</h2>
          <div className="mt-4 grid gap-3">
            {(experiencesResult.data ?? []).map((item) => (
              <article key={item.id} className="border-2 bg-card p-4">
                <h3 className="font-ui font-bold">
                  {item.title} · {item.company_name}
                </h3>
                <p className="mt-2 leading-relaxed">{item.description}</p>
                {item.measurable_outcome && (
                  <p className="mt-2 bg-secondary p-2">
                    <strong>Efekt:</strong> {item.measurable_outcome}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl uppercase">Próbki pracy</h2>
          <div className="mt-4 grid gap-3">
            {(samplesResult.data ?? []).map((item) => (
              <article key={item.id} className="border-2 bg-card p-4">
                <h3 className="font-ui font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed">{item.context}</p>
                <p className="mt-2 bg-primary p-2">
                  <strong>Wynik:</strong> {item.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

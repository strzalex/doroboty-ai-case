import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  submitted: "Wysłana",
  in_review: "W przeglądzie",
  interview: "Rozmowa",
  continued: "Proces trwa",
  rejected: "Zakończona",
  withdrawn: "Wycofana",
  hired: "Zatrudnienie",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  if (!getSupabaseConfig().configured) return null;
  const { client, user } = await requireProfile(["candidate"]);
  const { data, error } = await client
    .from("applications")
    .select(
      "id, status, variant, submitted_at, answer, job:jobs(title, slug), events:application_stage_events(stage, occurred_at)",
    )
    .eq("candidate_id", user.id)
    .order("submitted_at", { ascending: false });
  if (error) throw new Error("Nie udało się wczytać aplikacji.");

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Twoje aplikacje</h1>
          <p>Historia zgłoszeń i decyzji pracodawców.</p>
        </div>
        <Link className="text-link" href="/oferty">
          Znajdź kolejną rolę
        </Link>
      </div>
      {(await searchParams).submitted === "1" && (
        <div role="status" className="success-panel mb-6 flex items-center gap-2">
          <CheckCircle2 className="size-5" /> Aplikacja została wysłana.
        </div>
      )}
      {(data ?? []).length === 0 ? (
        <div className="empty-state">
          <h2>Nie masz jeszcze aplikacji</h2>
          <p>Znajdź rolę i pokaż doświadczenie, które naprawdę ma znaczenie.</p>
          <Link className="text-link" href="/oferty">
            Zobacz oferty
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {(data ?? []).map((application) => {
            const job = Array.isArray(application.job) ? application.job[0] : application.job;
            return (
              <article key={application.id} className="border-2 bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl uppercase">{job?.title ?? "Oferta"}</h2>
                    <p className="mt-1 font-ui text-sm">
                      {application.variant === "one_click" ? "Zapisany profil" : "Pełna odpowiedź"}
                    </p>
                  </div>
                  <span className="border-2 bg-primary px-3 py-1 font-ui text-xs font-bold uppercase">
                    {statusLabels[application.status] ?? application.status}
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 leading-relaxed">{application.answer}</p>
                <Link
                  className="mt-4 inline-block font-ui font-bold underline"
                  href={`/oferty/${job?.slug}`}
                >
                  Zobacz ofertę
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

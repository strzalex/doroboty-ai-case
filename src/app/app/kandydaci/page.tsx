import { recordEmployerStage } from "@/features/applications/actions";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

const actions = [
  ["reviewed", "Oznacz jako przejrzaną"],
  ["interview_invited", "Zaproś na rozmowę"],
  ["first_conversation_held", "Rozmowa odbyta"],
  ["continued", "Kontynuujemy"],
  ["rejected", "Kończymy proces"],
  ["hired", "Zatrudniona/y"],
] as const;

const statuses = ["submitted", "in_review", "interview", "continued", "rejected", "hired"] as const;

export default async function EmployerInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!getSupabaseConfig().configured) return null;
  const { client, profile } = await requireProfile(["employer", "operator"]);
  const requestedStatus = (await searchParams).status;
  const status = statuses.includes(requestedStatus as (typeof statuses)[number])
    ? requestedStatus
    : undefined;
  let query = client
    .from("applications")
    .select(
      "id, status, variant, answer, source_snapshot, submitted_at, job:jobs(title, slug), events:application_stage_events(stage, occurred_at, note)",
    )
    .order("submitted_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error("Nie udało się wczytać aplikacji pracodawcy.");

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Kandydaci</h1>
          <p>Aplikacje, źródłowe doświadczenie i decyzje dla Twojej organizacji.</p>
        </div>
        <span className="mode-label">
          {profile.role === "operator" ? "Widok operatora" : "Widok pracodawcy"}
        </span>
      </div>
      <form className="mb-6 flex flex-wrap items-end gap-2 border-2 bg-secondary p-4">
        <label className="font-ui text-xs font-bold uppercase">
          Status
          <select
            className="mt-1 block h-10 border-2 bg-background px-2"
            name="status"
            defaultValue={status ?? ""}
          >
            <option value="">Wszystkie</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button
          className="h-10 border-2 bg-primary px-4 font-ui text-xs font-bold uppercase"
          type="submit"
        >
          Filtruj
        </button>
      </form>
      {(data ?? []).length === 0 ? (
        <div className="empty-state">
          <h2>Brak aplikacji</h2>
          <p>Nowe zgłoszenia pojawią się tutaj po wysłaniu przez kandydatów.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {(data ?? []).map((application) => {
            const job = Array.isArray(application.job) ? application.job[0] : application.job;
            const snapshot = application.source_snapshot as {
              profile?: { displayName?: string; headline?: string };
              experiences?: { title: string; company_name: string; measurable_outcome?: string }[];
            };
            return (
              <article key={application.id} className="border-2 bg-card p-6">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-ui text-xs font-bold uppercase">{job?.title}</p>
                    <h2 className="mt-1 font-display text-3xl uppercase">
                      {snapshot.profile?.displayName || "Kandydat / kandydatka"}
                    </h2>
                    <p className="mt-1">{snapshot.profile?.headline}</p>
                  </div>
                  <span className="h-fit border-2 bg-secondary px-3 py-1 font-ui text-xs font-bold uppercase">
                    {application.status}
                  </span>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <section>
                    <h3 className="font-ui font-bold uppercase">Odpowiedź</h3>
                    <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">
                      {application.answer}
                    </p>
                  </section>
                  <section>
                    <h3 className="font-ui font-bold uppercase">Źródłowe doświadczenie</h3>
                    <ul className="mt-2 grid gap-2">
                      {(snapshot.experiences ?? []).map((experience, index) => (
                        <li
                          key={`${experience.title}-${index}`}
                          className="border-l-4 border-primary pl-3"
                        >
                          <strong>
                            {experience.title} · {experience.company_name}
                          </strong>
                          {experience.measurable_outcome && <p>{experience.measurable_outcome}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                <form
                  action={recordEmployerStage}
                  className="mt-6 flex flex-wrap items-end gap-2 border-t-2 pt-5"
                >
                  <input type="hidden" name="applicationId" value={application.id} />
                  <label className="grow">
                    <span className="font-ui text-xs font-bold uppercase">
                      Notatka (opcjonalnie)
                    </span>
                    <input
                      className="mt-1 h-9 w-full border-2 bg-background px-2"
                      name="note"
                      maxLength={2000}
                    />
                  </label>
                  {actions.map(([stage, label]) => (
                    <button
                      key={stage}
                      className="h-9 border-2 bg-primary px-3 font-ui text-xs font-bold uppercase hover:bg-secondary"
                      type="submit"
                      name="stage"
                      value={stage}
                    >
                      {label}
                    </button>
                  ))}
                </form>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

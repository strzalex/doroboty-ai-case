import Link from "next/link";
import { releaseCaseAction } from "@/features/case-data/actions";
import { requireProfile } from "@/features/auth/session";
import {
  caseReleaseKeys,
  compareCaseCohorts,
  filterCaseRelease,
  generateCaseRelease,
  summarizeCaseRelease,
  validateCaseRelease,
  type CaseReleaseKey,
  type CaseSegment,
} from "@/features/case-data/generator";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

const labels: Record<CaseReleaseKey, string> = {
  baseline: "Baseline",
  post_one_click: "Po one-click",
  discovery: "Discovery",
  post_ai: "Po interwencji AI",
  pilot: "Pilot",
  demo_day: "Demo Day",
};

type CaseParams = {
  release?: string;
  jobFamily?: string;
  seniority?: string;
  employerReadiness?: string;
  languageBackground?: string;
};

const segmentOptions = {
  jobFamily: { product: "Product", engineering: "Engineering", design: "Design" },
  seniority: { mid: "Mid", senior: "Senior", lead: "Lead" },
  employerReadiness: { low: "Niska", medium: "Średnia", high: "Wysoka" },
  languageBackground: { native_pl: "PL native", non_native_pl: "PL non-native" },
} as const;

export default async function CaseOperationsPage({
  searchParams,
}: {
  searchParams: Promise<CaseParams>;
}) {
  if (!getSupabaseConfig().configured) return null;
  const { client } = await requireProfile(["operator"]);
  const params = await searchParams;
  const release = caseReleaseKeys.includes(params.release as CaseReleaseKey)
    ? (params.release as CaseReleaseKey)
    : "baseline";
  const segment = Object.fromEntries(
    Object.entries(segmentOptions).flatMap(([key, options]) => {
      const value = params[key as keyof CaseParams];
      return value && value in options ? [[key, value]] : [];
    }),
  ) as CaseSegment;
  const allRows = generateCaseRelease(release);
  const rows = filterCaseRelease(allRows, segment);
  const summary = summarizeCaseRelease(rows);
  const cohorts = compareCaseCohorts(rows);
  const errors = validateCaseRelease(allRows);
  const { data: activeRelease } = await client.rpc("current_case_release");

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="font-ui text-xs font-bold uppercase">Narzędzia instruktora</p>
          <h1 className="mt-2">Case releases</h1>
          <p>Deterministyczny podgląd, segmentacja i bramka walidacji danych.</p>
        </div>
      </div>
      <nav aria-label="Wersja case" className="flex flex-wrap gap-2">
        {caseReleaseKeys.map((key) => (
          <Link
            key={key}
            className={`border-2 px-3 py-2 font-ui text-xs font-bold uppercase ${key === release ? "bg-primary" : "bg-card"}`}
            href={`/app/case?release=${key}`}
          >
            {labels[key]}
          </Link>
        ))}
      </nav>
      <form
        action={releaseCaseAction}
        className="mt-4 flex flex-wrap items-end gap-3 border-2 bg-secondary p-4"
      >
        <label className="font-ui text-xs font-bold uppercase">
          Aktywny etap
          <select
            name="release"
            defaultValue={activeRelease ?? "baseline"}
            className="mt-1 block h-10 border-2 bg-background px-2"
          >
            {caseReleaseKeys.map((key) => (
              <option key={key} value={key}>
                {labels[key]}
              </option>
            ))}
          </select>
        </label>
        <button
          className="h-10 border-2 bg-primary px-4 font-ui text-xs font-bold uppercase"
          type="submit"
        >
          Ustaw i ukryj późniejsze etapy
        </button>
        <p className="w-full font-ui text-xs font-bold uppercase" aria-live="polite">
          Potwierdzony aktywny etap: {labels[(activeRelease ?? "baseline") as CaseReleaseKey]}
        </p>
      </form>
      {["post_ai", "pilot", "demo_day"].includes(release) && (
        <div className="mt-6 border-2 bg-accent p-4 font-ui font-bold">
          Materiał późniejszego etapu — nie pokazuj uczestnikom przed decyzją w tygodniu 2.
        </div>
      )}
      <form className="mt-6 grid gap-3 border-2 bg-card p-4 md:grid-cols-5" action="/app/case">
        <input type="hidden" name="release" value={release} />
        <SegmentSelect
          name="jobFamily"
          label="Rodzina roli"
          value={segment.jobFamily}
          options={segmentOptions.jobFamily}
        />
        <SegmentSelect
          name="seniority"
          label="Poziom"
          value={segment.seniority}
          options={segmentOptions.seniority}
        />
        <SegmentSelect
          name="employerReadiness"
          label="Gotowość firmy"
          value={segment.employerReadiness}
          options={segmentOptions.employerReadiness}
        />
        <SegmentSelect
          name="languageBackground"
          label="Język"
          value={segment.languageBackground}
          options={segmentOptions.languageBackground}
        />
        <button className="border-2 bg-primary px-4 py-2 font-ui font-bold uppercase" type="submit">
          Zastosuj segment
        </button>
      </form>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Wyświetlenia" value={summary.viewed} />
        <Metric label="Wysłane aplikacje" value={summary.submitted} />
        <Metric label="Pierwsze rozmowy" value={summary.conversations} />
        <Metric label="Pracodawca kontynuuje" value={summary.continued} primary />
        <Metric label="Śr. fit score" value={summary.averageFitScore ?? "—"} />
        <Metric label="Śr. jakość tekstu" value={summary.averageTextQuality ?? "—"} />
        <Metric label="Sygnał źródłowy" value={summary.averageSourceSignal ?? "—"} />
        <Metric label="Sygnał finalny" value={summary.averageFinalSignal ?? "—"} />
      </section>
      <section className="mt-8 overflow-x-auto border-2 bg-card p-5">
        <h2 className="font-display text-3xl uppercase">Proxy a wynik według ekspozycji</h2>
        <p className="mt-2 max-w-3xl">
          Fit i jakość tekstu są wskaźnikami pośrednimi. Decyzja po pierwszej rozmowie jest osobnym
          wynikiem. Tabela nie przesądza o przyczynowości.
        </p>
        <table className="mt-5 w-full min-w-[760px] border-collapse text-left font-ui text-sm">
          <thead>
            <tr className="border-b-2">
              <th className="p-2">Kohorta</th>
              <th className="p-2">N</th>
              <th className="p-2">Wysłane</th>
              <th className="p-2">Rozmowa / wysłane</th>
              <th className="p-2">Kontynuacja / rozmowa</th>
              <th className="p-2">Fit</th>
              <th className="p-2">Jakość tekstu</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.label} className="border-b">
                <th className="p-2">{cohort.label}</th>
                <td className="p-2">{cohort.size}</td>
                <td className="p-2">{cohort.submissionRate}%</td>
                <td className="p-2">{cohort.conversationRate}%</td>
                <td className="p-2">
                  {cohort.continuationRate === null ? "—" : `${cohort.continuationRate}%`}
                </td>
                <td className="p-2">{cohort.averageFitScore ?? "—"}</td>
                <td className="p-2">{cohort.averageTextQuality ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className={`mt-8 border-2 p-5 ${errors.length ? "bg-accent" : "bg-secondary"}`}>
        <h2 className="font-display text-3xl uppercase">Walidacja fixture</h2>
        <p className="mt-2 font-ui">
          {errors.length
            ? errors.join(", ")
            : `OK — pełne ${allRows.length} ścieżek jest spójne; bieżący segment zawiera ${rows.length}.`}
        </p>
      </section>
      <p className="mt-6 text-sm text-muted-foreground">
        Pełny słownik: <code>docs/case/DATA_DICTIONARY.md</code>. Eksport:{" "}
        <code>npm run case:export -- {release}</code>.
      </p>
      <Link
        className="mt-6 inline-block border-2 bg-primary px-4 py-3 font-ui font-bold uppercase"
        href="/app/case/pilot"
      >
        Kalkulator pilota
      </Link>
    </div>
  );
}

function SegmentSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: Record<string, string>;
}) {
  return (
    <label className="font-ui text-xs font-bold uppercase">
      {label}
      <select
        className="mt-1 h-10 w-full border-2 bg-background px-2"
        name={name}
        defaultValue={value ?? ""}
      >
        <option value="">Wszystkie</option>
        {Object.entries(options).map(([key, option]) => (
          <option value={key} key={key}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Metric({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: string | number;
  primary?: boolean;
}) {
  return (
    <article className={`border-2 p-5 ${primary ? "bg-primary" : "bg-card"}`}>
      <p className="font-ui text-xs font-bold uppercase">{label}</p>
      <strong className="mt-3 block font-display text-5xl">{value}</strong>
    </article>
  );
}

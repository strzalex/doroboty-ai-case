import Link from "next/link";
import { requireProfile } from "@/features/auth/session";
import { calculateBusinessCase, type BusinessCaseInputs } from "@/features/case-data/business-case";
import { getSupabaseConfig } from "@/lib/env";

const defaults: BusinessCaseInputs = {
  eligibleConversations: 40,
  baselineContinuationRate: 0.43,
  pilotContinuationRate: 0.5,
  valuePerContinuation: 1200,
  generations: 180,
  costPerGeneration: 0.04,
  hostingCost: 180,
  recruiterHours: 16,
  recruiterHourlyCost: 38,
  managerHours: 8,
  managerHourlyCost: 65,
  implementationCost: 2400,
  supportCost: 304,
};

const labels: Record<keyof BusinessCaseInputs, string> = {
  eligibleConversations: "Kwalifikujące się rozmowy",
  baselineContinuationRate: "Bazowy odsetek kontynuacji (0–1)",
  pilotContinuationRate: "Pilotażowy odsetek kontynuacji (0–1)",
  valuePerContinuation: "Wartość użytecznej kontynuacji (€)",
  generations: "Liczba generacji AI",
  costPerGeneration: "Koszt generacji (€)",
  hostingCost: "Hosting i monitoring (€)",
  recruiterHours: "Godziny rekrutera",
  recruiterHourlyCost: "Koszt godziny rekrutera (€)",
  managerHours: "Godziny hiring managera",
  managerHourlyCost: "Koszt godziny hiring managera (€)",
  implementationCost: "Implementacja (€)",
  supportCost: "Szkolenie i wsparcie (€)",
};

export default async function PilotPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!getSupabaseConfig().configured) return null;
  await requireProfile(["operator"]);
  const params = await searchParams;
  const inputs = Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => {
      const parsed = Number(params[key]);
      return [key, Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback];
    }),
  ) as BusinessCaseInputs;
  const result = calculateBusinessCase(inputs);
  const money = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "EUR" });

  return (
    <div>
      <Link className="font-ui font-bold underline" href="/app/case">
        ← Analiza case
      </Link>
      <div className="page-heading">
        <div>
          <p className="font-ui text-xs font-bold uppercase">Pilot organizacyjny</p>
          <h1 className="mt-2">Business case</h1>
          <p>Wartość liczona od wyniku po rozmowie, nie od liczby aplikacji.</p>
        </div>
      </div>
      <form className="grid gap-3 border-2 bg-card p-5 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(labels).map(([key, label]) => (
          <label key={key} className="font-ui text-xs font-bold uppercase">
            {label}
            <input
              className="mt-1 h-10 w-full border-2 bg-background px-2"
              name={key}
              type="number"
              min="0"
              step={key.includes("Rate") || key === "costPerGeneration" ? "0.01" : "1"}
              defaultValue={inputs[key as keyof BusinessCaseInputs]}
            />
          </label>
        ))}
        <button className="border-2 bg-primary px-4 py-2 font-ui font-bold uppercase" type="submit">
          Przelicz
        </button>
      </form>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Result label="Dodatkowe kontynuacje" value={result.incrementalContinuations} />
        <Result label="Wartość" value={money.format(result.value)} />
        <Result label="Koszt" value={money.format(result.cost)} />
        <Result
          label="Wartość netto"
          value={money.format(result.netValue)}
          primary={result.netValue >= 0}
        />
        <Result label="Break-even" value={result.breakEvenContinuations ?? "—"} />
      </section>
      <div className="mt-8 border-2 bg-secondary p-5">
        <h2 className="font-display text-3xl uppercase">Zasady decyzji</h2>
        <p className="mt-2">
          Raportuj zakres i niepewność założeń. Ekspansja wymaga poprawy głównego wyniku oraz
          przejścia wszystkich guardrailów prywatności, jakości i czasu pracy.
        </p>
      </div>
    </div>
  );
}

function Result({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: string | number;
  primary?: boolean;
}) {
  return (
    <article className={`border-2 p-4 ${primary ? "bg-primary" : "bg-card"}`}>
      <p className="font-ui text-xs font-bold uppercase">{label}</p>
      <strong className="mt-2 block font-display text-4xl">{value}</strong>
    </article>
  );
}

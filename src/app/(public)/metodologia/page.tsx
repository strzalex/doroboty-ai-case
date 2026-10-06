import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodologia",
  description: "Jak wybieramy role publikowane na DoRoboty.ai.",
};

const criteria = [
  ["AI zmienia pracę", "Technologia wpływa na odpowiedzialność, decyzje lub rezultat stanowiska."],
  [
    "Wynik da się zobaczyć",
    "Opis roli wskazuje problem, odbiorcę i efekt, a nie samą listę narzędzi.",
  ],
  [
    "Człowiek zachowuje odpowiedzialność",
    "Automatyzacja wspiera decyzję; nie ukrywa jej autora ani konsekwencji.",
  ],
  [
    "Oferta daje konkret",
    "Pokazuje tryb pracy, poziom, formę współpracy i — kiedy to możliwe — wynagrodzenie.",
  ],
] as const;

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">Nasze kryteria</p>
      <h1 className="mt-3 font-display text-6xl uppercase sm:text-7xl">
        Nie każda praca z chatbotem jest pracą z AI.
      </h1>
      <p className="mt-7 max-w-3xl text-2xl leading-relaxed">
        DoRoboty.ai pokazuje role, w których AI jest częścią realnej odpowiedzialności i mierzalnego
        wyniku.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {criteria.map(([title, body], index) => (
          <section
            key={title}
            className="border-2 bg-card p-6 shadow-[4px_4px_0_var(--foreground)]"
          >
            <span className="font-ui text-xs font-bold">0{index + 1}</span>
            <h2 className="mt-2 font-display text-3xl uppercase">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
      <section className="mt-12 border-2 bg-secondary p-7">
        <h2 className="font-display text-4xl uppercase">Weryfikacja nie jest rekomendacją</h2>
        <p className="mt-4 text-xl leading-relaxed">
          Sprawdzamy źródło i kompletność informacji. Kandydat nadal powinien sam ocenić firmę,
          warunki i dopasowanie roli.
        </p>
      </section>
    </article>
  );
}

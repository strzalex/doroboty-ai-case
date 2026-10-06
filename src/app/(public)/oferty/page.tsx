import type { Metadata } from "next";
import Link from "next/link";
import { JobCard } from "@/features/jobs/job-card";
import { JobFiltersForm } from "@/features/jobs/job-filters";
import { hasIndexableFilters, parseJobFilters, type SearchParams } from "@/features/jobs/filters";
import { getPublishedJobs } from "@/features/jobs/queries";

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseJobFilters(await searchParams);
  return {
    title: "Oferty pracy z AI",
    description: "Role Build, Apply i Lead dla ludzi, którzy dowożą z AI.",
    robots: hasIndexableFilters(filters) ? { index: false, follow: true } : undefined,
    alternates: { canonical: "/oferty" },
  };
}

export default async function JobsPage({ searchParams }: Props) {
  const filters = parseJobFilters(await searchParams);
  const jobs = await getPublishedJobs(filters);

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">Aktualne role</p>
      <h1 className="mt-3 font-display text-6xl uppercase sm:text-7xl">Oferty pracy z AI</h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed">
        Role, w których AI zmienia sposób pracy i wynik — nie tylko opis stanowiska.
      </p>
      <div className="mt-10">
        <JobFiltersForm filters={filters} />
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 font-ui text-sm">
        <p role="status">{jobs.length === 1 ? "1 oferta" : `${jobs.length} ofert`}</p>
      </div>
      {jobs.length > 0 ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border-2 border-dashed bg-card p-10 text-center">
          <h2 className="font-display text-3xl uppercase">Brak ofert dla tych filtrów</h2>
          <p className="mt-3 text-lg">Wyczyść część kryteriów i spróbuj ponownie.</p>
          <Link className="mt-5 inline-block font-ui font-bold underline" href="/oferty">
            Pokaż wszystkie oferty
          </Link>
        </div>
      )}
    </section>
  );
}

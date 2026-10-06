import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/job-card";
import { getPublishedJobs } from "@/features/jobs/queries";
import { cn } from "@/lib/utils";

const categories = [
  {
    slug: "build",
    label: "Build",
    description: "Tworzysz modele, systemy i produkty wykorzystujące AI.",
  },
  {
    slug: "apply",
    label: "Apply",
    description: "Używasz AI, żeby lepiej wykonywać swoją właściwą pracę.",
  },
  {
    slug: "lead",
    label: "Lead",
    description: "Prowadzisz zmianę, decyzje i zespoły w świecie AI.",
  },
] as const;

export default async function HomePage() {
  const latestJobs = (await getPublishedJobs({ page: 1 })).slice(0, 4);

  return (
    <>
      <section className="border-b-2">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-24">
          <div>
            <Badge className="rounded-none border-2 border-foreground bg-primary px-3 py-1 font-ui tracking-[0.12em] text-foreground uppercase">
              Practice over theory
            </Badge>
            <h1 className="mt-7 max-w-4xl font-display text-6xl leading-[0.92] uppercase sm:text-7xl lg:text-8xl">
              Praca dla ludzi, którzy dowożą z AI.
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed sm:text-2xl">
              Wyselekcjonowane role, w których AI jest częścią odpowiedzialności, decyzji i wyniku
              pracy — nie dopiskiem w employer brandingu.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/oferty"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-none border-2 px-5 font-ui font-bold tracking-[0.08em] uppercase shadow-[4px_4px_0_var(--foreground)]",
                )}
              >
                Zobacz oferty <ArrowRight />
              </Link>
              <Link
                href="/metodologia"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-none border-2 px-5 font-ui font-bold tracking-[0.08em] uppercase",
                )}
              >
                Jak wybieramy role
              </Link>
            </div>
          </div>
          <aside className="self-end border-2 bg-secondary p-6 shadow-[8px_8px_0_var(--accent)] lg:p-8">
            <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">
              Nie szukamy operatorów narzędzi
            </p>
            <p className="mt-5 text-2xl leading-snug">
              Szukamy ról dla osób, które potrafią znaleźć wartościowe zastosowanie AI, wdrożyć je i
              połączyć z mierzalnym efektem.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">
          01 // Trzy sposoby pracy z AI
        </p>
        <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">Build. Apply. Lead.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <article key={category.slug} className="border-2 bg-card p-6">
              <span className="font-ui text-xs font-bold tracking-[0.12em] uppercase">
                0{index + 1}
              </span>
              <h3 className="mt-2 font-display text-4xl uppercase">{category.label}</h3>
              <p className="mt-4 text-lg leading-relaxed">{category.description}</p>
              <Link
                className="mt-6 inline-flex items-center gap-2 font-ui text-sm font-bold tracking-[0.08em] uppercase underline decoration-2 underline-offset-4"
                href={`/oferty?category=${category.slug}`}
              >
                Przeglądaj role <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t-2 bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">
                02 // Aktualne role
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase sm:text-6xl">Najnowsze oferty</h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 font-ui font-bold uppercase underline decoration-2 underline-offset-4"
              href="/oferty"
            >
              Wszystkie oferty <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

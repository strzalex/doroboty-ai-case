import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ClientAnalyticsEvent } from "@/features/analytics/client-event";
import { getPublishedJob } from "@/features/jobs/queries";
import {
  categoryLabels,
  contractLabels,
  formatSalary,
  jobJsonLd,
  remoteLabels,
  seniorityLabels,
} from "@/features/jobs/presentation";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJob((await params).slug);
  if (!job) notFound();
  return {
    title: `${job.title} — ${job.company.name}`,
    description: job.summary,
    alternates: { canonical: `/oferty/${job.slug}` },
  };
}

export default async function JobPage({ params }: Props) {
  const job = await getPublishedJob((await params).slug);
  if (!job) notFound();
  const jsonLd = jobJsonLd(job);

  return (
    <article>
      <ClientAnalyticsEvent
        payload={{ event: "job_viewed", properties: { jobId: job.id, category: job.category } }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="border-b-2 bg-secondary">
        <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
          <Link
            className="inline-flex items-center gap-2 font-ui text-sm font-bold uppercase underline"
            href="/oferty"
          >
            <ArrowLeft className="size-4" /> Wszystkie oferty
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            <Badge className="rounded-none border-2 border-foreground bg-primary font-ui text-foreground">
              {categoryLabels[job.category]}
            </Badge>
            {job.verificationStatus === "employer_verified" && (
              <Badge className="rounded-none border-2 border-foreground bg-card font-ui text-foreground">
                <BadgeCheck /> Zweryfikowana przez firmę
              </Badge>
            )}
          </div>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] uppercase sm:text-7xl">
            {job.title}
          </h1>
          <Link
            className="mt-4 inline-block font-ui text-xl font-bold underline decoration-2 underline-offset-4"
            href={`/firmy/${job.company.slug}`}
          >
            {job.company.name}
          </Link>
          <p className="mt-6 max-w-3xl text-2xl leading-relaxed">{job.summary}</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[1fr_300px] lg:px-8 lg:py-16">
        <div>
          <h2 className="font-display text-4xl uppercase">O roli</h2>
          <div className="mt-6 space-y-5 text-xl leading-relaxed">
            {job.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 border-2 bg-accent p-6">
            <h2 className="font-display text-3xl uppercase">Chcesz aplikować?</h2>
            <p className="mt-3 text-lg leading-relaxed">
              Zaloguj się, uzupełnij profil i pokaż doświadczenie związane z tą rolą.
            </p>
            <Link
              href={`/auth/sign-in?next=/aplikuj/${job.slug}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-5 h-12 rounded-none border-2 px-5 font-ui font-bold uppercase shadow-[4px_4px_0_var(--foreground)]",
              )}
            >
              Aplikuj w DoRoboty.ai
            </Link>
          </div>
        </div>
        <aside className="h-fit border-2 bg-card p-5 shadow-[5px_5px_0_var(--foreground)]">
          <h2 className="font-display text-2xl uppercase">Konkrety</h2>
          <dl className="mt-5 grid gap-5 font-ui text-sm">
            <div>
              <dt className="font-bold uppercase">Miejsce</dt>
              <dd className="mt-1 flex gap-2">
                <MapPin className="size-4 shrink-0" /> {job.locations.join(" / ")} ·{" "}
                {remoteLabels[job.remoteStatus]}
              </dd>
            </div>
            <div>
              <dt className="font-bold uppercase">Poziom</dt>
              <dd className="mt-1">{seniorityLabels[job.seniority]}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase">Umowa</dt>
              <dd className="mt-1 flex gap-2">
                <BriefcaseBusiness className="size-4 shrink-0" /> {contractLabels[job.contract]}
              </dd>
            </div>
            <div>
              <dt className="font-bold uppercase">Wynagrodzenie</dt>
              <dd className="mt-1">{formatSalary(job)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}

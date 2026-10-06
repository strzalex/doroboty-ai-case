import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { JobCard } from "@/features/jobs/job-card";
import { organizationJsonLd } from "@/features/jobs/presentation";
import { getCompanyWithJobs } from "@/features/jobs/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getCompanyWithJobs((await params).slug);
  if (!result) notFound();
  return { title: result.company.name, description: result.company.summary };
}

export default async function CompanyPage({ params }: Props) {
  const result = await getCompanyWithJobs((await params).slug);
  if (!result) notFound();
  const { company, jobs } = result;

  return (
    <article className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(company)).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid gap-8 border-b-2 pb-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">Firma</p>
          <h1 className="mt-3 font-display text-6xl uppercase sm:text-7xl">{company.name}</h1>
          <p className="mt-5 max-w-3xl text-2xl leading-relaxed">{company.summary}</p>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed">{company.description}</p>
        </div>
        <dl className="h-fit border-2 bg-secondary p-6 font-ui text-sm shadow-[5px_5px_0_var(--foreground)]">
          <div className="flex gap-2">
            <MapPin className="size-5" />
            <div>
              <dt className="font-bold uppercase">Lokalizacja</dt>
              <dd>{company.location}</dd>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Users className="size-5" />
            <div>
              <dt className="font-bold uppercase">Wielkość</dt>
              <dd>{company.sizeLabel}</dd>
            </div>
          </div>
          <Link
            className="mt-6 inline-flex items-center gap-2 font-bold underline"
            href={company.websiteUrl}
          >
            Strona firmy <ArrowUpRight className="size-4" />
          </Link>
        </dl>
      </div>
      <section className="py-12">
        <h2 className="font-display text-4xl uppercase">Otwarte role</h2>
        {jobs.length > 0 ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-lg">Ta firma nie ma teraz aktywnych ofert.</p>
        )}
      </section>
    </article>
  );
}

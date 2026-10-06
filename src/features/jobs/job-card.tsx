import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobWithCompany } from "@/features/jobs/types";
import {
  categoryLabels,
  contractLabels,
  formatSalary,
  remoteLabels,
} from "@/features/jobs/presentation";

export function JobCard({ job }: { job: JobWithCompany }) {
  return (
    <article className="group flex h-full flex-col border-2 bg-card p-6 shadow-[5px_5px_0_var(--foreground)] transition-transform hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-none border-2 border-foreground bg-primary font-ui text-foreground">
          {categoryLabels[job.category]}
        </Badge>
        {job.verificationStatus === "employer_verified" && (
          <span className="inline-flex items-center gap-1 font-ui text-xs font-semibold">
            <BadgeCheck className="size-4" /> Zweryfikowana
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-3xl leading-tight uppercase">{job.title}</h3>
      <Link
        className="mt-2 w-fit font-ui text-sm font-bold underline decoration-2 underline-offset-4"
        href={`/firmy/${job.company.slug}`}
      >
        {job.company.name}
      </Link>
      <p className="mt-4 text-lg leading-relaxed">{job.summary}</p>
      <dl className="mt-6 grid gap-2 font-ui text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <dt className="sr-only">Miejsce</dt>
          <dd>
            {job.locations.join(" / ")} · {remoteLabels[job.remoteStatus]}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="size-4" />
          <dt className="sr-only">Umowa i wynagrodzenie</dt>
          <dd>
            {contractLabels[job.contract]} · {formatSalary(job)}
          </dd>
        </div>
      </dl>
      <Link
        className="mt-7 inline-flex items-center gap-2 self-start font-ui font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-4"
        href={`/oferty/${job.slug}`}
      >
        Zobacz rolę <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}

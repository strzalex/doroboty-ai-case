import type { Job, JobCategory, JobWithCompany, RemoteStatus } from "@/features/jobs/types";

export const categoryLabels: Record<JobCategory, string> = {
  build: "Build",
  apply: "Apply",
  lead: "Lead",
};

export const functionLabels = {
  product: "Product",
  engineering: "Engineering",
  data: "Data",
  design: "Design",
  marketing: "Marketing",
  operations: "Operations",
} as const;

export const remoteLabels: Record<RemoteStatus, string> = {
  onsite: "Stacjonarnie",
  hybrid: "Hybrydowo",
  remote: "Zdalnie",
};

export const seniorityLabels = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
} as const;

export const contractLabels = {
  employment: "Umowa o pracę",
  b2b: "B2B",
  mandate: "Umowa zlecenie",
} as const;

const numberFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

export function formatSalary(job: Job) {
  if (!job.salaryMin && !job.salaryMax) return "Wynagrodzenie nieujawnione";
  const range = [job.salaryMin, job.salaryMax]
    .filter((value): value is number => typeof value === "number")
    .map((value) => numberFormat.format(value))
    .join("–");
  const period = job.salaryPeriod === "year" ? "rok" : "mies.";
  const kind = job.salaryKind === "net" ? "netto" : "brutto";
  return `${range} ${job.salaryCurrency ?? "PLN"} ${kind} / ${period}`;
}

export function jobJsonLd(job: JobWithCompany) {
  const employmentType = {
    employment: "FULL_TIME",
    b2b: "CONTRACTOR",
    mandate: "OTHER",
  }[job.contract];
  const baseSalary =
    job.salaryMin || job.salaryMax
      ? {
          "@type": "MonetaryAmount",
          currency: job.salaryCurrency,
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: job.salaryPeriod === "year" ? "YEAR" : "MONTH",
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt,
    validThrough: job.expiryAt,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.websiteUrl,
    },
    jobLocationType: job.remoteStatus === "remote" ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements:
      job.remoteStatus === "remote" ? { "@type": "Country", name: "Polska" } : undefined,
    jobLocation:
      job.remoteStatus !== "remote"
        ? job.locations.map((location) => ({
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "PL" },
          }))
        : undefined,
    baseSalary,
  };
}

export function organizationJsonLd(company: JobWithCompany["company"]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.websiteUrl,
    address: { "@type": "PostalAddress", addressLocality: company.location },
  };
}

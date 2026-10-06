import "server-only";
import { cache } from "react";
import { filterJobs } from "@/features/jobs/filters";
import { companies, joinJobsWithCompanies, jobs } from "@/features/jobs/fixtures";
import type {
  Company,
  ContractType,
  JobCategory,
  JobFilters,
  JobFunction,
  JobWithCompany,
  PublicationStatus,
  RemoteStatus,
  SeniorityLevel,
} from "@/features/jobs/types";
import { getSupabaseConfig } from "@/lib/env";
import { serverClient } from "@/lib/supabase/server";

type DbCompany = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  website_url: string;
  location: string;
  size_label: string;
  logo_url: string | null;
};

type DbJob = {
  id: string;
  slug: string;
  company_id: string;
  title: string;
  summary: string;
  description: string;
  category: JobCategory;
  function: JobFunction;
  remote_status: RemoteStatus;
  locations: string[];
  seniority: SeniorityLevel;
  contract_type: ContractType;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: "PLN" | "EUR" | null;
  salary_period: "month" | "year" | null;
  salary_kind: "gross" | "net" | null;
  publication_status: PublicationStatus;
  published_at: string;
  expiry_at: string;
  verification_status: "unverified" | "editorial" | "employer_verified";
  company: DbCompany | DbCompany[];
};

function mapCompany(company: DbCompany): Company {
  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    summary: company.summary,
    description: company.description,
    websiteUrl: company.website_url,
    location: company.location,
    sizeLabel: company.size_label,
    logoUrl: company.logo_url ?? undefined,
  };
}

function mapJob(row: DbJob): JobWithCompany {
  const company = Array.isArray(row.company) ? row.company[0] : row.company;
  return {
    id: row.id,
    slug: row.slug,
    companyId: row.company_id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    category: row.category,
    function: row.function,
    remoteStatus: row.remote_status,
    locations: row.locations,
    seniority: row.seniority,
    contract: row.contract_type,
    salaryMin: row.salary_min ?? undefined,
    salaryMax: row.salary_max ?? undefined,
    salaryCurrency: row.salary_currency ?? undefined,
    salaryPeriod: row.salary_period ?? undefined,
    salaryKind: row.salary_kind ?? undefined,
    publicationStatus: row.publication_status,
    publishedAt: row.published_at,
    expiryAt: row.expiry_at,
    verificationStatus: row.verification_status,
    company: mapCompany(company),
  };
}

const dbJobs = cache(async () => {
  const client = await serverClient();
  const { data, error } = await client
    .from("jobs")
    .select("*, company:companies!inner(*)")
    .eq("publication_status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Unable to load published jobs: ${error.message}`);
  return (data as unknown as DbJob[]).map(mapJob);
});

export async function getPublishedJobs(filters: JobFilters) {
  const source = getSupabaseConfig().configured ? await dbJobs() : joinJobsWithCompanies();
  return filterJobs(source, filters);
}

export async function getPublishedJob(slug: string) {
  const source = getSupabaseConfig().configured ? await dbJobs() : joinJobsWithCompanies();
  return source.find((job) => job.slug === slug && job.publicationStatus === "published") ?? null;
}

export async function getCompanyWithJobs(slug: string) {
  if (!getSupabaseConfig().configured) {
    const company = companies.find((entry) => entry.slug === slug);
    if (!company) return null;
    return {
      company,
      jobs: joinJobsWithCompanies(jobs.filter((job) => job.companyId === company.id)),
    };
  }

  const allJobs = await dbJobs();
  const job = allJobs.find((entry) => entry.company.slug === slug);
  if (!job) return null;
  return {
    company: job.company,
    jobs: allJobs.filter((entry) => entry.company.id === job.company.id),
  };
}

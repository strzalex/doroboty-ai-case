import { z } from "zod";
import {
  contractTypes,
  jobCategories,
  jobFunctions,
  remoteStatuses,
  seniorityLevels,
  type JobFilters,
  type JobWithCompany,
} from "@/features/jobs/types";

export type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.at(0) : value;
const optional = (value: string | string[] | undefined) => first(value) || undefined;

const filterSchema = z.object({
  category: z.enum(jobCategories).optional(),
  function: z.enum(jobFunctions).optional(),
  remote: z.enum(remoteStatuses).optional(),
  seniority: z.enum(seniorityLevels).optional(),
  contract: z.enum(contractTypes).optional(),
  location: z.string().trim().max(80).optional(),
  query: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).max(100).catch(1),
});

export function parseJobFilters(params: SearchParams): JobFilters {
  const result = filterSchema.safeParse({
    category: optional(params.category),
    function: optional(params.function),
    remote: optional(params.remote),
    seniority: optional(params.seniority),
    contract: optional(params.contract),
    location: optional(params.location),
    query: optional(params.query),
    page: first(params.page) ?? 1,
  });

  if (!result.success) return { page: 1 };
  return result.data;
}

export function filterJobs(items: JobWithCompany[], filters: JobFilters) {
  const query = filters.query?.toLocaleLowerCase("pl");
  const location = filters.location?.toLocaleLowerCase("pl");

  return items.filter((job) => {
    if (job.publicationStatus !== "published") return false;
    if (filters.category && job.category !== filters.category) return false;
    if (filters.function && job.function !== filters.function) return false;
    if (filters.remote && job.remoteStatus !== filters.remote) return false;
    if (filters.seniority && job.seniority !== filters.seniority) return false;
    if (filters.contract && job.contract !== filters.contract) return false;
    if (
      location &&
      !job.locations.some((item) => item.toLocaleLowerCase("pl").includes(location))
    ) {
      return false;
    }
    if (query) {
      const haystack = `${job.title} ${job.summary} ${job.company.name}`.toLocaleLowerCase("pl");
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function hasIndexableFilters(filters: JobFilters) {
  return Boolean(
    filters.category ||
    filters.function ||
    filters.remote ||
    filters.seniority ||
    filters.contract ||
    filters.location ||
    filters.query ||
    filters.page > 1,
  );
}

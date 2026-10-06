import type { MetadataRoute } from "next";
import { getPublishedJobs } from "@/features/jobs/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jobs = await getPublishedJobs({ page: 1 });
  const companies = [...new Map(jobs.map((job) => [job.company.slug, job.company])).values()];
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/oferty`, changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/metodologia`, changeFrequency: "monthly", priority: 0.5 },
    ...jobs.map((job) => ({
      url: `${origin}/oferty/${job.slug}`,
      lastModified: job.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...companies.map((company) => ({
      url: `${origin}/firmy/${company.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

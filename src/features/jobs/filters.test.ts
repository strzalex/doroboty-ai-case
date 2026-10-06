import { describe, expect, it } from "vitest";
import { filterJobs, hasIndexableFilters, parseJobFilters } from "@/features/jobs/filters";
import { joinJobsWithCompanies } from "@/features/jobs/fixtures";

describe("job filters", () => {
  it("accepts controlled filter values", () => {
    expect(
      parseJobFilters({ category: "build", remote: "remote", page: "2", query: "engineer" }),
    ).toEqual({ category: "build", remote: "remote", page: 2, query: "engineer" });
  });

  it("accepts empty values emitted by the native GET form", () => {
    expect(
      parseJobFilters({
        query: "",
        category: "lead",
        function: "",
        remote: "",
        seniority: "",
        contract: "",
      }),
    ).toMatchObject({ category: "lead", page: 1 });
  });

  it("falls back safely when controlled values are invalid", () => {
    expect(parseJobFilters({ category: "everything", page: "-1" })).toEqual({ page: 1 });
  });

  it("filters deterministic jobs by taxonomy and text", () => {
    const items = joinJobsWithCompanies();
    expect(filterJobs(items, { category: "build", page: 1 })).toHaveLength(2);
    expect(filterJobs(items, { query: "northstar", page: 1 }).map((job) => job.slug)).toEqual([
      "staff-ai-engineer",
      "growth-lead-ai-products",
    ]);
  });

  it("marks filtered combinations as non-indexable", () => {
    expect(hasIndexableFilters({ page: 1 })).toBe(false);
    expect(hasIndexableFilters({ function: "product", page: 1 })).toBe(true);
  });
});

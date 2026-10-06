import { describe, expect, it } from "vitest";
import {
  caseReleaseKeys,
  compareCaseCohorts,
  filterCaseRelease,
  generateCaseRelease,
  summarizeCaseRelease,
  validateCaseRelease,
} from "@/features/case-data/generator";

describe("case release generator", () => {
  it.each(caseReleaseKeys)("produces a valid deterministic %s release", (release) => {
    const first = generateCaseRelease(release);
    const second = generateCaseRelease(release);
    expect(first).toEqual(second);
    expect(first).toHaveLength(120);
    expect(validateCaseRelease(first)).toEqual([]);
  });

  it("raises submissions after one-click while the primary outcome stays flat", () => {
    const baseline = summarizeCaseRelease(generateCaseRelease("baseline"));
    const oneClick = summarizeCaseRelease(generateCaseRelease("post_one_click"));
    expect(baseline.submitted).toBe(36);
    expect(oneClick.submitted).toBe(72);
    expect(oneClick.continued).toBe(baseline.continued);
  });

  it("raises text proxies after AI while continuation stays flat", () => {
    const oneClick = summarizeCaseRelease(generateCaseRelease("post_one_click"));
    const postAi = summarizeCaseRelease(generateCaseRelease("post_ai"));
    expect(postAi.averageFitScore).toBeGreaterThan(oneClick.averageFitScore ?? 0);
    expect(postAi.averageTextQuality).toBeGreaterThan(oneClick.averageTextQuality ?? 0);
    expect(postAi.continued).toBe(oneClick.continued);
    expect(postAi.averageFinalSignal).toBeLessThan(postAi.averageSourceSignal ?? 1);
  });

  it("contains AI counterexamples for non-native Polish candidates", () => {
    const rows = generateCaseRelease("post_ai");
    expect(
      rows.some(
        (row) =>
          row.languageBackground === "non_native_pl" &&
          row.candidateAiExposed &&
          row.finalTextSignalScore > row.sourceSignalScore,
      ),
    ).toBe(true);
  });

  it("supports confounder segments and independent AI cohorts", () => {
    const rows = generateCaseRelease("post_ai");
    expect(filterCaseRelease(rows, { jobFamily: "product" })).toHaveLength(40);
    const cohorts = compareCaseCohorts(rows);
    expect(cohorts).toHaveLength(4);
    expect(cohorts.reduce((sum, cohort) => sum + cohort.size, 0)).toBe(rows.length);
  });
});

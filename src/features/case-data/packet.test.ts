import { describe, expect, it } from "vitest";
import { generateCaseRelease } from "@/features/case-data/generator";
import {
  futureReleaseKeys,
  participantColumns,
  participantDictionary,
  participantSummary,
} from "@/features/case-data/packet";

describe("stage-safe participant packets", () => {
  it("keeps future intervention fields out of early releases", () => {
    expect(participantColumns("baseline")).not.toContain("variant");
    expect(participantColumns("post_one_click")).toContain("variant");
    expect(participantColumns("discovery")).not.toContain("candidateAiExposed");
    expect(participantColumns("post_ai")).toContain("candidateAiExposed");
    expect(participantDictionary("baseline")).not.toMatch(
      /candidateAi|employerAi|signal score|one_click|fitScore/i,
    );
  });

  it("keeps future proxy summaries out of early releases", () => {
    const early = participantSummary("discovery", generateCaseRelease("discovery"));
    const later = participantSummary("post_ai", generateCaseRelease("post_ai"));
    expect(early).not.toHaveProperty("averageFitScore");
    expect(later).toHaveProperty("averageFitScore");
  });

  it("orders future releases from the selected stage", () => {
    expect(futureReleaseKeys("discovery")).toEqual(["post_ai", "pilot", "demo_day"]);
  });
});

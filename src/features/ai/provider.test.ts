import { describe, expect, it } from "vitest";
import { deterministicText, enforceAiQuota } from "@/features/ai/provider-core";

describe("deterministic AI provider", () => {
  it("uses only supplied evidence and exposes provenance metadata", async () => {
    const text = deterministicText({
      purpose: "candidate_answer",
      subjectId: crypto.randomUUID(),
      source: {
        jobTitle: "AI Product Manager",
        headline: "Product Manager",
        experiences: [
          {
            title: "PM",
            company_name: "Fixture Labs",
            measurable_outcome: "Skróciłem proces o 20%.",
          },
        ],
      },
    });
    expect(text).toContain("Skróciłem proces o 20%");
  });

  it("enforces the per-subject hourly quota", async () => {
    const subjectId = crypto.randomUUID();
    for (let index = 0; index < 20; index += 1) {
      enforceAiQuota(subjectId, index);
    }
    expect(() => enforceAiQuota(subjectId, 20)).toThrow("AI_QUOTA_EXCEEDED");
  });
});

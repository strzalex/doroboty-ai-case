import { describe, expect, it } from "vitest";
import { calculateTextFit } from "@/features/ai/text-fit";

describe("text fit proxy", () => {
  it("is deterministic and bounded", () => {
    const result = calculateTextFit(
      "Prowadzenie discovery, eksperymentów i wdrożenia produktu AI",
      "Prowadziłam discovery produktu AI i wdrożenie z zespołem finansowym",
    );
    expect(result.version).toBe("token-jaccard-v1");
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("does not treat an empty answer as a match", () => {
    expect(calculateTextFit("AI product manager", "").score).toBe(0);
  });
});

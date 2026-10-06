import { describe, expect, it } from "vitest";
import { jobDraftApprovalSchema, jobDraftSchema } from "@/features/ai/schema";

const validApproval = {
  jobId: "20000000-0000-4000-8000-000000000001",
  generationId: "50000000-0000-4000-8000-000000000001",
  title: "AI Product Manager",
  summary: "Prowadź produkt AI od problemu do mierzalnego wdrożenia.",
  description:
    "Zweryfikuj problem z użytkownikami, podejmij decyzję produktową i zmierz efekt wdrożenia.",
};

describe("AI action schemas", () => {
  it("accepts controlled draft and approval identifiers", () => {
    expect(jobDraftSchema.safeParse({ jobId: validApproval.jobId }).success).toBe(true);
    expect(jobDraftApprovalSchema.safeParse(validApproval).success).toBe(true);
  });

  it("rejects malformed IDs, short output, and oversized model output", () => {
    expect(jobDraftSchema.safeParse({ jobId: "not-a-uuid" }).success).toBe(false);
    expect(
      jobDraftApprovalSchema.safeParse({ ...validApproval, description: "Za krótko" }).success,
    ).toBe(false);
    expect(
      jobDraftApprovalSchema.safeParse({ ...validApproval, description: "x".repeat(30001) })
        .success,
    ).toBe(false);
  });
});

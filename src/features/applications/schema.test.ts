import { describe, expect, it } from "vitest";
import { applicationSchema, employerStageSchema } from "@/features/applications/schema";

describe("application schemas", () => {
  it("requires deliberate confirmation and a meaningful answer", () => {
    expect(
      applicationSchema.safeParse({
        jobId: "20000000-0000-4000-8000-000000000001",
        variant: "long_form",
        answer: "Za krótko",
        confirmed: "yes",
      }).success,
    ).toBe(false);
    expect(
      applicationSchema.safeParse({
        jobId: "20000000-0000-4000-8000-000000000001",
        variant: "one_click",
        answer:
          "Prowadziłam wdrożenie od discovery do produkcji i zmniejszyłam czas procesu o 30 procent.",
        confirmed: "yes",
      }).success,
    ).toBe(true);
  });

  it("accepts only controlled employer stages", () => {
    expect(
      employerStageSchema.safeParse({
        applicationId: "50000000-0000-4000-8000-000000000001",
        stage: "continued",
        note: "Kandydat przechodzi dalej.",
      }).success,
    ).toBe(true);
    expect(
      employerStageSchema.safeParse({
        applicationId: "50000000-0000-4000-8000-000000000001",
        stage: "submitted",
      }).success,
    ).toBe(false);
  });
});

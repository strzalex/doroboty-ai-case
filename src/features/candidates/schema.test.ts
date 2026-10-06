import { describe, expect, it } from "vitest";
import { candidateProfileSchema, workSampleSchema } from "@/features/candidates/schema";

describe("candidate evidence schemas", () => {
  it("accepts a complete candidate profile", () => {
    expect(
      candidateProfileSchema.safeParse({
        displayName: "Anna Kowalska",
        headline: "Senior Product Manager",
        bio: "Prowadzę produkty B2B od discovery do mierzalnego wdrożenia.",
        city: "Warszawa",
        experienceYears: "8",
      }).success,
    ).toBe(true);
  });

  it("rejects unsafe work sample links", () => {
    expect(
      workSampleSchema.safeParse({
        title: "Automatyzacja onboardingu",
        url: "http://example.com",
        context: "Zespół tracił kilka godzin tygodniowo na ręczną pracę.",
        outcome: "Czas spadł o 35 procent.",
      }).success,
    ).toBe(false);
  });
});

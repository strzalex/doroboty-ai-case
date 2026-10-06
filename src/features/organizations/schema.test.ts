import { describe, expect, it } from "vitest";
import { organizationSchema } from "@/features/organizations/schema";

const valid = {
  name: "Fixture Labs",
  slug: "fixture-labs",
  summary: "Syntetyczna firma do bezpiecznego testu.",
  description: "Opis organizacji wystarczająco długi do walidacji formularza.",
  website: "https://example.com/fixture",
  location: "Warszawa",
  size: "11–50 osób",
};

describe("organization schema", () => {
  it("accepts a complete HTTPS organization profile", () => {
    expect(organizationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects unsafe URLs, invalid slugs, and oversized fields", () => {
    expect(organizationSchema.safeParse({ ...valid, website: "http://example.com" }).success).toBe(
      false,
    );
    expect(organizationSchema.safeParse({ ...valid, slug: "Fixture Labs" }).success).toBe(false);
    expect(organizationSchema.safeParse({ ...valid, summary: "x".repeat(241) }).success).toBe(
      false,
    );
  });
});

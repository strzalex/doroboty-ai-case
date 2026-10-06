import { describe, expect, it } from "vitest";
import { calculateBusinessCase } from "@/features/case-data/business-case";

describe("business case", () => {
  it("uses downstream continuation and transparent costs", () => {
    expect(
      calculateBusinessCase({
        eligibleConversations: 100,
        baselineContinuationRate: 0.4,
        pilotContinuationRate: 0.5,
        valuePerContinuation: 1000,
        generations: 100,
        costPerGeneration: 0.04,
        hostingCost: 180,
        recruiterHours: 10,
        recruiterHourlyCost: 38,
        managerHours: 5,
        managerHourlyCost: 65,
        implementationCost: 1000,
        supportCost: 200,
      }),
    ).toEqual({
      incrementalContinuations: 10,
      value: 10000,
      cost: 2089,
      netValue: 7911,
      breakEvenContinuations: 2.09,
    });
  });
});

export type BusinessCaseInputs = {
  eligibleConversations: number;
  baselineContinuationRate: number;
  pilotContinuationRate: number;
  valuePerContinuation: number;
  generations: number;
  costPerGeneration: number;
  hostingCost: number;
  recruiterHours: number;
  recruiterHourlyCost: number;
  managerHours: number;
  managerHourlyCost: number;
  implementationCost: number;
  supportCost: number;
};

export function calculateBusinessCase(input: BusinessCaseInputs) {
  const incrementalContinuations =
    input.eligibleConversations * (input.pilotContinuationRate - input.baselineContinuationRate);
  const value = incrementalContinuations * input.valuePerContinuation;
  const cost =
    input.generations * input.costPerGeneration +
    input.hostingCost +
    input.recruiterHours * input.recruiterHourlyCost +
    input.managerHours * input.managerHourlyCost +
    input.implementationCost +
    input.supportCost;
  return {
    incrementalContinuations: Math.round(incrementalContinuations * 100) / 100,
    value: Math.round(value * 100) / 100,
    cost: Math.round(cost * 100) / 100,
    netValue: Math.round((value - cost) * 100) / 100,
    breakEvenContinuations:
      input.valuePerContinuation > 0
        ? Math.round((cost / input.valuePerContinuation) * 100) / 100
        : null,
  };
}

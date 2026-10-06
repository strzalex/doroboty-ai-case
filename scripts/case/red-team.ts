import { readFile } from "node:fs/promises";
import {
  generateCaseRelease,
  summarizeCaseRelease,
  validateCaseRelease,
} from "../../src/features/case-data/generator.ts";

const failures: string[] = [];
const assert = (condition: boolean, message: string) => {
  if (!condition) failures.push(message);
};

const baseline = generateCaseRelease("baseline");
const oneClick = generateCaseRelease("post_one_click");
const discovery = generateCaseRelease("discovery");
const postAi = generateCaseRelease("post_ai");
const baselineMetrics = summarizeCaseRelease(baseline);
const oneClickMetrics = summarizeCaseRelease(oneClick);
const postAiMetrics = summarizeCaseRelease(postAi);

assert(validateCaseRelease(baseline).length === 0, "baseline stage chain is invalid");
assert(validateCaseRelease(oneClick).length === 0, "one-click stage chain is invalid");
assert(validateCaseRelease(postAi).length === 0, "post-AI stage chain is invalid");
assert(
  oneClickMetrics.submitted > baselineMetrics.submitted,
  "one-click does not increase submissions",
);
assert(
  oneClickMetrics.continued === baselineMetrics.continued,
  "one-click incorrectly improves the primary outcome",
);
assert(
  postAiMetrics.averageFitScore! > oneClickMetrics.averageFitScore!,
  "post-AI fit proxy does not rise",
);
assert(
  postAiMetrics.averageTextQuality! > oneClickMetrics.averageTextQuality!,
  "post-AI text quality does not rise",
);
assert(
  postAiMetrics.continued === oneClickMetrics.continued,
  "post-AI incorrectly improves the primary outcome",
);
assert(
  [...baseline, ...oneClick, ...discovery].every(
    (row) =>
      !row.candidateAiAssigned &&
      !row.candidateAiExposed &&
      !row.employerAiAssigned &&
      !row.employerAiExposed,
  ),
  "AI treatment leaked into an early release",
);
assert(
  postAi.some(
    (row) =>
      row.languageBackground === "non_native_pl" &&
      row.candidateAiExposed &&
      row.finalTextSignalScore > row.sourceSignalScore,
  ),
  "the dataset has no positive AI counterexample",
);
assert(
  new Set(postAi.map((row) => `${row.jobFamily}:${row.seniority}:${row.employerReadiness}`)).size >=
    3,
  "the dataset lacks confounder segments",
);

const packet = await readFile(
  new URL("../../docs/case/DISCOVERY_PACKET.md", import.meta.url),
  "utf8",
);
const hypotheses = packet.match(/^-/gm)?.length ?? 0;
assert(hypotheses >= 5, "discovery packet contains fewer than five plausible diagnoses");
assert(!/signal loss|utrata sygnału/i.test(packet), "discovery packet names the later mechanism");
assert(
  !/AI writing is harmful|AI jest szkodliwe/i.test(packet),
  "discovery packet prescribes an anti-AI conclusion",
);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  process.exit(1);
}
console.log(
  "Case red-team gate passed: stage order, outcome pattern, anti-spoiler rules, confounders, and counterexamples verified.",
);

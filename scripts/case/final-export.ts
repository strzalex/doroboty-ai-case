import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  compareCaseCohorts,
  generateCaseRelease,
  summarizeCaseRelease,
} from "../../src/features/case-data/generator.ts";

const output = join(process.cwd(), "artifacts", "demo-day");
await mkdir(output, { recursive: true });
const rows = generateCaseRelease("demo_day");
const payload = {
  generatedAt: new Date().toISOString(),
  release: "demo_day",
  metricWarning: "Text fit and text quality are proxy metrics, not hiring decisions.",
  aggregate: summarizeCaseRelease(rows),
  cohorts: compareCaseCohorts(rows),
  limitations: [
    "Synthetic deterministic sample",
    "Before/after comparisons do not establish causality",
    "Employer readiness, role family, seniority, and language background may confound results",
  ],
};
await writeFile(join(output, "result.json"), `${JSON.stringify(payload, null, 2)}\n`);
await writeFile(
  join(output, "pitch-notes.md"),
  "# Demo Day evidence export\n\nUse `result.json` to build the evidence slide. Add your own decision, limitations, and next test; this export intentionally does not write the conclusion.\n",
);
console.log(`Conclusion-free Demo Day export written to ${output}`);

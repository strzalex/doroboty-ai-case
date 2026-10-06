import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  caseReleaseKeys,
  generateCaseRelease,
  type CaseReleaseKey,
} from "../../src/features/case-data/generator.ts";

const requested = process.argv[2] as CaseReleaseKey | undefined;
if (!requested || !caseReleaseKeys.includes(requested)) {
  throw new Error(`Usage: npm run case:export -- ${caseReleaseKeys.join("|")}`);
}
const rows = generateCaseRelease(requested);
const fields = Object.keys(rows[0]) as (keyof (typeof rows)[number])[];
const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  fields.join(","),
  ...rows.map((row) => fields.map((field) => escape(row[field])).join(",")),
].join("\n");
const destination = resolve(process.cwd(), `case-${requested}.csv`);
await writeFile(destination, csv);
console.log(destination);

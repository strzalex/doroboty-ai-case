import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);
const secretPatterns = [
  /sb_secret_[A-Za-z0-9_-]{20,}/,
  /sk-[A-Za-z0-9]{32,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const findings = [];
for (const file of files) {
  if (file === "package-lock.json") continue;
  const content = await readFile(file, "utf8").catch(() => "");
  if (secretPatterns.some((pattern) => pattern.test(content))) findings.push(file);
}
const trackedEnvironment = files.filter(
  (file) => /^\.env(?:\.|$)/.test(file) && file !== ".env.example",
);
if (trackedEnvironment.length) findings.push(...trackedEnvironment);

async function sourceMaps(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const matches = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) matches.push(...(await sourceMaps(path)));
    else if (entry.name.endsWith(".map")) matches.push(path);
  }
  return matches;
}
const browserMaps = await sourceMaps(join(process.cwd(), ".next", "static"));
if (findings.length || browserMaps.length) {
  throw new Error(
    `Security gate failed. Secret-like files: ${findings.join(", ") || "none"}; browser source maps: ${browserMaps.join(", ") || "none"}`,
  );
}
console.log(
  "Security gate passed: no tracked credentials, private keys, environment files, or browser source maps.",
);

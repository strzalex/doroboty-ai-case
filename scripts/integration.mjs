import { execFileSync, spawnSync } from "node:child_process";
// Only the local project's public key is passed to Next. Never load production credentials.
const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }),
);
const url = status.API_URL;
if (!url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname))
  throw new Error("Integration tests require local Supabase.");
const key = status.ANON_KEY ?? status.PUBLISHABLE_KEY;
if (!key) throw new Error("Local Supabase did not return a public key.");
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  LOCAL_MAIL_URL: status.INBUCKET_URL ?? status.MAILPIT_URL ?? "http://127.0.0.1:54324",
};
for (const args of [
  ["run", "build"],
  ["exec", "playwright", "test", "--", "--config=playwright.integration.config.ts"],
]) {
  const result = spawnSync("npm", args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

import { spawnSync } from "node:child_process";
// Blank public env values deliberately override any local/cloud configuration.
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
};
for (const args of [
  ["run", "build"],
  ["exec", "playwright", "test"],
]) {
  const result = spawnSync("npm", args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

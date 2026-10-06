import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "-o", "json"], { encoding: "utf8" }),
);
const url = status.API_URL as string | undefined;
const serviceKey = (status.SERVICE_ROLE_KEY ?? status.SECRET_KEY) as string | undefined;
if (!url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname) || !serviceKey) {
  throw new Error("Test accounts may be created only in the local Supabase stack.");
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const password = "DoRoboty-local-only-2026!";
const fixtures = [
  { email: "candidate@doroboty.local", role: "candidate" },
  { email: "candidate-longform@doroboty.local", role: "candidate" },
  { email: "employer@doroboty.local", role: "employer" },
  { email: "employer-other@doroboty.local", role: "employer" },
  { email: "operator@doroboty.local", role: "operator" },
] as const;

const listed = await admin.auth.admin.listUsers({ perPage: 1000 });
if (listed.error) throw listed.error;
const users = new Map<string, string>();
for (const fixture of fixtures) {
  let user = listed.data.users.find((candidate) => candidate.email === fixture.email);
  if (!user) {
    const created = await admin.auth.admin.createUser({
      email: fixture.email,
      password,
      email_confirm: true,
      user_metadata: { display_name: fixture.role },
    });
    if (created.error) throw created.error;
    user = created.data.user;
  }
  const profile = await admin
    .from("profiles")
    .update({ role: fixture.role, display_name: fixture.role })
    .eq("id", user.id);
  if (profile.error) throw profile.error;
  users.set(fixture.email, user.id);
  if (fixture.role === "employer") {
    const membership = await admin.from("organization_memberships").upsert({
      organization_id:
        fixture.email === "employer-other@doroboty.local"
          ? "40000000-0000-4000-8000-000000000002"
          : "40000000-0000-4000-8000-000000000001",
      user_id: user.id,
      role: "recruiter",
    });
    if (membership.error) throw membership.error;
  }
}

for (const [email, variant] of [
  ["candidate@doroboty.local", "one_click"],
  ["candidate-longform@doroboty.local", "long_form"],
] as const) {
  const assignment = await admin.from("experiment_assignments").upsert(
    {
      subject_key: users.get(email)!,
      surface: "application_flow",
      variant,
      release_key: "discovery",
    },
    { onConflict: "subject_key,surface,release_key" },
  );
  if (assignment.error) throw assignment.error;
}

console.log(`Local accounts ready. Password for all test fixtures: ${password}`);

import { createClient } from "@supabase/supabase-js";

const projectRef = process.env.REHEARSAL_PROJECT_REF ?? "";
const url = process.env.REHEARSAL_SUPABASE_URL ?? "";
const secretKey = process.env.REHEARSAL_SUPABASE_SECRET_KEY ?? "";
const password = process.env.REHEARSAL_ACCOUNT_PASSWORD ?? "";
const confirmation = process.env.CONFIRM_REMOTE_REHEARSAL;

if (confirmation !== "CREATE_SYNTHETIC_USERS_ONLY") {
  throw new Error("Set CONFIRM_REMOTE_REHEARSAL=CREATE_SYNTHETIC_USERS_ONLY explicitly.");
}
if (!/^[a-z]{20}$/.test(projectRef)) throw new Error("Invalid rehearsal project reference.");
if (new URL(url).hostname !== `${projectRef}.supabase.co`) {
  throw new Error("Rehearsal URL does not match the explicitly selected project.");
}
const legacyPayload = (() => {
  try {
    return JSON.parse(Buffer.from(secretKey.split(".")[1] ?? "", "base64url").toString("utf8")) as {
      role?: string;
    };
  } catch {
    return {};
  }
})();
if (!secretKey.startsWith("sb_secret_") && legacyPayload.role !== "service_role") {
  throw new Error("A Supabase secret or verified legacy service_role key is required.");
}
if (password.length < 16)
  throw new Error("Rehearsal password must contain at least 16 characters.");

const admin = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const fixtures = [
  { email: "candidate.rehearsal@doroboty.invalid", role: "candidate" },
  { email: "candidate-longform.rehearsal@doroboty.invalid", role: "candidate" },
  { email: "employer.rehearsal@doroboty.invalid", role: "employer" },
  { email: "employer-other.rehearsal@doroboty.invalid", role: "employer" },
  { email: "employer-new.rehearsal@doroboty.invalid", role: "employer" },
  { email: "operator.rehearsal@doroboty.invalid", role: "operator" },
] as const;

const listed = await admin.auth.admin.listUsers({ perPage: 1000 });
if (listed.error) throw listed.error;
const users = new Map<string, string>();
let createdCount = 0;

for (const fixture of fixtures) {
  let user = listed.data.users.find((candidate) => candidate.email === fixture.email);
  if (!user) {
    const created = await admin.auth.admin.createUser({
      email: fixture.email,
      password,
      email_confirm: true,
      user_metadata: { display_name: `${fixture.role} rehearsal` },
    });
    if (created.error) throw created.error;
    user = created.data.user;
    createdCount += 1;
  }
  const profile = await admin
    .from("profiles")
    .update({ role: fixture.role, display_name: `${fixture.role} rehearsal` })
    .eq("id", user.id);
  if (profile.error) throw profile.error;
  users.set(fixture.email, user.id);

  if (fixture.role === "employer" && fixture.email !== "employer-new.rehearsal@doroboty.invalid") {
    const membership = await admin.from("organization_memberships").upsert({
      organization_id:
        fixture.email === "employer-other.rehearsal@doroboty.invalid"
          ? "40000000-0000-4000-8000-000000000002"
          : "40000000-0000-4000-8000-000000000001",
      user_id: user.id,
      role: "recruiter",
    });
    if (membership.error) throw membership.error;
  }
}

for (const [email, variant] of [
  ["candidate.rehearsal@doroboty.invalid", "one_click"],
  ["candidate-longform.rehearsal@doroboty.invalid", "long_form"],
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

for (const releaseKey of ["post_ai", "pilot", "demo_day"] as const) {
  for (const [email, surface] of [
    ["candidate.rehearsal@doroboty.invalid", "candidate_answer"],
    ["employer.rehearsal@doroboty.invalid", "employer_job_copy"],
  ] as const) {
    const assignment = await admin.from("experiment_assignments").upsert(
      {
        subject_key: users.get(email)!,
        surface,
        variant: "ai_draft",
        release_key: releaseKey,
      },
      { onConflict: "subject_key,surface,release_key" },
    );
    if (assignment.error) throw assignment.error;
  }
}

console.log(
  `Remote rehearsal accounts ready in ${projectRef}: ${createdCount} created, ${fixtures.length - createdCount} reused. No credential was printed.`,
);

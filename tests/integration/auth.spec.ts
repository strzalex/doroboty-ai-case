import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
const api = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const mail = process.env.LOCAL_MAIL_URL ?? "http://127.0.0.1:54324";
const password = "Local-test-password-483!";
const localCasePassword = "DoRoboty-local-only-2026!";
test.beforeAll(() => {
  for (const url of [api, mail])
    if (!url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname))
      throw new Error("Tests must use isolated local Supabase and mail.");
});
async function emailLink(address: string, type: "signup" | "recovery") {
  let link = "";
  await expect
    .poll(
      async () => {
        const response = await fetch(`${mail}/api/v1/messages`);
        const data = await response.json();
        for (const message of data.messages ?? []) {
          if (!message.To?.some((to: { Address: string }) => to.Address === address)) continue;
          const detail = await (await fetch(`${mail}/api/v1/message/${message.ID}`)).json();
          const links = (detail.HTML as string).match(/href="([^"]+)"/g) ?? [];
          const match = links
            .map((value) => value.slice(6, -1).replaceAll("&amp;", "&"))
            .find((value) => value.includes(`type=${type}`));
          if (match) {
            link = match;
            return true;
          }
        }
        return false;
      },
      { timeout: 20000, intervals: [250, 500, 1000] },
    )
    .toBe(true);
  return link;
}
async function confirmedAccount(prefix = "account") {
  const client = createClient(api, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const email = `${prefix}-${crypto.randomUUID()}@example.test`;
  expect(
    (
      await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "http://127.0.0.1:3107/auth/callback?next=/app" },
      })
    ).error,
  ).toBeNull();
  const url = new URL(await emailLink(email, "signup"));
  const confirmation = await client.auth.verifyOtp({
    token_hash: url.searchParams.get("token_hash")!,
    type: "signup",
  });
  expect(confirmation.error).toBeNull();
  return { client, id: confirmation.data.user!.id };
}
test("sign-up, email confirmation, dashboard, sign-in, and password recovery", async ({ page }) => {
  const email = `browser-${crypto.randomUUID()}@example.test`;
  await page.goto("/app");
  await expect(page).toHaveURL(/auth\/sign-in/);
  await page.getByRole("link", { name: "Załóż konto", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Załóż konto", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Sprawdź skrzynkę");
  await page.getByRole("link", { name: "Przejdź do logowania" }).click();
  await expect(page.getByRole("button", { name: "Zaloguj się", exact: true })).toBeVisible();
  await page.goto(await emailLink(email, "signup"));
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: /Cześć/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Cześć/ })).toBeVisible();
  await page.getByRole("button", { name: "Wyloguj się", exact: true }).click();
  await expect(page).toHaveURL(/sign-in/);
  await page.goto("/app");
  await expect(page).toHaveURL(/sign-in/);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.getByRole("button", { name: "Wyloguj się", exact: true }).click();
  await expect(page).toHaveURL(/sign-in/);
  await page.getByRole("link", { name: "Nie pamiętam hasła" }).click();
  await expect(page.getByRole("heading", { name: "Odzyskaj dostęp." })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Wyślij link" }).click();
  await expect(page.getByRole("status")).toContainText("Jeśli konto istnieje");
  await page.goto(await emailLink(email, "recovery"));
  await expect(page).toHaveURL(/update-password/);
  await page.getByLabel("Hasło", { exact: true }).fill(`${password}new`);
  await page.getByRole("button", { name: "Zapisz hasło" }).click();
  await expect(page).toHaveURL(/\/app$/);
  const verifier = createClient(api, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  expect((await verifier.auth.signInWithPassword({ email, password })).error).not.toBeNull();
  expect(
    (await verifier.auth.signInWithPassword({ email, password: `${password}new` })).error,
  ).toBeNull();
});
test("sessions for two accounts remain independent", async () => {
  const a = await confirmedAccount("session");
  const b = await confirmedAccount("session");
  expect(a.id).not.toBe(b.id);
  expect((await a.client.auth.getUser()).data.user?.id).toBe(a.id);
  expect((await b.client.auth.getUser()).data.user?.id).toBe(b.id);
  expect((await a.client.auth.signOut()).error).toBeNull();
  expect((await a.client.auth.getUser()).data.user).toBeNull();
  expect((await b.client.auth.getUser()).data.user?.id).toBe(b.id);
});

test("RLS isolates candidate evidence and prevents role escalation", async () => {
  const a = await confirmedAccount("rls");
  const b = await confirmedAccount("rls");
  const own = await a.client.from("candidate_profiles").select("user_id").eq("user_id", a.id);
  expect(own.error).toBeNull();
  expect(own.data).toHaveLength(1);
  const foreign = await a.client.from("candidate_profiles").select("user_id").eq("user_id", b.id);
  expect(foreign.error).toBeNull();
  expect(foreign.data).toHaveLength(0);
  await a.client.from("profiles").update({ role: "operator" }).eq("id", a.id);
  const roleAfterAttempt = await a.client.from("profiles").select("role").eq("id", a.id).single();
  expect(roleAfterAttempt.error).toBeNull();
  expect(roleAfterAttempt.data?.role).toBe("candidate");
});

test("application submission is atomic, idempotent, and private", async () => {
  const candidate = await confirmedAccount("application");
  const other = await confirmedAccount("application");
  const jobId = "20000000-0000-4000-8000-000000000001";
  const input = {
    target_job_id: jobId,
    target_variant: "long_form",
    final_answer:
      "Prowadziłem discovery procesu finansowego i dowiozłem mierzalne wdrożenie z zespołem operacyjnym.",
    target_generation_id: null,
    source_snapshot: { fixture: true },
    source_evidence_ids: [],
    fit_version: "text-v1",
    fit_components: { overlap: 0.5 },
    fit_score: 0.5,
  };
  const first = await candidate.client.rpc("submit_application_with_evidence", input);
  expect(first.error).toBeNull();
  const duplicate = await candidate.client.rpc("submit_application_with_evidence", input);
  expect(duplicate.error?.code).toBe("23505");
  const own = await candidate.client.from("applications").select("id").eq("id", first.data);
  expect(own.data).toHaveLength(1);
  const foreign = await other.client.from("applications").select("id").eq("id", first.data);
  expect(foreign.data).toHaveLength(0);
  const versions = await candidate.client
    .from("application_answer_versions")
    .select("id")
    .eq("application_id", first.data);
  const scores = await candidate.client
    .from("fit_scores")
    .select("id")
    .eq("application_id", first.data);
  expect(versions.data).toHaveLength(1);
  expect(scores.data).toHaveLength(1);
});

test("anonymous users cannot read employer briefs", async () => {
  const anonymous = createClient(api, key, { auth: { persistSession: false } });
  const briefs = await anonymous.from("employer_briefs").select("id");
  expect(briefs.data ?? []).toHaveLength(0);
});

test("experiment assignment is stable and exposure is idempotent", async () => {
  const account = await confirmedAccount("experiment");
  const first = await account.client.rpc("assign_experiment", {
    target_surface: "application_flow",
  });
  const second = await account.client.rpc("assign_experiment", {
    target_surface: "application_flow",
  });
  expect(first.error).toBeNull();
  expect(second.error).toBeNull();
  expect(second.data.id).toBe(first.data.id);
  expect(second.data.variant).toBe(first.data.variant);
  const exposureA = await account.client.rpc("record_experiment_exposure", {
    target_assignment_id: first.data.id,
    target_application_id: null,
  });
  const exposureB = await account.client.rpc("record_experiment_exposure", {
    target_assignment_id: first.data.id,
    target_application_id: null,
  });
  expect(exposureA.error).toBeNull();
  expect(exposureB.data).toBe(exposureA.data);
});
test("invalid confirmation links do not redirect outside the application", async ({ page }) => {
  await page.goto("/auth/callback?token_hash=invalid&type=signup&next=https://example.com");
  await expect(page).toHaveURL(/127.0.0.1:3107\/auth\/sign-in\?error=link/);
  await expect(page.locator("main").getByRole("alert")).toContainText("wygasł");
});

test("candidate application and employer first-conversation decision work end to end", async ({
  page,
}) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("candidate@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);

  await page.goto("/app/profil");
  await page.getByLabel("Imię lub nazwa zawodowa").fill("Kandydat testowy");
  await page.getByLabel("Nagłówek").fill("AI Product Manager");
  await page
    .getByLabel("O Tobie")
    .fill("Prowadzę discovery i wdrożenia produktów AI w procesach operacyjnych.");
  await page.getByLabel("Miasto").fill("Warszawa");
  await page.getByLabel("Lata doświadczenia").fill("6");
  await page.getByRole("button", { name: "Zapisz profil" }).click();
  await expect(page.getByRole("status")).toContainText("zapisany");

  await page.getByLabel("Rola", { exact: true }).fill("Product Manager");
  await page.getByLabel("Firma lub projekt").fill("Fixture Labs");
  await page
    .getByLabel("Co zrobiłeś / zrobiłaś")
    .fill("Zmapowałem proces finansowy, przetestowałem prototyp i poprowadziłem wdrożenie.");
  await page.getByLabel("Mierzalny efekt (opcjonalnie)").fill("Czas obsługi spadł o 20 procent.");
  await page.getByRole("button", { name: "Dodaj doświadczenie" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Doświadczenie dodane." })).toBeVisible();

  await page.goto("/aplikuj/ai-product-manager");
  const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  if ((await answer.inputValue()).length < 40) {
    await answer.fill(
      "Prowadziłem discovery procesu finansowego i dowiozłem mierzalne wdrożenie z zespołem operacyjnym.",
    );
  }
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij aplikację" }).click();
  await expect(page).toHaveURL(/\/app\/aplikacje\?submitted=1/);
  await expect(page.getByRole("status")).toContainText("została wysłana");

  await page.getByRole("button", { name: "Wyloguj się", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("employer@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await page.goto("/app/kandydaci");
  await expect(page.getByRole("heading", { name: "Kandydat testowy" })).toBeVisible();
  await page.getByRole("button", { name: "Oznacz jako przejrzaną" }).click();
  await expect(page.getByText("in_review", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Zaproś na rozmowę" }).click();
  await page.getByRole("button", { name: "Rozmowa odbyta" }).click();
  await page.getByRole("button", { name: "Kontynuujemy" }).click();
  await expect(page.getByText("continued", { exact: true })).toBeVisible();
});

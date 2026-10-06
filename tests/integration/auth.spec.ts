import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import AxeBuilder from "@axe-core/playwright";
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

async function fixtureClient(email: string) {
  const client = createClient(api, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const result = await client.auth.signInWithPassword({ email, password: localCasePassword });
  expect(result.error).toBeNull();
  return client;
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

test("candidate, organization, operator, anonymous, and signed-out boundaries hold", async () => {
  const candidate = await confirmedAccount("boundaries");
  const employer = await fixtureClient("employer@doroboty.local");
  const otherEmployer = await fixtureClient("employer-other@doroboty.local");
  const operator = await fixtureClient("operator@doroboty.local");
  const anonymous = createClient(api, key, { auth: { persistSession: false } });
  const input = {
    target_job_id: "20000000-0000-4000-8000-000000000001",
    target_variant: "long_form",
    final_answer:
      "Zbadałem proces operacyjny, sprawdziłem hipotezę z użytkownikami i zmierzyłem efekt wdrożenia.",
    target_generation_id: null,
    source_snapshot: { fixture: "role-boundaries" },
    source_evidence_ids: [],
    fit_version: "text-v1",
    fit_components: { overlap: 0.4 },
    fit_score: 0.4,
  };
  const submitted = await candidate.client.rpc("submit_application_with_evidence", input);
  expect(submitted.error).toBeNull();
  const applicationId = submitted.data as string;
  for (const [client, visible] of [
    [candidate.client, true],
    [employer, true],
    [otherEmployer, false],
    [operator, true],
    [anonymous, false],
  ] as const) {
    const result = await client.from("applications").select("id").eq("id", applicationId);
    expect(result.data ?? []).toHaveLength(visible ? 1 : 0);
  }
  const forbiddenStage = await otherEmployer.rpc("record_application_stage", {
    target_application_id: applicationId,
    next_stage: "reviewed",
    event_note: null,
  });
  expect(forbiddenStage.error).not.toBeNull();
  expect(
    (
      await employer.rpc("record_application_stage", {
        target_application_id: applicationId,
        next_stage: "reviewed",
        event_note: null,
      })
    ).error,
  ).toBeNull();
  await candidate.client.auth.signOut();
  const afterSignOut = await candidate.client
    .from("applications")
    .select("id")
    .eq("id", applicationId);
  expect(afterSignOut.data ?? []).toHaveLength(0);
});

test("AI provenance is private, immutable, costed, and role constrained", async () => {
  const candidate = await confirmedAccount("ai-provenance");
  const other = await confirmedAccount("ai-provenance");
  const employer = await fixtureClient("employer@doroboty.local");
  const row = {
    purpose: "candidate_answer",
    requested_by: candidate.id,
    job_id: "20000000-0000-4000-8000-000000000001",
    provider: "deterministic",
    model: "course-fixture-v1",
    prompt_version: "evidence-first-v1",
    source_payload: { fixture: true },
    output_text: "Tekst źródłowy pozostaje oddzielony od tej wygenerowanej wersji odpowiedzi.",
    latency_ms: 4,
    input_tokens: 12,
    output_tokens: 18,
    estimated_cost_usd: 0.001,
    status: "succeeded",
  } as const;
  const inserted = await candidate.client.from("ai_generations").insert(row).select("id").single();
  expect(inserted.error).toBeNull();
  const generationId = inserted.data!.id;
  expect(
    (await other.client.from("ai_generations").select("id").eq("id", generationId)).data,
  ).toHaveLength(0);
  expect(
    (await employer.from("ai_generations").select("estimated_cost_usd").eq("id", generationId))
      .data,
  ).toHaveLength(1);
  await candidate.client
    .from("ai_generations")
    .update({ output_text: "Niedozwolona zmiana" })
    .eq("id", generationId);
  const unchanged = await candidate.client
    .from("ai_generations")
    .select("output_text")
    .eq("id", generationId)
    .single();
  expect(unchanged.data?.output_text).toBe(row.output_text);
  const wrongRole = await candidate.client
    .from("ai_generations")
    .insert({ ...row, purpose: "job_draft" });
  expect(wrongRole.error).not.toBeNull();
  const forbiddenApproval = await candidate.client.rpc("approve_job_text_version", {
    target_job_id: row.job_id,
    target_generation_id: generationId,
    approved_title: "Nieautoryzowana wersja",
    approved_summary: "Ten tekst nie powinien zostać zatwierdzony przez kandydata.",
    approved_description:
      "Kandydat nie jest członkiem organizacji i nie może zatwierdzić wersji tekstu oferty.",
  });
  expect(forbiddenApproval.error).not.toBeNull();
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

test("future AI assignments cannot be exposed before their release", async () => {
  const candidate = await fixtureClient("candidate@doroboty.local");
  const future = await candidate
    .from("experiment_assignments")
    .select("id")
    .eq("surface", "candidate_answer")
    .eq("release_key", "post_ai")
    .single();
  expect(future.error).toBeNull();
  const exposure = await candidate.rpc("record_experiment_exposure", {
    target_assignment_id: future.data!.id,
    target_application_id: null,
  });
  expect(exposure.error).not.toBeNull();
  expect((await candidate.rpc("can_use_ai", { target_surface: "candidate_answer" })).data).toBe(
    false,
  );
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

  await page.getByLabel("Tytuł", { exact: true }).fill("Mapa procesu i prototyp");
  await page.getByLabel("Link HTTPS (opcjonalnie)").fill("https://example.com/work-sample");
  await page.getByLabel("Kontekst", { exact: true }).fill("Proces finansowy wymagał discovery.");
  await page
    .getByLabel("Wynik", { exact: true })
    .fill("Prototyp obniżył czas obsługi o 20 procent.");
  await page.getByRole("button", { name: "Dodaj próbkę" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Próbka pracy dodana." })).toBeVisible();

  await page.goto("/aplikuj/ai-product-manager");
  await expect(page.getByText("Wariant: zapisany profil", { exact: true })).toBeVisible();
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
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/kandydaci");
  await expect(page.getByRole("heading", { name: "Kandydat testowy" })).toBeVisible();
  const application = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Kandydat testowy" }) })
    .filter({ hasText: "AI Product Manager" });
  await application.getByRole("button", { name: "Oznacz jako przejrzaną" }).click();
  await expect(application.getByText("in_review", { exact: true })).toBeVisible();
  await application.getByRole("button", { name: "Zaproś na rozmowę" }).click();
  await application.getByRole("button", { name: "Rozmowa odbyta" }).click();
  await application.getByRole("button", { name: "Kontynuujemy" }).click();
  await expect(application.getByText("continued", { exact: true })).toBeVisible();
});

test("long-form application remains a complete browser journey", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("candidate-longform@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/aplikuj/staff-ai-engineer");
  await expect(page.getByText("Wariant: pełna odpowiedź", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Dlaczego pasujesz do tej roli?")).toHaveValue("");
  await page
    .getByLabel("Dlaczego pasujesz do tej roli?")
    .fill("Budowałem ewaluacje systemów AI i wdrożyłem nadzór człowieka w procesie regulowanym.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij aplikację" }).click();
  await expect(page).toHaveURL(/\/app\/aplikacje\?submitted=1/);
});

test("candidate and employer core flows meet automated WCAG A and AA", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("candidate@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/profil");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Wyloguj się", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("employer@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/kandydaci");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
});

test("a new employer can create an isolated organization through onboarding", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("employer-new@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/organizacja");
  await page.getByLabel("Nazwa firmy").fill("Rehearsal Org");
  await page.getByLabel("Slug (małe litery i myślniki)").fill("rehearsal-org");
  await page
    .getByLabel("Krótkie podsumowanie")
    .fill("Syntetyczna organizacja do próby case study.");
  await page
    .getByLabel("Opis", { exact: true })
    .fill("Izolowana organizacja używana wyłącznie do testu procesu uczestnika.");
  await page.getByLabel("Strona HTTPS").fill("https://example.com/rehearsal");
  await page.getByLabel("Lokalizacja").fill("Warszawa");
  await page.getByLabel("Wielkość, np. 11–50 osób").fill("11–50 osób");
  await page.getByRole("button", { name: "Utwórz organizację" }).click();
  await expect(page.getByRole("heading", { name: "Rehearsal Org" })).toBeVisible();
});

test("only an operator can inspect and release every case stage", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("operator@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/case?release=post_ai");
  await expect(page.getByRole("heading", { name: "Case releases" })).toBeVisible();
  await expect(page.getByText(/Materiał późniejszego etapu/)).toBeVisible();
  for (const release of [
    "baseline",
    "post_one_click",
    "discovery",
    "post_ai",
    "pilot",
    "demo_day",
  ]) {
    await page.getByLabel("Aktywny etap").selectOption(release);
    await page.getByRole("button", { name: "Ustaw i ukryj późniejsze etapy" }).click();
    await expect(page.getByText("Potwierdzony aktywny etap:")).toContainText(
      release === "post_one_click"
        ? "Po one-click"
        : release === "post_ai"
          ? "Po interwencji AI"
          : release === "demo_day"
            ? "Demo Day"
            : release === "pilot"
              ? "Pilot"
              : release[0]!.toUpperCase() + release.slice(1),
    );
  }
});

test("candidate and employer AI drafts require approval and preserve public source truth", async ({
  page,
}) => {
  const operator = await fixtureClient("operator@doroboty.local");
  const release = await operator.rpc("release_case", { target_release: "demo_day" });
  expect(release.error).toBeNull();
  const candidate = await fixtureClient("candidate@doroboty.local");
  const candidateApplicationsBefore = await candidate
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("job_id", "20000000-0000-4000-8000-000000000004");

  await page.goto("/auth/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("candidate@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/aplikuj/ai-operations-specialist");
  await page.getByRole("button", { name: "Przygotuj szkic z AI" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Szkic gotowy." })).toBeVisible();
  await expect(page.getByLabel("Dlaczego pasujesz do tej roli?")).not.toHaveValue("");
  const candidateApplicationsAfter = await candidate
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("job_id", "20000000-0000-4000-8000-000000000004");
  expect(candidateApplicationsAfter.count).toBe(candidateApplicationsBefore.count);

  await page.goto("/app");
  await page.getByRole("button", { name: "Wyloguj się", exact: true }).click();
  const employer = await fixtureClient("employer@doroboty.local");
  const originalJob = await employer
    .from("jobs")
    .select("title")
    .eq("id", "20000000-0000-4000-8000-000000000001")
    .single();
  await page.getByLabel("Email", { exact: true }).fill("employer@doroboty.local");
  await page.getByLabel("Hasło", { exact: true }).fill(localCasePassword);
  await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto("/app/oferty");
  await page.getByLabel("Oferta").selectOption({ label: "AI Product Manager" });
  await page.getByRole("button", { name: "Wygeneruj szkic" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Szkic gotowy" })).toBeVisible();
  await page.getByLabel("Tytuł", { exact: true }).fill("AI Product Manager — wersja prywatna");
  await page.getByRole("button", { name: "Zatwierdź wersję" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Zatwierdzono wersję" })).toBeVisible();
  const publicJobAfterApproval = await employer
    .from("jobs")
    .select("title")
    .eq("id", "20000000-0000-4000-8000-000000000001")
    .single();
  expect(publicJobAfterApproval.data?.title).toBe(originalJob.data?.title);
  const privateVersion = await employer
    .from("job_text_versions")
    .select("title, visibility")
    .eq("job_id", "20000000-0000-4000-8000-000000000001")
    .eq("title", "AI Product Manager — wersja prywatna")
    .single();
  expect(privateVersion.data?.visibility).toBe("private");
});

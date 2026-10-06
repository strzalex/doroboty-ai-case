import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
const api = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const mail = process.env.LOCAL_MAIL_URL ?? "http://127.0.0.1:54324";
const password = "Local-test-password-483!";
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
test("rejestracja, potwierdzenie emaila, dashboard, logowanie i odzyskiwanie hasła", async ({
  page,
}) => {
  const email = `browser-${crypto.randomUUID()}@example.test`;
  await page.goto("/app");
  await expect(page).toHaveURL(/auth\/sign-in/);
  await page.getByRole("link", { name: "Utwórz konto", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Utwórz konto", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Sprawdź skrzynkę");
  await page.getByRole("link", { name: "Przejdź do logowania" }).click();
  await expect(page.getByRole("button", { name: "Zaloguj się", exact: true })).toBeVisible();
  await page.goto(await emailLink(email, "signup"));
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "Dokumenty", exact: true })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dokumenty", exact: true })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Nowy dostęp." })).toBeVisible();
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
test("sesje dwóch kont pozostają niezależne", async () => {
  async function account() {
    const client = createClient(api, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const email = `session-${crypto.randomUUID()}@example.test`;
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
  const a = await account();
  const b = await account();
  expect(a.id).not.toBe(b.id);
  expect((await a.client.auth.getUser()).data.user?.id).toBe(a.id);
  expect((await b.client.auth.getUser()).data.user?.id).toBe(b.id);
  expect((await a.client.auth.signOut()).error).toBeNull();
  expect((await a.client.auth.getUser()).data.user).toBeNull();
  expect((await b.client.auth.getUser()).data.user?.id).toBe(b.id);
});
test("niepoprawny link potwierdzenia nie przekierowuje poza aplikację", async ({ page }) => {
  await page.goto("/auth/callback?token_hash=invalid&type=signup&next=https://example.com");
  await expect(page).toHaveURL(/127.0.0.1:3107\/auth\/sign-in\?error=link/);
  await expect(page.locator("main").getByRole("alert")).toContainText("wygasł");
});

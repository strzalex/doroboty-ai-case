import { chromium } from "playwright";

const origin = new URL(process.env.DEPLOYMENT_URL ?? "");
const password = process.env.REHEARSAL_ACCOUNT_PASSWORD ?? "";

if (origin.protocol !== "https:") throw new Error("DEPLOYMENT_URL must use HTTPS.");
if (password.length < 16) throw new Error("REHEARSAL_ACCOUNT_PASSWORD is missing or too short.");

const accounts = [
  {
    email: "candidate.rehearsal@doroboty.invalid",
    role: "Kandydat",
    expectedLink: "Profil",
    forbiddenLink: "Case",
  },
  {
    email: "employer.rehearsal@doroboty.invalid",
    role: "Pracodawca",
    expectedLink: "Kandydaci",
    forbiddenLink: "Case",
  },
  {
    email: "operator.rehearsal@doroboty.invalid",
    role: "Operator",
    expectedLink: "Case",
    forbiddenLink: "Profil",
  },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const account of accounts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(new URL("/auth/sign-in", origin).href, { waitUntil: "networkidle" });
    await page.getByLabel("Email").fill(account.email);
    await page.getByLabel("Hasło").fill(password);
    await page.getByRole("button", { name: "Zaloguj się" }).click();
    await page.waitForURL(new URL("/app", origin).href, { timeout: 15_000 });
    await page.locator(".workspace-label").getByText(account.role, { exact: true }).waitFor();
    await page.getByRole("link", { name: account.expectedLink, exact: true }).waitFor();
    if (await page.getByRole("link", { name: account.forbiddenLink, exact: true }).count()) {
      throw new Error(`${account.role} received a forbidden navigation item.`);
    }
    console.log(`Authenticated ${account.role.toLowerCase()} workspace passed.`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`Authenticated deployment smoke passed for ${origin.origin}.`);

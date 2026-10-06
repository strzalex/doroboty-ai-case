import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const origin = new URL(process.env.DEPLOYMENT_URL ?? "");
const password = process.env.REHEARSAL_ACCOUNT_PASSWORD ?? "";

if (origin.protocol !== "https:") throw new Error("DEPLOYMENT_URL must use HTTPS.");
if (password.length < 16) throw new Error("REHEARSAL_ACCOUNT_PASSWORD is missing or too short.");

const releases = [
  ["baseline", "Baseline"],
  ["post_one_click", "Po one-click"],
  ["discovery", "Discovery"],
  ["post_ai", "Po interwencji AI"],
  ["pilot", "Pilot"],
  ["demo_day", "Demo Day"],
];

for (const [key] of releases) {
  execFileSync("npm", ["run", "case:packet", "--", key], { stdio: "inherit" });
  execFileSync("npm", ["run", "case:verify-packet", "--", key], { stdio: "inherit" });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
try {
  await page.goto(new URL("/auth/sign-in", origin).href, { waitUntil: "networkidle" });
  await page.getByLabel("Email").fill("operator.rehearsal@doroboty.invalid");
  await page.getByLabel("Hasło").fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await page.waitForURL(new URL("/app", origin).href, { timeout: 15_000 });

  for (const [key, label] of releases) {
    await page.goto(new URL(`/app/case?release=${key}`, origin).href, {
      waitUntil: "networkidle",
    });
    await page.locator('select[name="release"]').selectOption(key);
    await page.getByRole("button", { name: "Ustaw i ukryj późniejsze etapy" }).click();
    await page.getByText(`Potwierdzony aktywny etap: ${label}`, { exact: true }).waitFor();
    await page.getByText(/^OK — pełne \d+ ścieżek jest spójne/).waitFor();
    console.log(`${label}: release control, fixture gate, and participant packet passed.`);

    if (key === "pilot") {
      await page.getByRole("link", { name: "Kalkulator pilota" }).click();
      await page.getByRole("heading", { name: "Business case" }).waitFor();
      await page.goBack({ waitUntil: "networkidle" });
    }
  }
} finally {
  try {
    await page.goto(new URL("/app/case?release=discovery", origin).href, {
      waitUntil: "networkidle",
    });
    await page.locator('select[name="release"]').selectOption("discovery");
    await page.getByRole("button", { name: "Ustaw i ukryj późniejsze etapy" }).click();
    await page.getByText("Potwierdzony aktywny etap: Discovery", { exact: true }).waitFor();
  } finally {
    await context.close();
    await browser.close();
  }
}

console.log(
  `Instructor deployment rehearsal passed for ${origin.origin}; release reset to discovery.`,
);

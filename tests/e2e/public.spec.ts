import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("public marketplace links homepage, jobs, company, and methodology", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Praca dla ludzi, którzy dowożą z AI." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Zobacz oferty" }).click();
  await expect(page.getByRole("heading", { name: "Oferty pracy z AI" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("link", { name: "Zobacz rolę" }).first().click();
  await expect(page.getByRole("heading", { name: "AI Product Manager" })).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await page.getByRole("link", { name: "BrightLabs" }).click();
  await expect(page.getByRole("heading", { name: "BrightLabs" })).toBeVisible();
});

test("URL filters are rendered in server HTML and use a native GET form", async ({
  page,
  request,
}) => {
  const response = await request.get("/oferty?category=build");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("2 ofert");
  expect(html).toContain("Staff AI Engineer");
  await page.goto("/oferty?category=build");
  await page.getByLabel("Kategoria").selectOption("lead");
  await page.getByRole("button", { name: "Filtruj" }).click();
  await expect(page).toHaveURL(/category=lead/);
  await expect(page.getByRole("status")).toHaveText("2 ofert");
});

test("public pages remain within a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/", "/oferty", "/oferty/ai-product-manager", "/metodologia"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test("unknown jobs return the Polish not-found state", async ({ page }) => {
  const response = await page.goto("/oferty/nie-istnieje");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Nie znaleźliśmy tej strony." })).toBeVisible();
});

test("core public pages have no WCAG A/AA violations", async ({ page }) => {
  for (const path of ["/", "/oferty", "/oferty/ai-product-manager", "/metodologia"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${path}: ${results.violations.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }
});

test("job browsing remains useful with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/oferty?category=build");
  await expect(page.getByRole("status")).toHaveText("2 ofert");
  await page.getByRole("link", { name: "Zobacz rolę" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.close();
});

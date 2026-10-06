import { test, expect } from "@playwright/test";

test("table: search, filters, selection, pagination, and no persistence", async ({ page }) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname !== "127.0.0.1") remoteRequests.push(request.url());
  });
  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "Documents", exact: true })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page.getByRole("checkbox", { name: "Select: Cover page", exact: true }).check();
  await expect(page.getByRole("status")).toHaveText("Selected 1 of 16 documents");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await page.getByRole("textbox", { name: "Search documents" }).fill("design");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
  await page.getByLabel("Filter by status").selectOption("done");
  await expect(page.getByRole("heading", { name: "No matching documents" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Selected 0 of 16 documents");
  expect(await page.evaluate(() => localStorage.getItem("doroboty.projects.v1"))).toBeNull();
  expect(remoteRequests).toEqual([]);
});

test("chart responds to the period and selection applies only to the current page", async ({
  page,
}) => {
  await page.goto("/demo");
  const chart = page.getByRole("img", { name: /Sample traffic/ });
  const initialPoints = await chart.locator("polyline").first().getAttribute("points");
  await page.getByRole("button", { name: "7 days", exact: true }).click();
  await expect(chart).toHaveAttribute("aria-label", /7 days/);
  await expect(page.getByRole("button", { name: "7 days", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(await chart.locator("polyline").first().getAttribute("points")).not.toBe(initialPoints);
  await page.getByRole("checkbox", { name: "Select documents on this page" }).check();
  await expect(page.getByRole("status")).toHaveText("Selected 10 of 16 documents");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Select documents on this page" }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Previous page" }).click();
  await page.getByRole("checkbox", { name: "Select documents on this page" }).uncheck();
  await expect(page.getByRole("status")).toHaveText("Selected 0 of 16 documents");
});

test("keyboard, form validation, and theme persistence", async ({ page }) => {
  await page.goto("/demo");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByLabel("Search documents").focus();
  await page.keyboard.type("design");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goto("/components");
  await page.getByRole("button", { name: "Open form" }).click();
  await expect(page.getByRole("dialog").getByLabel("Name", { exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Validate form" }).click();
  await expect(page.getByRole("dialog").getByLabel("Name", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByRole("dialog").getByLabel("Email", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByRole("dialog").getByLabel("Name", { exact: true }).fill("Anna");
  await page.getByRole("dialog").getByLabel("Email", { exact: true }).fill("anna@example.test");
  await page.getByRole("button", { name: "Validate form" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("No data was saved");
  await page.getByRole("button", { name: "Open form" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/demo/settings");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("missing configuration and stale data do not affect the demo", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Connect your database." })).toBeVisible();
  await page.goto("/demo");
  await page.evaluate(() => localStorage.setItem("doroboty.projects.v1", "corrupted"));
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  expect(await page.evaluate(() => localStorage.getItem("doroboty.projects.v1"))).toBe("corrupted");
  await page.goto("/demo/projects/old-id");
  await expect(page.getByRole("heading", { name: "Nie znaleźliśmy tej strony." })).toBeVisible();
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`responsive layout: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/demo");
    await expect(page.locator("tbody tr")).toHaveCount(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const tableRegion = page.getByRole("region", { name: /Document table/ });
    await page.screenshot({ path: `test-results/demo-${width}.png`, fullPage: true });
    await tableRegion.focus();
    await expect(tableRegion).toBeFocused();
    if (width < 768) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("link", { name: "Settings", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    }
  });
}

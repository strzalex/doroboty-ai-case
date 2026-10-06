import { test, expect } from "@playwright/test";

test("tabela: wyszukiwanie, filtry, zaznaczenie, paginacja i brak zapisu", async ({ page }) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname !== "127.0.0.1") remoteRequests.push(request.url());
  });
  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "Dokumenty", exact: true })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page.getByRole("checkbox", { name: "Zaznacz: Strona tytułowa", exact: true }).check();
  await expect(page.getByRole("status")).toHaveText("Zaznaczono 1 z 16 dokumentów");
  await page.getByRole("button", { name: "Następna strona" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(page.getByText("Strona 2 z 2")).toBeVisible();
  await page.getByRole("textbox", { name: "Szukaj dokumentów" }).fill("design");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("Strona 1 z 1")).toBeVisible();
  await page.getByLabel("Filtruj po statusie").selectOption("done");
  await expect(page.getByRole("heading", { name: "Brak pasujących dokumentów" })).toBeVisible();
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Zaznaczono 0 z 16 dokumentów");
  expect(await page.evaluate(() => localStorage.getItem("superstarter.projects.v1"))).toBeNull();
  expect(remoteRequests).toEqual([]);
});

test("wykres reaguje na okres, a zaznaczenie obejmuje tylko bieżącą stronę", async ({ page }) => {
  await page.goto("/demo");
  const chart = page.getByRole("img", { name: /Przykładowy ruch/ });
  const initialPoints = await chart.locator("polyline").first().getAttribute("points");
  await page.getByRole("button", { name: "7 dni", exact: true }).click();
  await expect(chart).toHaveAttribute("aria-label", /7 dni/);
  await expect(page.getByRole("button", { name: "7 dni", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(await chart.locator("polyline").first().getAttribute("points")).not.toBe(initialPoints);
  await page.getByRole("checkbox", { name: "Zaznacz dokumenty na tej stronie" }).check();
  await expect(page.getByRole("status")).toHaveText("Zaznaczono 10 z 16 dokumentów");
  await page.getByRole("button", { name: "Następna strona" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Zaznacz dokumenty na tej stronie" }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Poprzednia strona" }).click();
  await page.getByRole("checkbox", { name: "Zaznacz dokumenty na tej stronie" }).uncheck();
  await expect(page.getByRole("status")).toHaveText("Zaznaczono 0 z 16 dokumentów");
});

test("klawiatura, walidacja formularza i zapamiętanie motywu", async ({ page }) => {
  await page.goto("/demo");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Przejdź do treści" })).toBeFocused();
  await page.getByLabel("Szukaj dokumentów").focus();
  await page.keyboard.type("design");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goto("/components");
  await page.getByRole("button", { name: "Otwórz formularz" }).click();
  await expect(page.getByRole("dialog").getByLabel("Imię", { exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Sprawdź formularz" }).click();
  await expect(page.getByRole("dialog").getByLabel("Imię", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByRole("dialog").getByLabel("Email", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByRole("dialog").getByLabel("Imię", { exact: true }).fill("Anna");
  await page.getByRole("dialog").getByLabel("Email", { exact: true }).fill("anna@example.test");
  await page.getByRole("button", { name: "Sprawdź formularz" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Dane nie zostały zapisane");
  await page.getByRole("button", { name: "Otwórz formularz" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/demo/settings");
  await page.getByRole("button", { name: "Ciemny", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("brak konfiguracji i stare dane nie wpływają na demo", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Podłącz swoją bazę." })).toBeVisible();
  await page.goto("/demo");
  await page.evaluate(() => localStorage.setItem("superstarter.projects.v1", "corrupted"));
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  expect(await page.evaluate(() => localStorage.getItem("superstarter.projects.v1"))).toBe(
    "corrupted",
  );
  await page.goto("/demo/projects/old-id");
  await expect(page.getByRole("heading", { name: "Nie ma takiej strony." })).toBeVisible();
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`responsywny układ: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/demo");
    await expect(page.locator("tbody tr")).toHaveCount(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const tableRegion = page.getByRole("region", { name: /Tabela dokumentów/ });
    await page.screenshot({ path: `test-results/demo-${width}.png`, fullPage: true });
    await tableRegion.focus();
    await expect(tableRegion).toBeFocused();
    if (width < 768) {
      await page.getByRole("button", { name: "Otwórz menu" }).click();
      await page.getByRole("link", { name: "Ustawienia", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Ustawienia" })).toBeVisible();
    }
  });
}

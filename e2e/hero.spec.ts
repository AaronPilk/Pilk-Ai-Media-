import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`hero headline is fully visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveAttribute("aria-label", /websites people remember/i);
  });
}

test("primary hero CTAs are clickable", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /explore our work/i }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /start a website/i }).first()
  ).toBeVisible();
});

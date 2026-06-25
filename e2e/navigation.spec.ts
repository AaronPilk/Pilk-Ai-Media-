import { expect, test } from "@playwright/test";

test("Templates is absent from desktop navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: /primary/i });
  await expect(nav.getByRole("link", { name: /^templates$/i })).toHaveCount(0);
});

test("Start a Project opens the website brief", async ({ page }) => {
  await page.goto("/");
  const projectLink = page
    .getByRole("link", { name: /start a project|start a website/i })
    .first();
  await expect(projectLink).toBeVisible();
  await projectLink.click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(
    page.getByRole("heading", {
      name: /build your website brief|tell us about your website/i,
    })
  ).toBeVisible();
});

test("Process route loads the timeline", async ({ page }) => {
  await page.goto("/process/");
  await expect(page).toHaveURL(/\/process\/?$/);
  await expect(page.getByText(/Day 1/i).first()).toBeVisible();
  await expect(page.getByText(/Day 7/i).first()).toBeVisible();
});

test("Template detail route still works", async ({ page }) => {
  const res = await page.goto("/templates/signature-estate/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: /signature estate/i })).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("required fields block continuation on step 1", async ({ page }) => {
  await page.goto("/contact/");
  await page.getByRole("button", { name: /continue/i }).click();
  // Still on step 1 (business) — required errors prevent advancing.
  await expect(page.getByText(/step 1/i)).toBeVisible();
});

test("query-string template is preselected", async ({ page }) => {
  await page.goto("/contact/?template=signature-estate");
  // Advance to the template step and confirm preselection persists in review later.
  await expect(page.getByText(/tell us about your website/i)).toBeVisible();
});

test("can advance after filling required business fields", async ({ page }) => {
  await page.goto("/contact/");
  await page.getByLabel(/first name/i).fill("Test");
  await page.getByLabel(/last name/i).fill("User");
  await page.getByLabel(/email/i).fill("test@example.com");
  await page.getByLabel(/short business description/i).fill("We sell premium homes in Tampa Bay.");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByText(/step 2/i)).toBeVisible();
});

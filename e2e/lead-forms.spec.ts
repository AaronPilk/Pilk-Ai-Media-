import { expect, test, type Page, type Response } from "@playwright/test";
import { SMS_CONSENT_TEXT, SMS_CONSENT_VERSION } from "../src/lib/sms-consent";
import { RENEWAL_CONSENT_TEXT, RENEWAL_CONSENT_VERSION } from "../src/lib/checkout-pricing";

/**
 * Every lead form, submitted for real against `wrangler pages dev` (see
 * playwright.config.ts). The local preview has no RESEND_API_KEY, GHL_PIT_TOKEN
 * or STRIPE_SECRET_KEY, so the functions accept the lead and send nothing.
 */

const leadsResponse = (page: Page) =>
  page.waitForResponse((r) => r.url().endsWith("/api/leads") && r.request().method() === "POST");

/** The JSON a form sent, whether it posted JSON or multipart with a payload part. */
function sentPayload(res: Response): Record<string, unknown> {
  const raw = res.request().postData() ?? "";
  if (raw.trimStart().startsWith("{")) return JSON.parse(raw);
  const m = raw.match(/name="payload"\r\n\r\n([\s\S]*?)\r\n--/);
  if (!m) throw new Error("no payload part in multipart body");
  return JSON.parse(m[1]);
}

async function expectSmsBox(page: Page, phoneSelector: string, phone: string) {
  const box = page.getByTestId("sms-consent");
  await expect(box).toHaveCount(0); // shows only once there is a number
  await page.locator(phoneSelector).fill(phone);
  await expect(box).toBeVisible();
  await expect(page.getByTestId("sms-consent-text")).toHaveText(SMS_CONSENT_TEXT);
  const checkbox = box.getByRole("checkbox");
  await expect(checkbox).not.toBeChecked(); // unticked by default
  await expect(box.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms/");
  await expect(box.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy/");
  return checkbox;
}

test.describe("lead forms submit", () => {
  test("quick inquiry (/inquiry/) with SMS consent", async ({ page }) => {
    await page.goto("/inquiry/");
    await page.locator("#iq-name").fill("Maria Lopez");
    await page.locator("#iq-email").fill("maria@example.com");
    const sms = await expectSmsBox(page, "#iq-phone", "(727) 555-0100");
    await sms.check();
    await page.locator("#iq-msg").fill("Looking for a new site.");
    await expect(page.getByText(/By submitting, you agree to the Terms of Service/)).toBeVisible();
    const res = leadsResponse(page);
    await page.getByRole("button", { name: /submit inquiry/i }).click();
    const r = await res;
    expect(r.status()).toBe(200);
    const body = sentPayload(r);
    expect(body).toMatchObject({
      formType: "inquiry",
      name: "Maria Lopez",
      email: "maria@example.com",
      phone: "(727) 555-0100",
      smsConsent: true,
      smsConsentVersion: SMS_CONSENT_VERSION,
    });
    expect(String(body.pageUrl)).toMatch(/\/inquiry\/$/);
    await expect(page.getByRole("heading", { name: /we.ll be in touch/i })).toBeVisible();
  });

  test("quick inquiry clears SMS consent when the phone is emptied", async ({ page }) => {
    await page.goto("/inquiry/");
    await page.locator("#iq-name").fill("Ann Lee");
    await page.locator("#iq-email").fill("ann@example.com");
    const sms = await expectSmsBox(page, "#iq-phone", "7275550100");
    await sms.check();
    await page.locator("#iq-phone").fill("");
    await expect(page.getByTestId("sms-consent")).toHaveCount(0);
    const res = leadsResponse(page);
    await page.getByRole("button", { name: /submit inquiry/i }).click();
    const r = await res;
    expect(r.status()).toBe(200);
    expect(sentPayload(r).smsConsent).toBe(false);
  });

  for (const path of ["/mortgage/", "/real-estate/"]) {
    test(`contact form on ${path}`, async ({ page }) => {
      await page.goto(path);
      const form = page.locator("form").filter({ has: page.locator("#firstName") });
      await form.locator("#firstName").fill("Dan");
      await form.locator("#lastName").fill("Ray");
      await form.locator("#email").fill("dan@example.com");
      const sms = await expectSmsBox(page, "form #phone", "813-555-0101");
      await sms.check();
      await form.locator("#message").fill("We need a mortgage website soon.");
      // "I have a current website" stays unticked: that used to block the form.
      const res = leadsResponse(page);
      await form.getByRole("button", { name: /send inquiry/i }).click();
      const r = await res;
      expect(r.status()).toBe(200);
      expect(sentPayload(r)).toMatchObject({
        formType: "contact",
        firstName: "Dan",
        currentWebsite: "",
        smsConsent: true,
        smsConsentVersion: SMS_CONSENT_VERSION,
      });
      await expect(page.getByRole("heading", { name: /thanks, dan/i })).toBeVisible();
    });
  }

  test("demo listing: Request info popover", async ({ page }) => {
    await page.goto("/real-estate/experience/estate/");
    await page.getByRole("button", { name: /^request info$/i }).click();
    await page.getByPlaceholder("Your name").fill("Sam Park");
    await page.getByPlaceholder("Email", { exact: true }).fill("sam@example.com");
    await page.getByPlaceholder("Phone (optional)").fill("727-555-0102");
    const res = leadsResponse(page);
    await page.getByRole("button", { name: /request a call/i }).click();
    const r = await res;
    expect(r.status()).toBe(200);
    expect(sentPayload(r)).toMatchObject({ formType: "listing-inquiry", name: "Sam Park" });
    await expect(page.getByText(/thanks — we.ll be in touch shortly/i)).toBeVisible();
  });

  test("demo listing: Book a showing", async ({ page }) => {
    await page.goto("/real-estate/experience/estate/");
    await page.locator("#sb-name").fill("Jane Doe");
    await page.locator("#sb-email").fill("jane@example.com");
    await page.locator("#sb-phone").fill("727-555-0103");
    const d = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    await page.locator("#sb-date").fill(d);
    await page.getByRole("button", { name: "11:00 AM" }).click();
    const res = leadsResponse(page);
    await page.locator("form").filter({ has: page.locator("#sb-name") }).locator('button[type="submit"]').click();
    const r = await res;
    expect(r.status()).toBe(200);
    expect(sentPayload(r)).toMatchObject({ formType: "listing-showing", preferredDate: d, timeSlot: "11:00 AM" });
    await expect(page.getByText(/your showing request is in/i)).toBeVisible();
  });

  // Leaves every optional question unanswered, including the light/dark choice
  // on step 4 that used to block the wizard with no error shown.
  test("project brief (/contact/) end to end with SMS consent", async ({ page }) => {
    await page.goto("/contact/");
    await page.locator("#firstName").fill("Test");
    await page.locator("#lastName").fill("User");
    await page.locator("#email").fill("test@example.com");
    const sms = await expectSmsBox(page, "#phone", "727-555-0104");
    await sms.check();
    await page.locator("#businessDescription").fill("We sell premium homes in Tampa Bay.");
    for (let step = 2; step <= 6; step++) {
      await page.getByRole("button", { name: /^continue/i }).click();
      await expect(page.getByText(new RegExp(`step ${step}`, "i")).first()).toBeVisible();
    }
    await expect(page.getByText("Yes, you agreed to texts")).toBeVisible();
    await page.getByLabel(/I agree to be contacted about my website project/i).check();
    const res = leadsResponse(page);
    await page.getByRole("button", { name: /submit my website brief/i }).click();
    const r = await res;
    expect(r.status()).toBe(200);
    expect(sentPayload(r)).toMatchObject({
      formType: "project-brief",
      consent: true,
      smsConsent: true,
      smsConsentVersion: SMS_CONSENT_VERSION,
    });
    await expect(page.getByRole("heading", { name: /thanks, test/i })).toBeVisible();
  });

  test("template order, then checkout disclosure and required renewal box", async ({ page }) => {
    await page.goto("/start/mortgage-broker/");
    await page.locator("#name").fill("Maria Lopez");
    await page.locator("#email").fill("maria@example.com");
    await page.locator("#businessName").fill("Lopez Home Loans");
    const sms = await expectSmsBox(page, "#phone", "7275550100");
    await sms.check();
    await page.getByRole("button", { name: /^continue/i }).click();
    await page.getByRole("button", { name: /skip this/i }).click();
    await page.getByRole("button", { name: /skip photos/i }).click();
    await expect(page.getByText(/plus a 10% fees & processing charge/i)).toBeVisible();
    await page.getByText("Yes, build my website and contact me about it").click();
    const intake = page.waitForResponse((r) => r.url().endsWith("/api/template-intake"));
    await page.getByRole("button", { name: /save & continue to payment/i }).click();
    const ir = await intake;
    expect(ir.status()).toBe(200);
    expect(sentPayload(ir)).toMatchObject({ consent: true, smsConsent: true, smsConsentVersion: SMS_CONSENT_VERSION });

    await page.waitForURL(/\/checkout\/?\?template=mortgage-broker/);
    const disclosure = page.getByTestId("renewal-disclosure");
    await expect(disclosure).toContainText("renews automatically");
    await expect(disclosure).toContainText("What renews: hosting, support and edits");
    await expect(disclosure).toContainText("$100 per month");
    await expect(disclosure).toContainText("30 days after today");
    await expect(disclosure).toContainText(/First charge: [A-Z][a-z]+ \d{1,2}, \d{4}/);
    await expect(disclosure).toContainText("every month on that date until you cancel");
    await expect(disclosure.getByRole("link", { name: "Aaron@pilk.ai" })).toHaveAttribute(
      "href",
      /^mailto:Aaron@pilk\.ai\?subject=Cancel%20my%20hosting%20plan/
    );
    await expect(page.getByTestId("fee-line")).toContainText("Fees & processing (10%)");
    await expect(page.getByTestId("fee-line")).toContainText("$50.00");
    await expect(page.getByTestId("renewal-consent-text")).toHaveText(RENEWAL_CONSENT_TEXT);

    const box = page.getByRole("checkbox", { name: RENEWAL_CONSENT_TEXT });
    await expect(box).not.toBeChecked();
    let checkoutCalls = 0;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/checkout")) checkoutCalls++;
    });
    await page.getByRole("button", { name: /pay \$550\.00 with stripe/i }).click();
    await expect(page.locator("#renewal-consent-error")).toContainText("tick the box");
    expect(checkoutCalls).toBe(0);

    await box.check();
    const checkout = page.waitForResponse((r) => r.url().endsWith("/api/checkout"));
    await page.getByRole("button", { name: /pay \$550\.00 with stripe/i }).click();
    const cr = await checkout;
    expect(JSON.parse(cr.request().postData() ?? "{}")).toMatchObject({
      renewalConsent: true,
      renewalConsentVersion: RENEWAL_CONSENT_VERSION,
      template: "mortgage-broker",
    });
    // No Stripe key in the local preview, so no payment can start.
    expect(cr.status()).toBe(503);
    await expect(page.getByText(/payments aren.t configured yet/i)).toBeVisible();
  });
});

test.describe("the API still rejects junk", () => {
  const invalid: [string, unknown][] = [
    ["quick inquiry without a name", { formType: "inquiry", name: "", email: "a@example.com" }],
    ["quick inquiry without email or phone", { formType: "inquiry", name: "A" }],
    ["contact form without a message", { formType: "contact", firstName: "A", lastName: "B", email: "a@example.com", projectType: "unsure", message: "" }],
    ["listing inquiry with a bad email", { formType: "listing-inquiry", name: "A", email: "nope" }],
    ["showing without a time slot", { formType: "listing-showing", name: "A", email: "a@example.com", preferredDate: "2026-12-01" }],
    ["brief without a business description", { formType: "project-brief", firstName: "A", lastName: "B", email: "a@example.com", projectType: "unsure", consent: true }],
    ["brief without consent", { firstName: "A", lastName: "B", email: "a@example.com", businessDescription: "We sell homes in Tampa.", projectType: "unsure", consent: false }],
    ["unknown form", { formType: "other", name: "A", email: "a@example.com" }],
    ["overlong name", { formType: "inquiry", name: "x".repeat(121), email: "a@example.com" }],
  ];
  for (const [name, data] of invalid) {
    test(`400: ${name}`, async ({ request }) => {
      const r = await request.post("/api/leads", { data });
      expect(r.status()).toBe(400);
      expect((await r.json()).success).toBe(false);
    });
  }

  test("400: invalid JSON", async ({ request }) => {
    const r = await request.post("/api/leads", { data: "{nope", headers: { "content-type": "application/json" } });
    expect(r.status()).toBe(400);
  });

  test("400: template order without its required box", async ({ request }) => {
    const r = await request.post("/api/template-intake", {
      multipart: { payload: JSON.stringify({ name: "A", email: "a@example.com", businessName: "B" }) },
    });
    expect(r.status()).toBe(400);
  });

  test("400: checkout without the renewal agreement", async ({ request }) => {
    const r = await request.post("/api/checkout", { data: { addons: [], template: "mortgage-broker" } });
    expect(r.status()).toBe(400);
    expect((await r.json()).code).toBe("renewal_consent_required");
  });
});

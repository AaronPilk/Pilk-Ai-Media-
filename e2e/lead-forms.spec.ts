import { expect, test, type Page, type Response } from "@playwright/test";
import { SMS_CONSENT_TEXT, SMS_CONSENT_VERSION } from "../src/lib/sms-consent";

/**
 * Every lead form, submitted for real against `wrangler pages dev` (see
 * playwright.config.ts). The local preview has no RESEND_API_KEY or
 * GHL_PIT_TOKEN, so the functions accept the lead and send nothing. Nothing is
 * sold online: the template request ends in a quote request, and /api/checkout
 * is retired.
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

  test("template request: a quote request with SMS consent, no payment step", async ({ page }) => {
    await page.goto("/start/mortgage-broker/");
    await expect(page.getByRole("heading", { name: /request the beacon lending template/i })).toBeVisible();
    await expect(page.getByText(/no payment here/i)).toBeVisible();
    await page.locator("#name").fill("Maria Lopez");
    await page.locator("#email").fill("maria@example.com");
    await page.locator("#businessName").fill("Lopez Home Loans");
    const sms = await expectSmsBox(page, "#phone", "7275550100");
    await sms.check();
    await page.getByRole("button", { name: /^continue/i }).click();
    await page.getByRole("button", { name: /skip this/i }).click();
    await page.getByRole("button", { name: /skip photos/i }).click();
    await expect(page.getByText(/this template is starting at \$500/i)).toBeVisible();
    await expect(page.getByText(/fees & processing|checkout/i)).toHaveCount(0);
    await page.getByText("Yes, send me a quote for this website and contact me about it").click();
    let checkoutCalls = 0;
    page.on("request", (r) => {
      if (r.url().includes("/api/checkout") || r.url().includes("/checkout")) checkoutCalls++;
    });
    const intake = page.waitForResponse((r) => r.url().endsWith("/api/template-intake"));
    await page.getByRole("button", { name: /send my request/i }).click();
    const ir = await intake;
    expect(ir.status()).toBe(200);
    expect(sentPayload(ir)).toMatchObject({
      templateSlug: "mortgage-broker",
      consent: true,
      smsConsent: true,
      smsConsentVersion: SMS_CONSENT_VERSION,
    });
    await expect(page.getByText(/request received/i)).toBeVisible();
    await expect(page.getByText(/nothing has been charged/i)).toBeVisible();
    await expect(page).toHaveURL(/\/start\/mortgage-broker\/?$/);
    expect(checkoutCalls).toBe(0);
  });
});

test.describe("rate-limit message in the forms", () => {
  test("quick inquiry shows the function's 429 message", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ success: false, code: "rate_limited", error: "You've sent a few requests in a short time. Please wait about 10 minutes and try again, or email Aaron@pilk.ai." }),
      })
    );
    await page.goto("/inquiry/");
    await page.locator("#iq-name").fill("Ann Lee");
    await page.locator("#iq-email").fill("ann@example.com");
    await page.getByRole("button", { name: /submit inquiry/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: "wait about 10 minutes" })).toBeVisible();
    await expect(page.locator("#iq-name")).toHaveValue("Ann Lee"); // nothing typed is lost
  });

  test("a 429 page from a Cloudflare rule (HTML, not JSON) still reads nicely", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status: 429, contentType: "text/html", body: "<html><body>Too many requests</body></html>" })
    );
    await page.goto("/mortgage/");
    const form = page.locator("form").filter({ has: page.locator("#firstName") });
    await form.locator("#firstName").fill("Dan");
    await form.locator("#lastName").fill("Ray");
    await form.locator("#email").fill("dan@example.com");
    await form.locator("#message").fill("We need a mortgage website soon.");
    await form.getByRole("button", { name: /send inquiry/i }).click();
    await expect(page.getByText(/wait about 10 minutes/i)).toBeVisible();
  });

  test("template request shows the 429 message and keeps the answers", async ({ page }) => {
    await page.route("**/api/template-intake", (route) =>
      route.fulfill({ status: 429, contentType: "text/html", body: "rate limited" })
    );
    await page.goto("/start/rate-ready/");
    await page.locator("#name").fill("Maria Lopez");
    await page.locator("#email").fill("maria@example.com");
    await page.locator("#businessName").fill("Lopez Home Loans");
    await page.getByRole("button", { name: /^continue/i }).click();
    await page.getByRole("button", { name: /skip this/i }).click();
    await page.getByRole("button", { name: /skip photos/i }).click();
    await page.getByText("Yes, send me a quote for this website and contact me about it").click();
    await page.getByRole("button", { name: /send my request/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: "wait about 10 minutes" })).toBeVisible();
  });
});

test.describe("no online checkout", () => {
  test("/checkout/ forwards to the project brief and stays out of search", async ({ page, request }) => {
    const html = await (await request.get("/checkout/")).text();
    expect(html).toMatch(/<meta name="robots" content="noindex/);
    expect(html).toMatch(/<meta http-equiv="refresh" content="0;url=\/contact\/"/);
    await page.goto("/checkout/?template=mortgage-broker");
    await page.waitForURL(/\/contact\/?$/);
    await expect(page.getByRole("heading", { name: /tell us about your website/i })).toBeVisible();
  });

  test("/checkout/success/ explains, links to the brief and is noindex", async ({ page }) => {
    await page.goto("/checkout/success/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[http-equiv="refresh"]')).toHaveAttribute("content", /url=\/contact\//);
    await expect(page.getByRole("link", { name: /start a project/i }).first()).toBeVisible();
  });

  for (const path of ["/", "/mortgage/", "/templates/", "/templates/mortgage-broker/", "/real-estate/"]) {
    test(`${path} shows starting prices only`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator("main, body").first().innerText()).replace(/\s+/g, " ");
      expect(text).not.toMatch(/fees & processing|checkout|buy now|\bflat\b/i);
      expect(text).toMatch(/Starting at \$/);
    });
  }
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

  test("410: checkout is retired and never starts a payment", async ({ request }) => {
    const r = await request.post("/api/checkout", { data: {} });
    expect(r.status()).toBe(410);
    expect((await r.json()).code).toBe("checkout_retired");
  });
});

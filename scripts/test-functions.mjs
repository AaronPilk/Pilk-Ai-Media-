#!/usr/bin/env node
// Runs the Pages Functions (built by wrangler, exactly as they deploy) in Node
// with `fetch` replaced by a recorder, and checks what each form would send to
// Resend, GoHighLevel, Supabase and Stripe. Nothing leaves the machine: any
// request to a host not listed in `respond` fails the run.
//
//   node scripts/test-functions.mjs
//
// The browser-level tests (every form, submitted against `wrangler pages dev`
// with no provider keys) are in e2e/lead-forms.spec.ts.
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SMS_VERSION = "sms-v1-2026-11-13";
const RENEWAL_VERSION = "renewal-v1-2026-11-13";

const outdir = mkdtempSync(path.join(tmpdir(), "pilk-fn-"));
execFileSync("npx", ["wrangler", "pages", "functions", "build", "--outdir", outdir], {
  stdio: ["ignore", "ignore", "inherit"],
  env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
});
const worker = (await import(pathToFileURL(path.join(outdir, "index.js")).href)).default;
rmSync(outdir, { recursive: true, force: true });

/** @type {{ url: string, method: string, headers: Record<string,string>, body: string }[]} */
let calls = [];
let ghlUpsertStatus = 201;

function respond(url, method) {
  const u = new URL(url);
  const ok = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  if (u.host === "api.resend.com") return ok({ id: "email_test" });
  if (u.host === "services.leadconnectorhq.com" && u.pathname === "/contacts/upsert")
    return ghlUpsertStatus < 300 ? ok({ new: true, contact: { id: "ghl_contact_1" } }, 201) : ok({ message: "down" }, ghlUpsertStatus);
  if (u.host === "services.leadconnectorhq.com" && /^\/contacts\/[^/]+\/notes$/.test(u.pathname)) return ok({ note: { id: "n1" } }, 201);
  if (u.host === "supabase.test") return new Response(null, { status: 201 });
  if (u.host === "api.stripe.com") {
    if (u.pathname === "/v1/checkout/sessions") return ok({ id: "cs_test_1", url: "https://checkout.stripe.test/cs_test_1" });
    if (u.pathname.startsWith("/v1/payment_intents/")) return ok({ id: "pi_1", payment_method: "pm_1" });
    if (u.pathname === "/v1/prices" && method === "GET") return ok({ data: [{ id: "price_monthly" }] });
    if (u.pathname === "/v1/subscriptions") return ok({ id: "sub_1" });
  }
  throw new Error(`unexpected outbound request: ${method} ${url}`);
}

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const method = (init.method ?? "GET").toUpperCase();
  const headers = Object.fromEntries(new Headers(init.headers ?? {}).entries());
  const body = typeof init.body === "string" ? init.body : init.body == null ? "" : String(init.body);
  calls.push({ url, method, headers, body });
  return respond(url, method);
};

const ctx = { waitUntil() {}, passThroughOnException() {} };
const baseEnv = {
  ASSETS: { fetch: async () => new Response("not found", { status: 404 }) },
  LEADS_FROM_EMAIL: "Pilk.ai <orders@pilk.ai>",
  LEADS_NOTIFICATION_EMAIL: "owner@example.test",
  RESEND_API_KEY: "re_test",
  GHL_PIT_TOKEN: "pit_test",
  GHL_LOCATION_ID: "loc_test",
};

async function call(pathname, { json, form, env = baseEnv, headers = {} } = {}) {
  calls = [];
  const init = { method: "POST", headers: { "cf-connecting-ip": "203.0.113.7", "user-agent": "TestBrowser/1.0", ...headers } };
  if (json !== undefined) {
    init.headers["content-type"] = "application/json";
    init.body = typeof json === "string" ? json : JSON.stringify(json);
  } else if (form) {
    init.body = form;
  }
  const res = await worker.fetch(new Request(`https://pilk.ai${pathname}`, init), env, ctx);
  return { status: res.status, body: await res.json().catch(() => null), calls };
}

const resend = (cs) => cs.filter((c) => c.url.startsWith("https://api.resend.com")).map((c) => JSON.parse(c.body));
const ghl = (cs) => cs.filter((c) => c.url.startsWith("https://services.leadconnectorhq.com"));
const upsert = (cs) => ghl(cs).filter((c) => c.url.endsWith("/contacts/upsert")).map((c) => JSON.parse(c.body));
const notes = (cs) => ghl(cs).filter((c) => c.url.includes("/notes"));

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (e) {
    console.log(`  FAIL ${name}\n       ${e.message.split("\n").join("\n       ")}`);
    process.exitCode = 1;
  }
}

const quiet = console.log;
const silence = (fn) => async () => {
  const log = console.log, err = console.error;
  console.log = () => {}; console.error = () => {};
  try { await fn(); } finally { console.log = log; console.error = err; }
};

quiet("leads: SMS consent recording");

await test("quick inquiry with SMS consent: email record, GHL tag and note", silence(async () => {
  const r = await call("/api/leads", {
    json: {
      formType: "inquiry", name: "Maria Lopez", email: "maria@example.com", phone: "(727) 555-0100",
      message: "Need a site", smsConsent: true, smsConsentVersion: SMS_VERSION,
      pageUrl: "https://pilk.ai/inquiry/?utm_source=x",
    },
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { success: true });
  const [internal, prospect] = resend(r.calls);
  assert.equal(internal.to, "owner@example.test");
  assert.match(internal.subject, /^New quick inquiry — Maria Lopez$/);
  assert.match(internal.html, /Text messages: YES/);
  assert.match(internal.html, /Given: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  assert.match(internal.html, /Page: https:\/\/pilk\.ai\/inquiry\/</, "page URL without the query string");
  assert.match(internal.html, new RegExp(`<code>${SMS_VERSION}</code>`));
  assert.match(internal.html, /IP address: 203\.0\.113\.7/);
  assert.match(internal.html, /Text me at the number above\. I agree that Pilk\.ai \(Pilk Consulting LLC\)/);
  assert.equal(prospect.to, "maria@example.com");
  const [u] = upsert(r.calls);
  assert.deepEqual(u.tags, ["pilk-website-lead", "quick-inquiry", "sms-consent"]);
  assert.equal(u.firstName, "Maria");
  assert.equal(u.lastName, "Lopez");
  assert.equal(u.phone, "(727) 555-0100");
  const [n] = notes(r.calls);
  assert.ok(n, "a note was posted");
  assert.match(n.url, /\/contacts\/ghl_contact_1\/notes$/);
  const note = JSON.parse(n.body).body;
  for (const re of [
    /^SMS consent: YES/, /Given: \d{4}-\d{2}-\d{2}T[\d:.]+Z/, /Form: Quick inquiry/, /Page: https:\/\/pilk\.ai\/inquiry\/$/m,
    new RegExp(`Consent wording version: ${SMS_VERSION}`), /Wording shown: "Text me at the number above\./,
    /IP address: 203\.0\.113\.7/, /Browser: TestBrowser\/1\.0/, /Phone: \(727\) 555-0100/,
  ]) assert.match(note, re);
}));

await test("no SMS box ticked: no tag, no note, email says not agreed", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.match(resend(r.calls)[0].html, /Text messages: NOT agreed/);
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-website-lead", "quick-inquiry"]);
  assert.equal(notes(r.calls).length, 0);
}));

await test("box ticked without a phone number is not consent", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.match(resend(r.calls)[0].html, /Text messages: no\.<\/strong> No phone number given/);
  assert.equal(notes(r.calls).length, 0);
  assert.ok(!upsert(r.calls)[0].tags.includes("sms-consent"));
}));

await test("unknown wording version is not consent", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: "made-up" } });
  assert.equal(r.status, 200);
  assert.ok(!upsert(r.calls)[0].tags.includes("sms-consent"));
  assert.equal(notes(r.calls).length, 0);
}));

await test("contact form with consent: tags carry the project type", silence(async () => {
  const r = await call("/api/leads", {
    json: {
      formType: "contact", firstName: "Dan", lastName: "Ray", email: "dan@example.com", phone: "813-555-0101",
      projectType: "template", message: "We need a mortgage site soon.", smsConsent: true, smsConsentVersion: SMS_VERSION,
      pageUrl: "https://pilk.ai/mortgage/",
    },
  });
  assert.equal(r.status, 200);
  const [internal] = resend(r.calls);
  assert.match(internal.subject, /New website inquiry — Dan Ray/);
  assert.match(internal.html, /Project details:<\/strong> We need a mortgage site soon\./);
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-website-lead", "template", "sms-consent"]);
  assert.match(JSON.parse(notes(r.calls)[0].body).body, /Form: Contact form \(mortgage \/ real estate page\)/);
}));

await test("showing request: phone only (no email) is accepted, no prospect email", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "listing-showing", name: "Sam", phone: "727 555 0102", preferredDate: "2026-12-01", timeSlot: "11:00 AM", listing: "20 Bayshore Terrace" } });
  assert.equal(r.status, 200);
  const emails = resend(r.calls);
  assert.equal(emails.length, 1, "internal only");
  assert.match(emails[0].html, /2026-12-01 at 11:00 AM/);
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-website-lead", "listing-demo-showing"]);
}));

await test("GHL unconfigured: lead still accepted, no GHL calls", silence(async () => {
  const env = { ...baseEnv, GHL_PIT_TOKEN: undefined };
  const r = await call("/api/leads", { env, json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.equal(ghl(r.calls).length, 0);
  assert.match(resend(r.calls)[0].html, /Text messages: YES/, "consent still recorded in the email");
}));

await test("GHL down: lead still accepted, no note attempted", silence(async () => {
  ghlUpsertStatus = 500;
  try {
    const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION } });
    assert.equal(r.status, 200);
    assert.equal(notes(r.calls).length, 0);
  } finally {
    ghlUpsertStatus = 201;
  }
}));

await test("nothing sent at all when no provider keys are set (the local preview setup)", silence(async () => {
  const env = { ASSETS: baseEnv.ASSETS, LEADS_FROM_EMAIL: baseEnv.LEADS_FROM_EMAIL, LEADS_NOTIFICATION_EMAIL: "x@example.test", GHL_LOCATION_ID: "loc" };
  const r = await call("/api/leads", { env, json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.equal(r.calls.length, 0);
}));

quiet("leads: project brief (the form that already worked)");

await test("multipart brief without formType still works; Supabase row keeps the old shape", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({
    firstName: "Test", lastName: "User", email: "t@example.com", phone: "7275550100", currentWebsite: "",
    businessDescription: "We sell premium homes in Tampa Bay.", projectType: "custom", consent: true,
    smsConsent: true, smsConsentVersion: SMS_VERSION, pageUrl: "https://pilk.ai/contact/",
  }));
  fd.append("files", new File([new Uint8Array([137, 80, 78, 71])], "logo.png", { type: "image/png" }));
  const env = { ...baseEnv, SUPABASE_URL: "https://supabase.test", SUPABASE_SERVICE_ROLE_KEY: "srk" };
  const r = await call("/api/leads", { form: fd, env });
  assert.equal(r.status, 200);
  const row = JSON.parse(r.calls.find((c) => c.url.startsWith("https://supabase.test")).body);
  for (const k of ["formType", "smsConsent", "smsConsentVersion", "pageUrl"]) assert.ok(!(k in row), `row has no ${k}`);
  assert.equal(row.businessDescription, "We sell premium homes in Tampa Bay.");
  const [internal, prospect] = resend(r.calls);
  assert.equal(internal.subject, "New website brief — Test User");
  assert.equal(internal.attachments.length, 1);
  assert.match(internal.html, /I agree to be contacted about my website project/);
  assert.equal(prospect.subject, "We received your website brief — Pilk.ai");
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-website-lead", "custom", "sms-consent"]);
}));

await test("brief still requires its fields (business description, consent)", silence(async () => {
  const r = await call("/api/leads", { json: { firstName: "T", lastName: "U", email: "t@example.com", projectType: "unsure", consent: false } });
  assert.equal(r.status, 400);
  assert.equal(r.calls.length, 0);
  assert.ok(r.body.issues.fieldErrors.businessDescription);
  assert.ok(r.body.issues.fieldErrors.consent);
}));

quiet("leads: junk is rejected before anything is sent");

const rejects = [
  ["missing name", { formType: "inquiry", name: "", email: "a@example.com" }],
  ["no email and no phone", { formType: "inquiry", name: "A" }],
  ["phone with too few digits and no email", { formType: "inquiry", name: "A", phone: "123" }],
  ["bad email", { formType: "listing-inquiry", name: "A", email: "nope" }],
  ["name too long", { formType: "inquiry", name: "x".repeat(121), email: "a@example.com" }],
  ["message too long", { formType: "inquiry", name: "A", email: "a@example.com", message: "x".repeat(2001) }],
  ["showing without a slot", { formType: "listing-showing", name: "A", email: "a@example.com", preferredDate: "2026-12-01" }],
  ["showing with a made-up slot", { formType: "listing-showing", name: "A", email: "a@example.com", preferredDate: "2026-12-01", timeSlot: "3 AM" }],
  ["contact form without a message", { formType: "contact", firstName: "A", lastName: "B", email: "a@example.com", projectType: "unsure", message: "" }],
  ["unknown form type", { formType: "nope", name: "A", email: "a@example.com" }],
  ["array body", [1, 2, 3]],
];
for (const [name, body] of rejects) {
  await test(`400: ${name}`, silence(async () => {
    const r = await call("/api/leads", { json: body });
    assert.equal(r.status, 400, JSON.stringify(r.body));
    assert.equal(r.body.success, false);
    assert.equal(r.calls.length, 0);
  }));
}

await test("400: invalid JSON", silence(async () => {
  const r = await call("/api/leads", { json: "{nope" });
  assert.equal(r.status, 400);
}));

await test("413: oversized JSON body", silence(async () => {
  const r = await call("/api/leads", { json: JSON.stringify({ formType: "inquiry", name: "A", email: "a@example.com", message: "x".repeat(70_000) }) });
  assert.equal(r.status, 413);
  assert.equal(r.calls.length, 0);
}));

await test("400: files sent with a form that doesn't take them", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({ formType: "inquiry", name: "A", email: "a@example.com" }));
  fd.append("files", new File(["x"], "a.png", { type: "image/png" }));
  const r = await call("/api/leads", { form: fd });
  assert.equal(r.status, 400);
  assert.equal(r.calls.length, 0);
}));

await test("honeypot filled: answers success, sends nothing", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Bot", email: "bot@example.com", honeypot: "x" } });
  assert.equal(r.status, 200);
  assert.equal(r.calls.length, 0);
}));

quiet("template intake");

await test("template order with SMS consent: email block, GHL tag and note", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({
    name: "Maria Lopez", email: "maria@example.com", businessName: "Lopez Home Loans", consent: true,
    phone: "(727) 555-0100", smsConsent: true, smsConsentVersion: SMS_VERSION, pageUrl: "https://pilk.ai/start/rate-ready/",
    templateSlug: "rate-ready", templateName: "Rate Ready",
  }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  const [internal] = resend(r.calls);
  assert.match(internal.html, /Yes, build my website and contact me about it/);
  assert.match(internal.html, /Text messages: YES/);
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-template-intake", "rate-ready", "sms-consent"]);
  assert.match(JSON.parse(notes(r.calls)[0].body).body, /Form: Template order \(Rate Ready\)/);
}));

await test("template order without SMS consent still works (unchanged path)", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({ name: "Ann", email: "ann@example.com", businessName: "Ann Co", consent: true, templateSlug: "rate-ready" }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  assert.deepEqual(upsert(r.calls)[0].tags, ["pilk-template-intake", "rate-ready"]);
  assert.equal(notes(r.calls).length, 0);
}));

await test("template order honeypot filled: answers success, sends nothing", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({ name: "Bot", email: "bot@example.com", businessName: "Bot Co", consent: true, honeypot: "x" }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  assert.equal(r.calls.length, 0);
}));

quiet("checkout and webhook");

const stripeEnv = { ...baseEnv, STRIPE_SECRET_KEY: "sk_test_x", STRIPE_WEBHOOK_SECRET: "whsec_test" };

await test("checkout without the renewal box: 400, Stripe never called", silence(async () => {
  const r = await call("/api/checkout", { env: stripeEnv, json: { addons: ["rush"], template: "rate-ready" } });
  assert.equal(r.status, 400);
  assert.equal(r.body.code, "renewal_consent_required");
  assert.equal(r.calls.length, 0);
}));

await test("checkout with the box: consent goes to Stripe as metadata, fee line unchanged", silence(async () => {
  const r = await call("/api/checkout", {
    env: stripeEnv,
    json: { addons: ["rush"], template: "rate-ready", renewalConsent: true, renewalConsentVersion: RENEWAL_VERSION },
  });
  assert.equal(r.status, 200);
  assert.equal(r.body.url, "https://checkout.stripe.test/cs_test_1");
  const p = new URLSearchParams(r.calls[0].body);
  assert.equal(p.get("metadata[renewal_consent]"), "true");
  assert.equal(p.get("metadata[renewal_consent_version]"), RENEWAL_VERSION);
  assert.match(p.get("metadata[renewal_consent_at]"), /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
  assert.equal(p.get("line_items[2][price_data][product_data][name]"), "Fees & processing (10%)");
  assert.equal(p.get("line_items[2][price_data][unit_amount]"), "6000", "10% of $600");
}));

await test("paid webhook: subscription carries consent; order and customer emails", silence(async () => {
  const created = Math.floor(Date.UTC(2026, 10, 13, 15) / 1000);
  const event = {
    type: "checkout.session.completed",
    data: { object: {
      id: "cs_test_1", mode: "payment", payment_status: "paid", customer: "cus_1", payment_intent: "pi_1",
      amount_total: 66000, created, customer_details: { email: "buyer@example.com" },
      metadata: {
        start_monthly: "true", template: "rate-ready", addons: "rush", renewal_consent: "true",
        renewal_consent_version: RENEWAL_VERSION, renewal_consent_at: "2026-11-13T15:00:00.000Z",
      },
    } },
  };
  const payload = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", "whsec_test").update(`${t}.${payload}`).digest("hex");
  const r = await call("/api/stripe-webhook", { env: stripeEnv, json: payload, headers: { "stripe-signature": `t=${t},v1=${sig}` } });
  assert.equal(r.status, 200);
  const sub = new URLSearchParams(r.calls.find((c) => c.url.endsWith("/v1/subscriptions")).body);
  assert.equal(sub.get("trial_period_days"), "30");
  assert.equal(sub.get("metadata[renewal_consent]"), "true");
  assert.equal(sub.get("metadata[renewal_consent_version]"), RENEWAL_VERSION);
  const emails = resend(r.calls);
  const order = emails.find((e) => e.to === "owner@example.test");
  assert.match(order.html, /I agree to the \$100\/month hosting plan starting 30 days after purchase, renewing monthly until I cancel\./);
  assert.match(order.html, /December 13, 2026/);
  const customer = emails.find((e) => e.to === "buyer@example.com");
  assert.ok(customer, "customer acknowledgment sent");
  assert.match(customer.html, /first \$100 charge is on December 13, 2026/);
  assert.match(customer.html, /renews automatically every month/);
  assert.match(customer.html, /mailto:Aaron@pilk\.ai\?subject=Cancel%20my%20hosting%20plan/);
}));

await test("webhook with a bad signature: 400, nothing created", silence(async () => {
  const r = await call("/api/stripe-webhook", { env: stripeEnv, json: "{}", headers: { "stripe-signature": "t=1,v1=00" } });
  assert.equal(r.status, 400);
  assert.equal(r.calls.length, 0);
}));

console.log(`\n${passed} passed${process.exitCode ? ", some FAILED" : ""}`);

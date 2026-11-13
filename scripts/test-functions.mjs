#!/usr/bin/env node
// Runs the Pages Functions (built by wrangler, exactly as they deploy) in Node
// with `fetch` replaced by a recorder, and checks what each form would send to
// Resend, GoHighLevel (contact, tags, custom fields, the PILK AI pipeline and
// the note), Supabase and Stripe, plus the per-IP rate limit and the retired
// checkout. Nothing leaves the machine: any request to a host not listed in
// `respond` fails the run.
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
// What the fake GoHighLevel answers. Tests change these and reset() puts them back.
const ghlState = {};
function reset() {
  Object.assign(ghlState, {
    upsertStatus: 201,
    tagsStatus: 201,
    noteStatus: 201,
    searchStatus: 200,
    createStatus: 201,
    updateStatus: 200,
    existing: [], // opportunities the search returns
    hold: null, // a promise every GHL request waits on (to prove nobody waits for GHL)
  });
}
reset();

const STAGES = {
  newLead: "d59f55de-0454-4a91-97e0-db0d22912c3a",
  intake: "c6b24259-eb67-4b38-98ec-ff3f288a7e43",
  awaitingPayment: "f8e5afbf-94f9-476f-b0aa-fc1be8c36b9a",
  paid: "56014ae0-4a44-4790-89f7-b002fd39bcd8",
  inBuild: "2a58c21b-e142-46b2-86ec-34d0d45f38b3",
  live: "e57c3bd1-2560-4a05-ae0a-d283f84335b9",
  upsell: "49083e8e-7259-4f29-a17f-0163c243c675",
  active: "1da99b94-9f43-44b6-980e-262671844104",
  lost: "64681146-391c-4e54-8061-61abc7dd1704",
};
const PIPELINE = "b5MOhnwFWpcxyE2s9HS6";
const FIELD = {
  templateChosen: "6gTNA2dWOj1B42zWCwMK",
  serviceArea: "6iGwqudyrBXFDvyDtcDl",
  websiteUrl: "Z7aH8hTfElbrgAwY2lN7",
  utmSource: "xdzkeIZzKaYh8osvDPLq",
  utmMedium: "U1nHfmtNW8YSFPrYJ2Jc",
  utmCampaign: "Pq9gAzR9Lqj8JCoBKwSR",
  googleClickId: "daCb9Q8Pu9iuy5r9jku8",
  sourcePath: "id4Ti8l8VyKTqIAnI3vb",
  timeline: "dLJTGCwpNRtcjDKdYqxJ",
  consentVersion: "Nkt8JgJj2CtYVQ4MNcJB",
  consentAt: "eML577wowahPcDZfnitF",
  leadIntent: "9jphm36XMQsBiFxt4TCE",
};

function respond(url, method) {
  const u = new URL(url);
  const ok = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  const fail = (status) => ok({ statusCode: status, message: "fake GHL failure for maria@example.com" }, status);
  if (u.host === "api.resend.com") return ok({ id: "email_test" });
  if (u.host === "services.leadconnectorhq.com") {
    if (u.pathname === "/contacts/upsert")
      return ghlState.upsertStatus < 300 ? ok({ new: true, contact: { id: "ghl_contact_1" } }, 201) : fail(ghlState.upsertStatus);
    if (/^\/contacts\/[^/]+\/tags$/.test(u.pathname))
      return ghlState.tagsStatus < 300 ? ok({ tags: [] }, 201) : fail(ghlState.tagsStatus);
    if (/^\/contacts\/[^/]+\/notes$/.test(u.pathname))
      return ghlState.noteStatus < 300 ? ok({ note: { id: "n1" } }, 201) : fail(ghlState.noteStatus);
    if (u.pathname === "/opportunities/search" && method === "GET")
      return ghlState.searchStatus < 300 ? ok({ opportunities: ghlState.existing, meta: { total: ghlState.existing.length } }) : fail(ghlState.searchStatus);
    if (u.pathname === "/opportunities/" && method === "POST")
      return ghlState.createStatus < 300 ? ok({ opportunity: { id: "opp_new" } }, 201) : fail(ghlState.createStatus);
    if (/^\/opportunities\/[^/]+$/.test(u.pathname) && method === "PUT")
      return ghlState.updateStatus < 300 ? ok({ opportunity: { id: u.pathname.split("/").pop() } }) : fail(ghlState.updateStatus);
  }
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
  if (ghlState.hold && url.startsWith("https://services.leadconnectorhq.com")) await ghlState.hold;
  return respond(url, method);
};

// The functions hand GHL work to waitUntil so the visitor never waits on it.
// The harness collects those promises and settles them before inspecting calls.
let pending = [];
const ctx = { waitUntil(p) { pending.push(p); }, passThroughOnException() {} };
const baseEnv = {
  ASSETS: { fetch: async () => new Response("not found", { status: 404 }) },
  LEADS_FROM_EMAIL: "Pilk.ai <orders@pilk.ai>",
  LEADS_NOTIFICATION_EMAIL: "owner@example.test",
  RESEND_API_KEY: "re_test",
  GHL_PIT_TOKEN: "pit_test",
  GHL_LOCATION_ID: "loc_test",
  GHL_PIPELINE_ID: PIPELINE,
  GHL_STAGE_NEW_LEAD: STAGES.newLead,
  GHL_STAGE_INTAKE_COMPLETED: STAGES.intake,
  GHL_STAGE_LOST: STAGES.lost,
  GHL_STAGE_ORDER: Object.values(STAGES).join(","),
  FORM_RATE_LIMIT_MAX: "5",
  FORM_RATE_LIMIT_WINDOW_SECONDS: "600",
};

async function call(pathname, { json, form, env = baseEnv, headers = {}, method = "POST" } = {}) {
  calls = [];
  pending = [];
  const init = { method, headers: { "cf-connecting-ip": "203.0.113.7", "user-agent": "TestBrowser/1.0", ...headers } };
  if (json !== undefined) {
    init.headers["content-type"] = "application/json";
    init.body = typeof json === "string" ? json : JSON.stringify(json);
  } else if (form) {
    init.body = form;
  }
  const res = await worker.fetch(new Request(`https://pilk.ai${pathname}`, init), env, ctx);
  const body = await res.json().catch(() => null);
  await Promise.allSettled(pending);
  return { status: res.status, headers: res.headers, body, calls };
}

const resend = (cs) => cs.filter((c) => c.url.startsWith("https://api.resend.com")).map((c) => JSON.parse(c.body));
const ghl = (cs) => cs.filter((c) => c.url.startsWith("https://services.leadconnectorhq.com"));
const upsert = (cs) => ghl(cs).filter((c) => c.url.endsWith("/contacts/upsert")).map((c) => JSON.parse(c.body));
const tagCalls = (cs) => ghl(cs).filter((c) => /\/contacts\/[^/]+\/tags$/.test(c.url));
const tagsSent = (cs) => tagCalls(cs).flatMap((c) => JSON.parse(c.body).tags);
const notes = (cs) => ghl(cs).filter((c) => c.url.includes("/notes"));
const noteText = (cs) => JSON.parse(notes(cs)[0].body).body;
const searches = (cs) => ghl(cs).filter((c) => c.url.includes("/opportunities/search"));
const creates = (cs) => ghl(cs).filter((c) => c.method === "POST" && new URL(c.url).pathname === "/opportunities/").map((c) => JSON.parse(c.body));
const updates = (cs) => ghl(cs).filter((c) => c.method === "PUT" && c.url.includes("/opportunities/"));
/** GHL calls as "METHOD /path", in order, for asserting the exact sequence. */
const ghlSequence = (cs) => ghl(cs).map((c) => `${c.method} ${new URL(c.url).pathname}`);
/** customFields of the first upsert as { fieldId: value } */
const fieldsOf = (cs) => Object.fromEntries((upsert(cs)[0].customFields ?? []).map((f) => [f.id ?? f.key, f.field_value]));

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (e) {
    console.log(`  FAIL ${name}\n       ${e.message.split("\n").join("\n       ")}`);
    process.exitCode = 1;
  } finally {
    reset();
  }
}

const quiet = console.log;
let logged = [];
const silence = (fn) => async () => {
  const log = console.log, err = console.error;
  logged = [];
  console.log = (...a) => logged.push(a.join(" ")); console.error = (...a) => logged.push(a.join(" "));
  try { await fn(); } finally { console.log = log; console.error = err; }
};

/** A tiny in-memory caches.default, enough for the rate limiter. */
function fakeCache({ broken = false } = {}) {
  const store = new Map();
  return {
    store,
    default: {
      async match(req) {
        if (broken) throw new Error("cache down");
        const hit = store.get(typeof req === "string" ? req : req.url);
        return hit ? new Response(hit) : undefined;
      },
      async put(req, res) {
        if (broken) throw new Error("cache down");
        store.set(typeof req === "string" ? req : req.url, await res.text());
      },
    },
  };
}
async function withCache(cache, fn) {
  globalThis.caches = cache;
  try { await fn(); } finally { delete globalThis.caches; }
}

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
  assert.ok(!("tags" in u), "the upsert never carries tags (GHL would replace the whole set)");
  assert.equal(u.firstName, "Maria");
  assert.equal(u.lastName, "Lopez");
  assert.equal(u.phone, "(727) 555-0100");
  assert.deepEqual(tagsSent(r.calls), ["pilk-website-lead", "quick-inquiry", "pilk-form-inquiry", "sms-consent"]);
  assert.match(tagCalls(r.calls)[0].url, /\/contacts\/ghl_contact_1\/tags$/);
  const [n] = notes(r.calls);
  assert.ok(n, "a note was posted");
  assert.match(n.url, /\/contacts\/ghl_contact_1\/notes$/);
  const note = JSON.parse(n.body).body;
  for (const re of [
    /^pilk\.ai lead: Quick inquiry/, /^SMS consent: YES/m, /Given: \d{4}-\d{2}-\d{2}T[\d:.]+Z/, /Form: Quick inquiry/,
    /Page: https:\/\/pilk\.ai\/inquiry\/$/m, new RegExp(`Consent wording version: ${SMS_VERSION}`),
    /Wording shown: "Text me at the number above\./, /IP address: 203\.0\.113\.7/, /Browser: TestBrowser\/1\.0/,
    /Phone: \(727\) 555-0100/, /Terms & Privacy: submitted below/, /Message: Need a site/, /Form page: https:\/\/pilk\.ai\/inquiry\/$/m,
  ]) assert.match(note, re);
  const f = fieldsOf(r.calls);
  assert.equal(f[FIELD.consentVersion], SMS_VERSION);
  assert.match(f[FIELD.consentAt], /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
  assert.equal(f[FIELD.leadIntent], "inquiry");
  assert.equal(f[FIELD.sourcePath], "/inquiry/");
}));

await test("no SMS box ticked: no consent tag or fields, note says not agreed", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.match(resend(r.calls)[0].html, /Text messages: NOT agreed/);
  assert.deepEqual(tagsSent(r.calls), ["pilk-website-lead", "quick-inquiry", "pilk-form-inquiry"]);
  const f = fieldsOf(r.calls);
  assert.ok(!(FIELD.consentVersion in f) && !(FIELD.consentAt in f), "never clears an earlier consent record");
  assert.match(noteText(r.calls), /SMS consent: NOT agreed/);
}));

await test("box ticked without a phone number is not consent", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.match(resend(r.calls)[0].html, /Text messages: no\.<\/strong> No phone number given/);
  assert.match(noteText(r.calls), /SMS consent: no \(no phone number given\)/);
  assert.ok(!tagsSent(r.calls).includes("sms-consent"));
}));

await test("unknown wording version is not consent", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: "made-up" } });
  assert.equal(r.status, 200);
  assert.ok(!tagsSent(r.calls).includes("sms-consent"));
  assert.ok(!(FIELD.consentVersion in fieldsOf(r.calls)));
  assert.doesNotMatch(noteText(r.calls), /SMS consent: YES/);
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
  assert.deepEqual(tagsSent(r.calls), ["pilk-website-lead", "template", "pilk-form-contact", "sms-consent"]);
  assert.match(noteText(r.calls), /Form: Contact form \(mortgage \/ real estate page\)/);
}));

await test("showing request: phone only (no email) is accepted, no prospect email", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "listing-showing", name: "Sam", phone: "727 555 0102", preferredDate: "2026-12-01", timeSlot: "11:00 AM", listing: "20 Bayshore Terrace" } });
  assert.equal(r.status, 200);
  const emails = resend(r.calls);
  assert.equal(emails.length, 1, "internal only");
  assert.match(emails[0].html, /2026-12-01 at 11:00 AM/);
  assert.deepEqual(tagsSent(r.calls), ["pilk-website-lead", "listing-demo-showing", "pilk-form-listing-showing"]);
  assert.equal(creates(r.calls)[0].pipelineStageId, STAGES.newLead);
  assert.match(creates(r.calls)[0].name, /^Sam — Listing demo showing$/);
}));

await test("GHL unconfigured: lead still accepted, no GHL calls", silence(async () => {
  const env = { ...baseEnv, GHL_PIT_TOKEN: undefined };
  // (no token: sendToGhl stops before any request)
  const r = await call("/api/leads", { env, json: { formType: "inquiry", name: "Ann", email: "ann@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.equal(ghl(r.calls).length, 0);
  assert.match(resend(r.calls)[0].html, /Text messages: YES/, "consent still recorded in the email");
}));

await test("GHL answers 500: the visitor still gets 200, nothing else is attempted, logs carry no PII", silence(async () => {
  ghlState.upsertStatus = 500;
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Maria Lopez", email: "maria@example.com", phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION } });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { success: true });
  assert.equal(resend(r.calls).length, 2, "the email (the authoritative copy) still went");
  assert.deepEqual(ghlSequence(r.calls), ["POST /contacts/upsert"]);
  const logs = logged.filter((l) => l.startsWith("[ghl]")).join("\n");
  assert.match(logs, /\[ghl\] upsert failed status=500/);
  for (const pii of ["maria@example.com", "Maria", "7275550100", "fake GHL failure"]) assert.ok(!logs.includes(pii), `log leaks ${pii}`);
}));

await test("the visitor never waits on GHL: a hung GHL still gets a 200, the work finishes in waitUntil", silence(async () => {
  let release;
  ghlState.hold = new Promise((r) => (release = r));
  calls = [];
  pending = [];
  const req = new Request("https://pilk.ai/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.7" },
    body: JSON.stringify({ formType: "inquiry", name: "Ann", email: "ann@example.com" }),
  });
  const res = await worker.fetch(req, baseEnv, ctx); // would hang here if GHL were awaited
  assert.equal(res.status, 200);
  assert.ok(resend(calls).length > 0, "the email went before the response");
  assert.equal(pending.length, 1, "GHL handed to waitUntil");
  assert.equal(notes(calls).length, 0, "GHL work still in flight when the visitor got their answer");
  release();
  await Promise.allSettled(pending);
  assert.equal(notes(calls).length, 1, "and it completes afterwards");
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
  assert.deepEqual(tagsSent(r.calls), ["pilk-website-lead", "custom", "pilk-form-brief", "sms-consent"]);
  assert.match(noteText(r.calls), /Files: logo\.png \(0 KB\)/);
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

quiet("template request (the old template order)");

await test("template request with SMS consent: email, tags, fields, Intake Completed opportunity valued at its starting price", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({
    name: "Maria Lopez", email: "maria@example.com", businessName: "Lopez Home Loans", consent: true,
    phone: "(727) 555-0100", smsConsent: true, smsConsentVersion: SMS_VERSION, pageUrl: "https://pilk.ai/start/rate-ready/",
    templateSlug: "rate-ready", templateName: "RateReady", serviceArea: "Tampa Bay",
    links: ["instagram.com/lopezloans", "lopezloans.com"], utmSource: "google", utmMedium: "cpc", utmCampaign: "fall", gclid: "G-123",
  }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  const [internal, client] = resend(r.calls);
  assert.match(internal.subject, /^Template request — RateReady — Maria Lopez$/);
  assert.match(internal.html, /Yes, send me a quote for this website and contact me about it/);
  assert.match(internal.html, /nothing was charged/);
  assert.match(internal.html, /Text messages: YES/);
  assert.match(client.subject, /request/);
  assert.doesNotMatch(client.html + internal.html + client.subject + internal.subject, /\bcheckout\b|\border\b/i);
  assert.deepEqual(ghlSequence(r.calls), [
    "POST /contacts/upsert", "POST /contacts/ghl_contact_1/tags", "GET /opportunities/search", "POST /opportunities/", "POST /contacts/ghl_contact_1/notes",
  ]);
  assert.ok(!("tags" in upsert(r.calls)[0]));
  assert.deepEqual(tagsSent(r.calls), ["pilk-template-intake", "rate-ready", "pilk-form-template-request", "sms-consent"]);
  const f = fieldsOf(r.calls);
  assert.equal(f[FIELD.templateChosen], "rate-ready");
  assert.equal(f[FIELD.serviceArea], "Tampa Bay");
  assert.equal(f[FIELD.websiteUrl], "https://lopezloans.com/", "skips the social link");
  assert.equal(f[FIELD.utmSource], "google");
  assert.equal(f[FIELD.utmMedium], "cpc");
  assert.equal(f[FIELD.utmCampaign], "fall");
  assert.equal(f[FIELD.googleClickId], "G-123");
  assert.equal(f[FIELD.sourcePath], "/start/rate-ready/");
  assert.equal(f[FIELD.leadIntent], "template-request");
  assert.equal(f[FIELD.consentVersion], SMS_VERSION);
  const [opp] = creates(r.calls);
  assert.deepEqual(opp, {
    pipelineId: PIPELINE, locationId: "loc_test", contactId: "ghl_contact_1",
    name: "Maria Lopez — Template request (RateReady)", pipelineStageId: STAGES.intake, status: "open", monetaryValue: 500,
  });
  const note = noteText(r.calls);
  assert.match(note, /Form: Template request \(RateReady\)/);
  assert.match(note, /Service area: Tampa Bay/);
}));

await test("template request without SMS consent still works; no consent tag or fields", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({ name: "Ann", email: "ann@example.com", businessName: "Ann Co", consent: true, templateSlug: "modern-agent" }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  assert.deepEqual(tagsSent(r.calls), ["pilk-template-intake", "modern-agent", "pilk-form-template-request"]);
  assert.ok(!(FIELD.consentVersion in fieldsOf(r.calls)));
  assert.equal(creates(r.calls)[0].monetaryValue, 1000);
}));

await test("template request honeypot filled: answers success, sends nothing", silence(async () => {
  const fd = new FormData();
  fd.set("payload", JSON.stringify({ name: "Bot", email: "bot@example.com", businessName: "Bot Co", consent: true, honeypot: "x" }));
  const r = await call("/api/template-intake", { form: fd });
  assert.equal(r.status, 200);
  assert.equal(r.calls.length, 0);
}));

quiet("GoHighLevel: the PILK AI pipeline");

const brief = (extra = {}) => ({
  formType: "project-brief", firstName: "Test", lastName: "User", email: "t@example.com", currentWebsite: "example.com",
  businessDescription: "We sell premium homes in Tampa Bay.", projectType: "custom", consent: true, timeline: "2–4 weeks",
  pageUrl: "https://pilk.ai/contact/", landingPage: "/?utm_source=meta&fbclid=FB1", utmSource: "meta", fbclid: "FB1", ...extra,
});

await test("brief from the CRM pricing card: Intake Completed, valued at the package's starting price", silence(async () => {
  const r = await call("/api/leads", { json: brief({ packageId: "crm" }) });
  assert.equal(r.status, 200);
  const [opp] = creates(r.calls);
  assert.equal(opp.pipelineStageId, STAGES.intake);
  assert.equal(opp.monetaryValue, 5000);
  assert.equal(opp.name, "Test User — Project brief (Custom Website + Full CRM)");
  const f = fieldsOf(r.calls);
  assert.equal(f[FIELD.websiteUrl], "https://example.com");
  assert.equal(f[FIELD.timeline], "2–4 weeks");
  assert.equal(f[FIELD.utmSource], "meta");
  assert.equal(f[FIELD.leadIntent], "project-brief");
  assert.equal(f[FIELD.sourcePath], "/contact/");
  assert.ok(!(FIELD.googleClickId in f), "empty values are left out, never cleared");
  assert.match(noteText(r.calls), /Facebook click ID: FB1/, "fbclid has no field, so it goes in the note");
  const search = new URL(searches(r.calls)[0].url);
  assert.equal(search.searchParams.get("location_id"), "loc_test");
  assert.equal(search.searchParams.get("pipeline_id"), PIPELINE);
  assert.equal(search.searchParams.get("contact_id"), "ghl_contact_1");
}));

await test("brief with a template and no package: valued at the template's starting price", silence(async () => {
  const r = await call("/api/leads", { json: brief({ projectType: "template", selectedTemplate: "listing-page" }) });
  assert.equal(creates(r.calls)[0].monetaryValue, 250);
  assert.equal(fieldsOf(r.calls)[FIELD.templateChosen], "listing-page");
}));

await test("quick inquiry: New Lead, no value when nothing was chosen", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com" } });
  const [opp] = creates(r.calls);
  assert.equal(opp.pipelineStageId, STAGES.newLead);
  assert.equal(opp.status, "open");
  assert.ok(!("monetaryValue" in opp));
  assert.equal(opp.name, "Ann — Quick inquiry");
}));

await test("never moves backwards: an opportunity In Build stays put, the note is still added", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: STAGES.inBuild, status: "open", monetaryValue: 500 }];
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com" } });
  assert.equal(r.status, 200);
  assert.equal(creates(r.calls).length, 0);
  assert.equal(updates(r.calls).length, 0);
  assert.equal(notes(r.calls).length, 1);
}));

await test("never moves backwards: a brief doesn't pull an Active Client back to Intake Completed", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: STAGES.active, status: "won" }];
  const r = await call("/api/leads", { json: brief() });
  assert.equal(creates(r.calls).length + updates(r.calls).length, 0);
}));

await test("same stage: left alone", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: STAGES.intake, status: "open" }];
  const r = await call("/api/leads", { json: brief() });
  assert.equal(creates(r.calls).length + updates(r.calls).length, 0);
}));

await test("moves forward: New Lead -> Intake Completed when the brief arrives, value set if it had none", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: STAGES.newLead, status: "open", monetaryValue: 0 }];
  const r = await call("/api/leads", { json: brief({ packageId: "custom" }) });
  const [u] = updates(r.calls);
  assert.match(u.url, /\/opportunities\/opp_1$/);
  assert.deepEqual(JSON.parse(u.body), { pipelineId: PIPELINE, pipelineStageId: STAGES.intake, status: "open", monetaryValue: 2500 });
  assert.equal(creates(r.calls).length, 0);
}));

await test("moving forward keeps a value the owner already set", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: STAGES.newLead, status: "open", monetaryValue: 3200 }];
  const r = await call("/api/leads", { json: brief({ packageId: "custom" }) });
  assert.ok(!("monetaryValue" in JSON.parse(updates(r.calls)[0].body)));
}));

await test("a lost lead who writes in again is reopened at the form's stage", silence(async () => {
  ghlState.existing = [{ id: "opp_9", pipelineId: PIPELINE, pipelineStageId: STAGES.lost, status: "lost" }];
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com" } });
  const body = JSON.parse(updates(r.calls)[0].body);
  assert.equal(body.pipelineStageId, STAGES.newLead);
  assert.equal(body.status, "open");
}));

await test("a stage that isn't in GHL_STAGE_ORDER is never moved", silence(async () => {
  ghlState.existing = [{ id: "opp_1", pipelineId: PIPELINE, pipelineStageId: "some-new-stage", status: "open" }];
  const r = await call("/api/leads", { json: brief() });
  assert.equal(creates(r.calls).length + updates(r.calls).length, 0);
}));

await test("token without the opportunities scope: search fails, nothing is created, the note still lands, logs carry only a contact id", silence(async () => {
  ghlState.searchStatus = 401;
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Maria Lopez", email: "maria@example.com" } });
  assert.equal(r.status, 200);
  assert.equal(creates(r.calls).length, 0);
  assert.equal(notes(r.calls).length, 1);
  const logs = logged.filter((l) => l.startsWith("[ghl]")).join("\n");
  assert.match(logs, /\[ghl\] opportunity search failed status=401 contact=ghl_contact_1/);
  assert.ok(!logs.includes("maria@example.com") && !logs.includes("Maria"));
}));

await test("tags call fails: opportunity and note still go", silence(async () => {
  ghlState.tagsStatus = 422;
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com" } });
  assert.equal(r.status, 200);
  assert.equal(creates(r.calls).length, 1);
  assert.equal(notes(r.calls).length, 1);
}));

await test("pipeline vars missing: contact, tags and note only", silence(async () => {
  const env = { ...baseEnv, GHL_PIPELINE_ID: undefined };
  const r = await call("/api/leads", { env, json: { formType: "inquiry", name: "Ann", email: "ann@example.com" } });
  assert.deepEqual(ghlSequence(r.calls), ["POST /contacts/upsert", "POST /contacts/ghl_contact_1/tags", "POST /contacts/ghl_contact_1/notes"]);
}));

await test("customFields use GHL v2 field ids with fieldValue (and the field_value alias)", silence(async () => {
  const r = await call("/api/leads", { json: { formType: "inquiry", name: "Ann", email: "ann@example.com", gclid: "GCLID-9", utmCampaign: "spring" } });
  const cf = upsert(r.calls)[0].customFields;
  const g = cf.find((x) => x.id === FIELD.googleClickId);
  assert.deepEqual(g, { id: FIELD.googleClickId, field_value: "GCLID-9", fieldValue: "GCLID-9" });
  assert.ok(cf.every((x) => x.id && !x.key && x.fieldValue !== ""), "ids only, no empty values");
}));

await test("a long brief is shortened in the note, but the consent record survives", silence(async () => {
  const r = await call("/api/leads", { json: brief({ message: "x".repeat(4900), businessDescription: "y".repeat(1990), phone: "7275550100", smsConsent: true, smsConsentVersion: SMS_VERSION }) });
  const note = noteText(r.calls);
  assert.ok(note.length <= 5000);
  assert.match(note, /SMS consent: YES/);
  assert.match(note, /Wording shown:/);
  assert.match(note, /shortened; the full submission is in the lead email/);
}));

quiet("rate limit (Cache API)");

const inquiry = (n) => ({ formType: "inquiry", name: `Person ${n}`, email: `p${n}@example.com` });

await test("5 accepted submissions per IP per 10 minutes, then 429 with a friendly message", silence(async () => {
  await withCache(fakeCache(), async () => {
    for (let i = 1; i <= 5; i++) assert.equal((await call("/api/leads", { json: inquiry(i) })).status, 200, `submission ${i}`);
    const r = await call("/api/leads", { json: inquiry(6) });
    assert.equal(r.status, 429);
    assert.equal(r.body.success, false);
    assert.equal(r.body.code, "rate_limited");
    assert.match(r.body.error, /wait about 10 minutes/);
    const retry = Number(r.headers.get("retry-after"));
    assert.ok(retry > 0 && retry <= 600, `Retry-After ${retry}`);
    assert.equal(r.calls.length, 0, "nothing sent once limited");
  });
}));

await test("the key is a hash of the IP and a time bucket, never the raw IP", silence(async () => {
  const cache = fakeCache();
  await withCache(cache, async () => {
    await call("/api/leads", { json: inquiry(1) });
    const [key] = [...cache.store.keys()];
    assert.match(key, /^https:\/\/pilk\.ai\/api\/__rate-limit\/forms\/[0-9a-f]{40}\/\d+$/);
    assert.ok(!key.includes("203.0.113.7"));
  });
}));

await test("rejected (400) submissions don't count; the honeypot stays a silent success", silence(async () => {
  await withCache(fakeCache(), async () => {
    for (let i = 0; i < 8; i++) assert.equal((await call("/api/leads", { json: { formType: "inquiry", name: "" } })).status, 400);
    for (let i = 1; i <= 5; i++) assert.equal((await call("/api/leads", { json: inquiry(i) })).status, 200);
    const trap = await call("/api/leads", { json: { ...inquiry(9), honeypot: "x" } });
    assert.equal(trap.status, 200);
    assert.equal(trap.calls.length, 0);
    assert.equal((await call("/api/leads", { json: inquiry(10) })).status, 429);
  });
}));

await test("another IP has its own budget; the template request shares the forms budget", silence(async () => {
  await withCache(fakeCache(), async () => {
    for (let i = 1; i <= 5; i++) await call("/api/leads", { json: inquiry(i) });
    assert.equal((await call("/api/leads", { json: inquiry(7), headers: { "cf-connecting-ip": "198.51.100.4" } })).status, 200);
    const fd = new FormData();
    fd.set("payload", JSON.stringify({ name: "Ann", email: "ann@example.com", businessName: "Ann Co", consent: true }));
    const r = await call("/api/template-intake", { form: fd });
    assert.equal(r.status, 429);
    assert.match(r.body.error, /wait about 10 minutes/);
  });
}));

await test("fails open: a broken cache, no cache or no IP never blocks a lead", silence(async () => {
  await withCache(fakeCache({ broken: true }), async () => {
    for (let i = 1; i <= 7; i++) assert.equal((await call("/api/leads", { json: inquiry(i) })).status, 200);
  });
  for (let i = 1; i <= 7; i++) assert.equal((await call("/api/leads", { json: inquiry(i) })).status, 200);
  await withCache(fakeCache(), async () => {
    for (let i = 1; i <= 7; i++) assert.equal((await call("/api/leads", { json: inquiry(i), headers: { "cf-connecting-ip": "" } })).status, 200);
  });
}));

await test("the limit is read from wrangler.toml vars", silence(async () => {
  await withCache(fakeCache(), async () => {
    const env = { ...baseEnv, FORM_RATE_LIMIT_MAX: "2" };
    assert.equal((await call("/api/leads", { env, json: inquiry(1) })).status, 200);
    assert.equal((await call("/api/leads", { env, json: inquiry(2) })).status, 200);
    assert.equal((await call("/api/leads", { env, json: inquiry(3) })).status, 429);
  });
}));

quiet("checkout is retired; the webhook keeps serving existing plans");

const stripeEnv = { ...baseEnv, STRIPE_SECRET_KEY: "sk_test_x", STRIPE_WEBHOOK_SECRET: "whsec_test" };

for (const json of [{}, { addons: ["rush"], template: "rate-ready", renewalConsent: true, renewalConsentVersion: RENEWAL_VERSION }]) {
  await test(`checkout answers 410 and never calls Stripe (${Object.keys(json).length ? "full old payload" : "empty body"})`, silence(async () => {
    const r = await call("/api/checkout", { env: stripeEnv, json });
    assert.equal(r.status, 410);
    assert.equal(r.body.code, "checkout_retired");
    assert.match(r.body.error, /written quote/);
    assert.equal(r.calls.length, 0);
  }));
}

await test("checkout GET also answers 410", silence(async () => {
  const r = await call("/api/checkout", { env: stripeEnv, method: "GET" });
  assert.equal(r.status, 410);
}));

await test("paid webhook: subscription carries consent; order and customer emails; pilk-paid added, not replacing tags", silence(async () => {
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
  const [u] = upsert(r.calls);
  assert.ok(!("tags" in u), "pilk-paid no longer wipes the contact's other tags");
  assert.deepEqual(tagsSent(r.calls), ["pilk-paid"]);
  assert.deepEqual(
    u.customFields.map((f) => [f.key, f.field_value]),
    [["template_chosen", "rate-ready"], ["addons_purchased", "rush"], ["order_amount", "660.00"]]
  );
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

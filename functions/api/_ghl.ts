/// <reference types="@cloudflare/workers-types" />
// Best-effort push of a lead into GoHighLevel (LeadConnector API v2).
//
// Reads GHL_PIT_TOKEN (Private Integration Token, a secret) plus the location,
// pipeline and stage ids from wrangler.toml [vars]. Every call is best effort:
// nothing here throws, nothing here can fail a form, and the forms run it after
// the response (waitUntil), so a slow or broken GHL never delays a visitor. The
// Resend email is the authoritative copy of every lead.
//
// Logs carry the step, the HTTP status and at most a GHL contact id. Never a
// name, email, phone or response body (GHL error bodies can echo them).
// docs/integrations/ghl.md describes what is sent. Files prefixed _ aren't routed.

export type GhlEnv = {
  GHL_PIT_TOKEN?: string;
  GHL_LOCATION_ID?: string;
  GHL_PIPELINE_ID?: string;
  GHL_STAGE_NEW_LEAD?: string;
  GHL_STAGE_INTAKE_COMPLETED?: string;
  /** reopened (moved to the form's stage) when a lost lead writes in again */
  GHL_STAGE_LOST?: string;
  /** every stage id in pipeline order, comma-separated; drives the no-backwards rule */
  GHL_STAGE_ORDER?: string;
};

/** A custom field by id (preferred) or key. The value is stored as text. */
export type GhlCustomField = { id?: string; key?: string; field_value: string | number };

export type GhlContact = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  /** added with the Add Tags endpoint after the upsert, never replaced */
  tags?: string[];
  customFields?: GhlCustomField[];
};

/** Contact custom fields in the "Pilk Ai" location (id -> key in GHL). */
export const GHL_FIELDS = {
  templateChosen: "6gTNA2dWOj1B42zWCwMK", // contact.template_chosen
  serviceArea: "6iGwqudyrBXFDvyDtcDl", // contact.service_area
  websiteUrl: "Z7aH8hTfElbrgAwY2lN7", // contact.website_url
  utmSource: "xdzkeIZzKaYh8osvDPLq", // contact.utm_source
  utmMedium: "U1nHfmtNW8YSFPrYJ2Jc", // contact.utm_medium
  utmCampaign: "Pq9gAzR9Lqj8JCoBKwSR", // contact.utm_campaign
  googleClickId: "daCb9Q8Pu9iuy5r9jku8", // contact.google_click_id
  sourcePath: "id4Ti8l8VyKTqIAnI3vb", // contact.source_path
  timeline: "dLJTGCwpNRtcjDKdYqxJ", // contact.timeline
  consentDisclosureVersion: "Nkt8JgJj2CtYVQ4MNcJB", // contact.consent_disclosure_version
  consentReceivedAt: "eML577wowahPcDZfnitF", // contact.consent_received_at
  leadIntent: "9jphm36XMQsBiFxt4TCE", // contact.lead_intent
} as const;

export type GhlFieldName = keyof typeof GHL_FIELDS;

export type OpportunityStage = "new-lead" | "intake-completed";

export type OpportunityResult = "created" | "moved" | "reopened" | "kept" | "skipped" | "failed";

const GHL_API = "https://services.leadconnectorhq.com";
const TIMEOUT_MS = 8000;

function headers(env: GhlEnv): Record<string, string> {
  return {
    Authorization: `Bearer ${env.GHL_PIT_TOKEN}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

type GhlResponse = { ok: boolean; status: number; data: any };

/** One request. Never throws; a network error or timeout comes back as status 0. */
async function ghl(env: GhlEnv, method: string, path: string, step: string, body?: unknown): Promise<GhlResponse> {
  try {
    const timeout = (AbortSignal as { timeout?: (ms: number) => AbortSignal }).timeout;
    const res = await fetch(`${GHL_API}${path}`, {
      method,
      headers: headers(env),
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(timeout ? { signal: timeout(TIMEOUT_MS) } : {}),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    console.error(`[ghl] ${step} error`, e instanceof Error ? e.name : "error");
    return { ok: false, status: 0, data: null };
  }
}

function logFailure(step: string, status: number, contactId?: string) {
  if (status === 0) return; // already logged by ghl()
  console.error(`[ghl] ${step} failed`, `status=${status}`, ...(contactId ? [`contact=${contactId}`] : []));
}

/** GHL v2 wants fieldValue; older accounts still read field_value. Both carry the same value. */
function customFieldPayload(fields: GhlCustomField[]) {
  return fields
    .filter((f) => (f.id || f.key) && String(f.field_value ?? "").trim() !== "")
    .map((f) => ({
      ...(f.id ? { id: f.id } : { key: f.key }),
      field_value: String(f.field_value),
      fieldValue: String(f.field_value),
    }));
}

/** Builds custom fields by name, leaving out empty values so nothing is cleared. */
export function ghlFields(values: Partial<Record<GhlFieldName, string | number | undefined>>): GhlCustomField[] {
  return (Object.keys(values) as GhlFieldName[])
    .filter((k) => String(values[k] ?? "").trim() !== "")
    .map((k) => ({ id: GHL_FIELDS[k], field_value: String(values[k]).trim().slice(0, 500) }));
}

/**
 * Upserts the contact WITHOUT tags (GHL's upsert replaces the whole tag set),
 * then adds the tags with the Add Tags endpoint, so tags such as pilk-paid and
 * sms-consent are never removed. Resolves to the GHL contact id, or undefined
 * (unconfigured, no email or phone, or an error).
 */
export async function sendToGhl(env: GhlEnv, contact: GhlContact): Promise<string | undefined> {
  if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID) return undefined;
  if (!contact.email && !contact.phone) return undefined; // GHL needs at least one identifier
  const { tags = [], customFields = [], ...rest } = contact;
  const fields = customFieldPayload(customFields);
  const res = await ghl(env, "POST", "/contacts/upsert", "upsert", {
    locationId: env.GHL_LOCATION_ID,
    ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined && v !== "")),
    ...(fields.length ? { customFields: fields } : {}),
  });
  if (!res.ok) {
    logFailure("upsert", res.status);
    return undefined;
  }
  const contactId: string | undefined = res.data?.contact?.id || undefined;
  if (contactId) await addGhlTags(env, contactId, tags);
  return contactId;
}

/** Adds tags to a contact, keeping the ones it already has. Best effort. */
export async function addGhlTags(env: GhlEnv, contactId: string | undefined, tags: string[]): Promise<void> {
  const clean = [...new Set(tags.map((t) => String(t ?? "").trim()).filter(Boolean))];
  if (!env.GHL_PIT_TOKEN || !contactId || clean.length === 0) return;
  const res = await ghl(env, "POST", `/contacts/${encodeURIComponent(contactId)}/tags`, "tags", { tags: clean });
  if (!res.ok) logFailure("tags", res.status, contactId);
}

/** Adds a note to a contact. Best effort, never throws. */
export async function addGhlNote(env: GhlEnv, contactId: string | undefined, body: string): Promise<void> {
  if (!env.GHL_PIT_TOKEN || !contactId) return;
  const res = await ghl(env, "POST", `/contacts/${encodeURIComponent(contactId)}/notes`, "note", {
    body: body.slice(0, 5000),
  });
  if (!res.ok) logFailure("note", res.status, contactId);
}

function stageOrder(env: GhlEnv): string[] {
  return (env.GHL_STAGE_ORDER ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

/** Position in the pipeline; an unknown stage counts as the furthest along, so it's never moved. */
function rank(order: string[], stageId: string | undefined): number {
  const i = stageId ? order.indexOf(stageId) : -1;
  return i < 0 ? Number.POSITIVE_INFINITY : i;
}

/**
 * Makes sure the contact has an open opportunity in the PILK AI pipeline at
 * least as far along as `stage`:
 * - none yet: create it at `stage`
 * - one at an earlier stage: move it forward to `stage`
 * - one at the same or a later stage (Paid, In Build, Active Client...): leave it alone
 * - one that was lost or abandoned: reopen it at `stage`, because the person
 *   has come back with a new request
 * If the search fails (for example the token lacks the opportunities scope),
 * nothing is created, so a stage is never moved without knowing where it is.
 */
export async function upsertGhlOpportunity(
  env: GhlEnv,
  contactId: string | undefined,
  opp: { name: string; stage: OpportunityStage; monetaryValue?: number }
): Promise<OpportunityResult> {
  const pipelineId = env.GHL_PIPELINE_ID;
  const target = opp.stage === "intake-completed" ? env.GHL_STAGE_INTAKE_COMPLETED : env.GHL_STAGE_NEW_LEAD;
  if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID || !contactId || !pipelineId || !target) return "skipped";

  const query = new URLSearchParams({
    location_id: env.GHL_LOCATION_ID,
    pipeline_id: pipelineId,
    contact_id: contactId,
    limit: "20",
  });
  const found = await ghl(env, "GET", `/opportunities/search?${query}`, "opportunity search");
  if (!found.ok) {
    logFailure("opportunity search", found.status, contactId);
    return "failed";
  }

  const value =
    typeof opp.monetaryValue === "number" && opp.monetaryValue > 0 ? { monetaryValue: opp.monetaryValue } : {};
  const order = stageOrder(env);
  const existing = ((found.data?.opportunities ?? []) as any[]).filter(
    (o) => o && o.id && (!o.pipelineId || o.pipelineId === pipelineId)
  );

  if (existing.length === 0) {
    const res = await ghl(env, "POST", "/opportunities/", "opportunity create", {
      pipelineId,
      locationId: env.GHL_LOCATION_ID,
      contactId,
      name: opp.name.slice(0, 200),
      pipelineStageId: target,
      status: "open",
      ...value,
    });
    if (!res.ok) {
      logFailure("opportunity create", res.status, contactId);
      return "failed";
    }
    return "created";
  }

  // With duplicates off there is one; if not, judge by the one furthest along.
  const current = existing.reduce((a, b) => (rank(order, b.pipelineStageId) > rank(order, a.pipelineStageId) ? b : a));
  const lost =
    current.status === "lost" ||
    current.status === "abandoned" ||
    (!!env.GHL_STAGE_LOST && current.pipelineStageId === env.GHL_STAGE_LOST);
  const behind = rank(order, current.pipelineStageId) < rank(order, target);
  if (!lost && !behind) return "kept";

  const hasValue = typeof current.monetaryValue === "number" && current.monetaryValue > 0;
  const res = await ghl(env, "PUT", `/opportunities/${encodeURIComponent(current.id)}`, "opportunity update", {
    pipelineId,
    pipelineStageId: target,
    status: "open",
    ...(hasValue ? {} : value),
  });
  if (!res.ok) {
    logFailure("opportunity update", res.status, contactId);
    return "failed";
  }
  return lost ? "reopened" : "moved";
}

export type GhlLead = {
  contact: Omit<GhlContact, "tags" | "customFields">;
  tags: string[];
  fields: Partial<Record<GhlFieldName, string | number | undefined>>;
  opportunity: { name: string; stage: OpportunityStage; monetaryValue?: number };
  note: string;
};

/**
 * Everything a form sends to GHL, in order: contact upsert, tags, opportunity,
 * note. A failed step doesn't stop the later ones (except that nothing can be
 * attached without a contact id). Never throws.
 */
export async function syncLeadToGhl(env: GhlEnv, lead: GhlLead): Promise<void> {
  try {
    const contactId = await sendToGhl(env, {
      ...lead.contact,
      tags: lead.tags,
      customFields: ghlFields(lead.fields),
    });
    if (!contactId) return;
    await upsertGhlOpportunity(env, contactId, lead.opportunity);
    await addGhlNote(env, contactId, lead.note);
  } catch (e) {
    console.error("[ghl] sync error", e instanceof Error ? e.name : "error");
  }
}

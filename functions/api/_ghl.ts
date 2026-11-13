/// <reference types="@cloudflare/workers-types" />
// Best-effort push of a lead into GoHighLevel (LeadConnector API v2).
// Reads GHL_PIT_TOKEN (Private Integration Token — secret) and GHL_LOCATION_ID
// from the environment. No-ops silently when unconfigured; never throws, so a
// GHL outage can never block a form submission. Files prefixed _ aren't routed.

export type GhlEnv = { GHL_PIT_TOKEN?: string; GHL_LOCATION_ID?: string };

export type GhlContact = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: { key: string; field_value: string }[];
};

const GHL_API = "https://services.leadconnectorhq.com";

function headers(env: GhlEnv): Record<string, string> {
  return {
    Authorization: `Bearer ${env.GHL_PIT_TOKEN}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Upserts the contact. Resolves to the GHL contact id when GHL answered with
 * one, otherwise undefined (unconfigured, no identifier, or an error).
 *
 * Note: GHL's upsert replaces the contact's tags with the ones sent here.
 */
export async function sendToGhl(env: GhlEnv, contact: GhlContact): Promise<string | undefined> {
  if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID) return undefined;
  if (!contact.email && !contact.phone) return undefined; // GHL needs at least one identifier
  try {
    const res = await fetch(`${GHL_API}/contacts/upsert`, {
      method: "POST",
      headers: headers(env),
      body: JSON.stringify({
        locationId: env.GHL_LOCATION_ID,
        ...contact,
        tags: (contact.tags ?? []).filter(Boolean),
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[ghl] upsert failed", res.status, t.slice(0, 300));
      return undefined;
    }
    const data = (await res.json().catch(() => null)) as { contact?: { id?: string } } | null;
    return data?.contact?.id || undefined;
  } catch (e) {
    console.error("[ghl] error", e);
    return undefined;
  }
}

/** Adds a note to a contact. Best effort, never throws. */
export async function addGhlNote(env: GhlEnv, contactId: string | undefined, body: string): Promise<void> {
  if (!env.GHL_PIT_TOKEN || !contactId) return;
  try {
    const res = await fetch(`${GHL_API}/contacts/${encodeURIComponent(contactId)}/notes`, {
      method: "POST",
      headers: headers(env),
      body: JSON.stringify({ body: body.slice(0, 5000) }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[ghl] note failed", res.status, t.slice(0, 300));
    }
  } catch (e) {
    console.error("[ghl] note error", e);
  }
}

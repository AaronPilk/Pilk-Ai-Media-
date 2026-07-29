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

export async function sendToGhl(env: GhlEnv, contact: GhlContact): Promise<void> {
  if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID) return;
  if (!contact.email && !contact.phone) return; // GHL needs at least one identifier
  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GHL_PIT_TOKEN}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId: env.GHL_LOCATION_ID,
        ...contact,
        tags: (contact.tags ?? []).filter(Boolean),
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[ghl] upsert failed", res.status, t.slice(0, 300));
    }
  } catch (e) {
    console.error("[ghl] error", e);
  }
}

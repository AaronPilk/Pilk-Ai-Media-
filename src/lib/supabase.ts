import { env, integrations } from "@/lib/env";
import type { Lead } from "@/types/lead";

/**
 * Minimal lead storage adapter.
 * - With Supabase env vars set: inserts into a `leads` table via the REST API
 *   (no extra dependency needed).
 * - Without credentials: logs to the server console (dev fallback) and returns ok.
 */
export async function storeLead(lead: Lead): Promise<{ ok: boolean; stored: "supabase" | "console" }> {
  if (!integrations.supabase) {
    console.info("[leads] (dev fallback — no Supabase configured) New lead:", {
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      projectType: lead.projectType,
    });
    return { ok: true, stored: "console" };
  }

  try {
    const res = await fetch(`${env.supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.supabaseServiceRoleKey,
        Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ ...lead, created_at: new Date().toISOString() }),
    });

    if (!res.ok) {
      console.error("[leads] Supabase insert failed:", res.status, await res.text());
      return { ok: false, stored: "supabase" };
    }
    return { ok: true, stored: "supabase" };
  } catch (error) {
    console.error("[leads] Supabase insert error:", error);
    return { ok: false, stored: "supabase" };
  }
}

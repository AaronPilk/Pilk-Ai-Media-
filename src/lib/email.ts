import { env, integrations } from "@/lib/env";
import { site } from "@/content/site";
import type { Lead } from "@/types/lead";

async function sendViaResend(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.resendApiKey}`,
    },
    body: JSON.stringify({ from: env.leadsFromEmail, to, subject, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
  }
}

/** Sends internal notification + prospect confirmation. Dev fallback logs when no creds. */
export async function sendLeadEmails(lead: Lead): Promise<void> {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  if (!integrations.resend) {
    console.info("[leads] (dev fallback — no Resend configured) Would email:", {
      internalTo: env.leadsNotificationEmail || "(unset)",
      prospectTo: lead.email,
      name,
    });
    return;
  }

  const internalHtml = `
    <h2>New website inquiry</h2>
    <p><strong>${name}</strong> — ${lead.email}${lead.phone ? ` · ${lead.phone}` : ""}</p>
    <p>Project: ${lead.projectType}${lead.selectedTemplate ? ` (${lead.selectedTemplate})` : ""}</p>
    <p>Company: ${lead.company || "—"} · Industry: ${lead.industry || "—"}</p>
    <p>Budget: ${lead.budget || "—"} · Timeline: ${lead.timeline || "—"}</p>
    <p>Message:<br/>${(lead.message || "").replace(/\n/g, "<br/>")}</p>
    <hr/>
    <p style="color:#888;font-size:12px">Source: ${lead.utmSource || "direct"} / ${lead.utmCampaign || "—"} · Landing: ${lead.landingPage || "—"}</p>
  `;

  const prospectHtml = `
    <h2>Thanks for reaching out to ${site.name}</h2>
    <p>Hi ${lead.firstName}, we got your inquiry and we'll be in touch shortly.</p>
    <p>In the meantime, feel free to browse our templates and work.</p>
    <p>— ${site.name}</p>
  `;

  const tasks: Promise<void>[] = [];
  if (env.leadsNotificationEmail) {
    tasks.push(sendViaResend(env.leadsNotificationEmail, `New inquiry — ${name}`, internalHtml));
  }
  tasks.push(sendViaResend(lead.email, `We received your inquiry — ${site.name}`, prospectHtml));

  await Promise.allSettled(tasks);
}

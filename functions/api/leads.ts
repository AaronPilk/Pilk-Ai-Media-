// Native Cloudflare Pages Function — handles POST /api/leads.
// No Next.js, no Vercel. Runs on Cloudflare's edge. Reads secrets from
// the Pages project's Environment variables (context.env).
import { z } from "zod";

const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  currentWebsite: z.string().trim().url().max(300).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.enum(["template", "premium-template", "custom", "redesign", "unsure"]),
  selectedTemplate: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  needsIdx: z.boolean().optional(),
  message: z.string().trim().min(10).max(5000),
  preferredContact: z.enum(["email", "phone", "text"]).optional(),
  consent: z.boolean().optional(),
  utmSource: z.string().max(300).optional().or(z.literal("")),
  utmMedium: z.string().max(300).optional().or(z.literal("")),
  utmCampaign: z.string().max(300).optional().or(z.literal("")),
  utmContent: z.string().max(300).optional().or(z.literal("")),
  utmTerm: z.string().max(300).optional().or(z.literal("")),
  landingPage: z.string().max(1000).optional().or(z.literal("")),
  referrer: z.string().max(1000).optional().or(z.literal("")),
  gclid: z.string().max(500).optional().or(z.literal("")),
  fbclid: z.string().max(500).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

type Env = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
  CRM_WEBHOOK_URL?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  try {
    const body = await context.request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return json(
        { success: false, error: "Please review the highlighted fields.", issues: parsed.error.flatten() },
        400
      );
    }

    const lead = parsed.data;
    if (lead.honeypot) return json({ success: true }); // spam trap

    const env = context.env;
    const name = `${lead.firstName} ${lead.lastName}`.trim();

    // 1. Store in Supabase if configured, else log
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${env.SUPABASE_URL}/rest/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ ...lead, created_at: new Date().toISOString() }),
        });
      } catch (e) {
        console.error("[leads] supabase error", e);
      }
    } else {
      console.log("[leads] new inquiry:", name, lead.email, lead.projectType);
    }

    // 2. Email via Resend if configured
    if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL) {
      const send = (to: string, subject: string, html: string) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({ from: env.LEADS_FROM_EMAIL, to, subject, html }),
        });
      const tasks: Promise<unknown>[] = [];
      if (env.LEADS_NOTIFICATION_EMAIL) {
        tasks.push(
          send(
            env.LEADS_NOTIFICATION_EMAIL,
            `New inquiry — ${name}`,
            `<p><strong>${name}</strong> — ${lead.email}${lead.phone ? " · " + lead.phone : ""}</p>
             <p>Project: ${lead.projectType}${lead.selectedTemplate ? " (" + lead.selectedTemplate + ")" : ""}</p>
             <p>${(lead.message || "").replace(/\n/g, "<br/>")}</p>`
          )
        );
      }
      tasks.push(
        send(
          lead.email,
          "We received your inquiry — Pilk.ai Media",
          `<p>Hi ${lead.firstName}, thanks for reaching out. We'll be in touch shortly.</p><p>— Pilk.ai Media</p>`
        )
      );
      await Promise.allSettled(tasks);
    }

    // 3. CRM webhook if configured
    if (env.CRM_WEBHOOK_URL) {
      try {
        await fetch(env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (e) {
        console.error("[leads] crm error", e);
      }
    }

    return json({ success: true });
  } catch (e) {
    console.error("[leads] failed", e);
    return json({ success: false, error: "We could not submit your request. Please try again." }, 500);
  }
};

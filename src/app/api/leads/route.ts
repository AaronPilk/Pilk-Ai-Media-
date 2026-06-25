import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/forms";
import { rateLimit, clientKeyFromHeaders } from "@/lib/rate-limit";
import { storeLead } from "@/lib/supabase";
import { sendLeadEmails } from "@/lib/email";
import { env, integrations } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const key = clientKeyFromHeaders(request.headers);
    const limit = rateLimit(`leads:${key}`, 5, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body: unknown = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please review the highlighted fields.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const lead = parsed.data;

    // Spam trap — pretend success.
    if (lead.honeypot) {
      return NextResponse.json({ success: true });
    }

    // 1. Store (Supabase when configured, console fallback otherwise)
    await storeLead(lead);

    // 2. Email notifications (Resend when configured, console fallback otherwise)
    await sendLeadEmails(lead);

    // 3. Optional CRM webhook
    if (integrations.crm) {
      try {
        await fetch(env.crmWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (e) {
        console.error("[leads] CRM webhook failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission failed:", error);
    return NextResponse.json(
      { success: false, error: "We could not submit your request. Please try again." },
      { status: 500 }
    );
  }
}

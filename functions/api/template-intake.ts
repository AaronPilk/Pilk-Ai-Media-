/// <reference types="@cloudflare/workers-types" />
// Native Cloudflare Pages Function — handles POST /api/template-intake (multipart).
// A client picks a template, fills the intake form, and uploads assets. We
// validate, store files in private R2 (backup), and email the studio everything
// (copy + the files as attachments) so the template can be duplicated.
import {
  templateIntakeSchema,
  INTAKE_ALLOWED_UPLOAD_TYPES,
  INTAKE_MAX_FILES,
  INTAKE_MAX_FILE_SIZE,
  INTAKE_MAX_TOTAL_SIZE,
} from "../../src/lib/template-intake-schema";
import { sendToGhl } from "./_ghl";

type Env = {
  PROJECT_UPLOADS?: R2Bucket;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
  GHL_PIT_TOKEN?: string;
  GHL_LOCATION_ID?: string;
};

const ALLOWED = new Set(INTAKE_ALLOWED_UPLOAD_TYPES);
const UPLOAD_FIELDS = ["logo", "headshot", "hero", "gallery", "brand"];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Renders a labeled block only when there's a value. */
function row(label: string, value: unknown): string {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return `<p style="margin:4px 0"><strong>${esc(label)}:</strong> ${esc(v).replace(/\n/g, "<br/>")}</p>`;
}

const DO_WHAT_LABEL: Record<string, string> = {
  mortgage: "Mortgage / loans",
  realestate: "Real estate agent",
  both: "Both",
};

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return json({ success: false, error: "Invalid submission." }, 400);
    }

    const formData = await request.formData();
    const payloadValue = formData.get("payload");
    if (typeof payloadValue !== "string") {
      return json({ success: false, error: "Missing form details." }, 400);
    }

    let rawPayload: unknown;
    try {
      rawPayload = JSON.parse(payloadValue);
    } catch {
      return json({ success: false, error: "Invalid form details." }, 400);
    }

    const parsed = templateIntakeSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return json(
        { success: false, error: "Please review the highlighted fields.", issues: parsed.error.flatten() },
        400
      );
    }
    const data = parsed.data;
    if (data.honeypot) return json({ success: true }); // spam trap

    // Collect labeled files
    const collected: Array<{ group: string; file: File }> = [];
    for (const field of UPLOAD_FIELDS) {
      for (const v of formData.getAll(field)) {
        if (v instanceof File && v.size > 0) collected.push({ group: field, file: v });
      }
    }

    if (collected.length > INTAKE_MAX_FILES) {
      return json({ success: false, error: `Upload no more than ${INTAKE_MAX_FILES} files.` }, 400);
    }
    let totalSize = 0;
    for (const { file } of collected) {
      totalSize += file.size;
      if (file.type && !ALLOWED.has(file.type)) {
        return json({ success: false, error: `${file.name} is not an accepted file type.` }, 400);
      }
      if (file.size > INTAKE_MAX_FILE_SIZE) {
        return json({ success: false, error: `${file.name} is larger than 8 MB. Please compress it.` }, 400);
      }
    }
    if (totalSize > INTAKE_MAX_TOTAL_SIZE) {
      return json(
        { success: false, error: "Your files total more than 20 MB. Please compress them or send the largest separately." },
        400
      );
    }

    const submissionId = crypto.randomUUID();

    const prepared: Array<{ group: string; name: string; type: string; size: number; base64: string; key?: string }> = [];
    for (const { group, file } of collected) {
      const ab = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(ab);
      const safeName = sanitizeFileName(file.name) || `${group}-file`;
      let key: string | undefined;
      if (env.PROJECT_UPLOADS) {
        key = `template-intake/${submissionId}/${group}/${crypto.randomUUID()}-${safeName}`;
        try {
          await env.PROJECT_UPLOADS.put(key, ab, {
            httpMetadata: { contentType: file.type },
            customMetadata: { group, originalName: file.name.slice(0, 200), submittedBy: data.email },
          });
        } catch (e) {
          console.error("[template-intake] R2 error", e);
        }
      }
      prepared.push({ group, name: file.name, type: file.type, size: file.size, base64, key });
    }

    const tplName = data.templateName || data.templateSlug || "template";
    const doWhat = data.doWhat === "other" ? (data.doWhatOther || "Something else") : DO_WHAT_LABEL[data.doWhat ?? ""] ?? "";
    const services = (data.services ?? []).join(", ");
    const links = (data.links ?? []).filter(Boolean).join("\n");
    const displayEmail = data.useAccountEmail === false ? data.displayEmail : data.email;

    // Email the studio with everything + attachments.
    if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL && env.LEADS_NOTIFICATION_EMAIL) {
      const filesByGroup = UPLOAD_FIELDS.map((g) => {
        const list = prepared.filter((f) => f.group === g);
        if (!list.length) return "";
        const items = list.map((f) => `<li>${esc(f.name)} — ${Math.round(f.size / 1024)} KB</li>`).join("");
        return `<p style="margin:8px 0 2px"><strong>${esc(g)}</strong></p><ul style="margin:0">${items}</ul>`;
      }).join("");

      const internalHtml = `
        <h2 style="margin:0 0 4px">Template order — ${esc(tplName)}</h2>
        <p style="margin:0 0 12px;color:#666">Slug: <code>${esc(data.templateSlug)}</code></p>

        <h3 style="margin:16px 0 4px">Contact</h3>
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}

        <h3 style="margin:16px 0 4px">Business</h3>
        ${row("Business name", data.businessName)}
        ${row("What they do", doWhat)}
        ${row("Title", data.title)}
        ${row("NMLS #", data.nmls)}
        ${row("Service area", data.serviceArea)}

        <h3 style="margin:16px 0 4px">Site copy</h3>
        ${row("About / one-liner", data.about)}
        ${row("Services", services)}

        <h3 style="margin:16px 0 4px">Show on the site</h3>
        ${row("Display phone", data.displayPhone || data.phone)}
        ${row("Display email", displayEmail)}
        ${row("Links", links)}

        <h3 style="margin:16px 0 4px">Notes</h3>
        ${row("Notes", data.notes)}
        ${data.sendPhotosLater ? row("Photos", "Client will send photos later") : ""}

        <h3 style="margin:16px 0 4px">Uploaded files (${prepared.length})</h3>
        ${filesByGroup || "<p style='color:#888'>None uploaded.</p>"}
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#888;font-size:12px">Source: ${esc(data.utmSource) || "direct"} / ${esc(data.utmCampaign) || "—"} · Landing: ${esc(data.landingPage) || "—"}</p>
      `;

      const attachments = prepared.map((f) => ({ filename: f.name, content: f.base64 }));

      const send = (to: string, subject: string, html: string, atts?: { filename: string; content: string }[]) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({ from: env.LEADS_FROM_EMAIL, to, subject, html, ...(atts && atts.length ? { attachments: atts } : {}) }),
        });

      const clientHtml = `
        <h2>Thanks, ${esc(data.name)} — we've got your details</h2>
        <p>You chose the <strong>${esc(tplName)}</strong> design. We received your info${prepared.length ? ` and ${prepared.length} file${prepared.length === 1 ? "" : "s"}` : ""}, and we'll start building your site. Watch your inbox for your first preview.</p>
        <p>— Pilk.ai</p>
        <p style="color:#888;font-size:12px">Pilk.ai is a brand of Pilk Consulting LLC.</p>
      `;

      try {
        const r = await send(env.LEADS_NOTIFICATION_EMAIL, `Template order — ${tplName} — ${data.name}`, internalHtml, attachments);
        if (!r.ok) console.error("[template-intake] resend error", r.status, (await r.text()).slice(0, 400));
        await send(data.email, `We received your ${tplName} order — Pilk.ai`, clientHtml).catch(() => {});
      } catch (e) {
        console.error("[template-intake] send failed", e);
      }
    } else {
      console.log("[template-intake]", tplName, data.email, `${prepared.length} files`);
    }

    // GoHighLevel (best effort — hot lead into the CRM)
    await sendToGhl(env, {
      name: data.name,
      companyName: data.businessName,
      email: data.email,
      phone: data.phone,
      source: "pilk.ai template intake",
      tags: ["pilk-template-intake", data.templateSlug || ""],
    });

    return json({ success: true });
  } catch (err) {
    console.error("[template-intake] error", err);
    return json({ success: false, error: "Something went wrong. Please try again or email us directly." }, 500);
  }
};

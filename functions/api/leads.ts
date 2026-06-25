/// <reference types="@cloudflare/workers-types" />
// Native Cloudflare Pages Function — handles POST /api/leads (JSON or multipart).
// Validates with the SHARED schema, stores uploads in private R2, escapes email HTML.
import {
  projectBriefSchema,
  ALLOWED_UPLOAD_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
} from "../../src/lib/project-brief-schema";

type Env = {
  PROJECT_UPLOADS?: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
  CRM_WEBHOOK_URL?: string;
};

const ALLOWED = new Set(ALLOWED_UPLOAD_TYPES);

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

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let rawPayload: unknown;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const payloadValue = formData.get("payload");
      if (typeof payloadValue !== "string") {
        return json({ success: false, error: "Missing website brief." }, 400);
      }
      try {
        rawPayload = JSON.parse(payloadValue);
      } catch {
        return json({ success: false, error: "Invalid website brief." }, 400);
      }
      files = formData
        .getAll("files")
        .filter((v): v is File => v instanceof File);
    } else {
      rawPayload = await request.json();
    }

    const parsed = projectBriefSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return json(
        { success: false, error: "Please review the highlighted fields.", issues: parsed.error.flatten() },
        400
      );
    }
    const lead = parsed.data;
    if (lead.honeypot) return json({ success: true }); // spam trap

    // Validate files
    if (files.length > MAX_FILES) {
      return json({ success: false, error: `Upload no more than ${MAX_FILES} files.` }, 400);
    }
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
      if (!ALLOWED.has(file.type)) {
        return json({ success: false, error: `${file.name} is not an accepted file type.` }, 400);
      }
      if (file.size > MAX_FILE_SIZE) {
        return json({ success: false, error: `${file.name} is larger than 15 MB.` }, 400);
      }
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return json({ success: false, error: "The combined upload is larger than 60 MB." }, 400);
    }

    // Store files (private R2) only after payload validates
    const uploadedFiles: Array<{ key: string; name: string; type: string; size: number }> = [];
    if (files.length > 0) {
      if (!env.PROJECT_UPLOADS) {
        return json(
          { success: false, error: "File uploads are temporarily unavailable. Remove the files or email us directly." },
          503
        );
      }
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const safeName = sanitizeFileName(file.name);
        const key = `project-briefs/${submissionId}/${crypto.randomUUID()}-${safeName}`;
        await env.PROJECT_UPLOADS.put(key, file.stream(), {
          httpMetadata: { contentType: file.type },
          customMetadata: {
            originalName: file.name.slice(0, 200),
            submittedBy: lead.email,
          },
        });
        uploadedFiles.push({ key, name: file.name, type: file.type, size: file.size });
      }
    }

    const name = `${lead.firstName} ${lead.lastName}`.trim();

    // Store lead (best effort — don't fail the submission if storage errors)
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
          body: JSON.stringify({ ...lead, uploaded_files: uploadedFiles, created_at: new Date().toISOString() }),
        });
      } catch (e) {
        console.error("[leads] supabase error", e);
      }
    } else {
      console.log("[leads] new brief:", name, lead.email, lead.projectType, `${uploadedFiles.length} files`);
    }

    // Emails (escaped). Internal includes R2 keys; prospect never does.
    if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL) {
      const send = (to: string, subject: string, html: string) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({ from: env.LEADS_FROM_EMAIL, to, subject, html }),
        });

      const fileLines = uploadedFiles
        .map((f) => `<li>${esc(f.name)} (${Math.round(f.size / 1024)} KB) — <code>${esc(f.key)}</code></li>`)
        .join("");

      const internalHtml = `
        <h2>New website brief</h2>
        <p><strong>${esc(name)}</strong> — ${esc(lead.email)}${lead.phone ? " · " + esc(lead.phone) : ""}</p>
        <p>Company: ${esc(lead.company) || "—"} · Industry: ${esc(lead.industry) || "—"}</p>
        <p>Project: ${esc(lead.projectType)}${lead.selectedTemplate ? " (" + esc(lead.selectedTemplate) + ")" : ""}</p>
        <p>Goal: ${esc(lead.primaryGoal) || "—"}</p>
        <p>Pages: ${esc((lead.requiredPages ?? []).join(", ")) || "—"}</p>
        <p>Integrations: ${esc((lead.integrations ?? []).join(", ")) || "—"}</p>
        <p>Palette: ${esc(lead.selectedPalette) || "—"} · Colors: ${esc((lead.preferredColors ?? []).join(" "))}</p>
        <p>Style: ${esc(lead.styleDirection) || "—"} · Theme: ${esc(lead.themePreference) || "—"}</p>
        <p>Inspiration: ${(lead.inspirationSites ?? []).map((s) => esc(s.url)).join(", ") || "—"}</p>
        <p>Budget: ${esc(lead.budget) || "—"} · Launch: ${esc(lead.timeline) || "—"}</p>
        <p>Notes: ${esc(lead.message) || "—"}</p>
        ${uploadedFiles.length ? `<p>Files:</p><ul>${fileLines}</ul>` : ""}
        <hr/>
        <p style="color:#888;font-size:12px">Source: ${esc(lead.utmSource) || "direct"} / ${esc(lead.utmCampaign) || "—"} · Landing: ${esc(lead.landingPage) || "—"}</p>
      `;

      const prospectHtml = `
        <h2>Thanks for your website brief</h2>
        <p>Hi ${esc(lead.firstName)}, we received your project details and we'll be in touch shortly.</p>
        <p>— Pilk.ai Media</p>
      `;

      const tasks: Promise<unknown>[] = [];
      if (env.LEADS_NOTIFICATION_EMAIL) {
        tasks.push(send(env.LEADS_NOTIFICATION_EMAIL, `New website brief — ${name}`, internalHtml));
      }
      tasks.push(send(lead.email, "We received your website brief — Pilk.ai Media", prospectHtml));
      await Promise.allSettled(tasks);
    }

    // CRM webhook (no file binaries; keys only)
    if (env.CRM_WEBHOOK_URL) {
      try {
        await fetch(env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lead, uploaded_files: uploadedFiles }),
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

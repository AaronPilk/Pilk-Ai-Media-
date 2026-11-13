/**
 * Reads a form endpoint's answer the same way in every form. A 429 can come
 * from our own function (JSON with a message) or from a Cloudflare rate-limit
 * rule in front of it (an HTML page), so a body that isn't JSON still gets a
 * friendly message instead of "Network error".
 */

export const RATE_LIMITED_MESSAGE =
  "You've sent a few requests in a short time. Please wait about 10 minutes and try again, or email Aaron@pilk.ai.";

export type SubmitResult = { ok: true } | { ok: false; error: string; rateLimited: boolean };

export async function readSubmitResult(res: Response, fallback: string): Promise<SubmitResult> {
  const body = (await res.json().catch(() => null)) as { success?: boolean; error?: unknown } | null;
  const message = typeof body?.error === "string" && body.error ? body.error : "";
  if (res.status === 429) return { ok: false, error: message || RATE_LIMITED_MESSAGE, rateLimited: true };
  if (!res.ok || body?.success === false) return { ok: false, error: message || fallback, rateLimited: false };
  return { ok: true };
}

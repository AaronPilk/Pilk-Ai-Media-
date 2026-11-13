/// <reference types="@cloudflare/workers-types" />
// Per-IP limit on form submissions, kept in Cloudflare's Cache API
// (caches.default). Defense in depth behind a Cloudflare rate-limiting rule.
//
// - Key: SHA-256 of the scope and CF-Connecting-IP, plus the current time
//   bucket (a fixed window). The raw IP never appears in the key.
// - Only accepted submissions count (record() after validation), so someone
//   fixing a typo isn't locked out, and the honeypot is handled before this.
// - The Cache API is per data center and has no atomic increment, so two
//   requests racing in the same instant can both pass. That's fine for spam
//   control; the dashboard rule is the hard limit.
// - Fails open: no cache, no IP or any error means the request is allowed.
//   A broken limiter must never cost a real lead.
// Files prefixed _ aren't routed.

export type RateLimitEnv = {
  FORM_RATE_LIMIT_MAX?: string;
  FORM_RATE_LIMIT_WINDOW_SECONDS?: string;
};

export const RATE_LIMIT_DEFAULT_MAX = 5;
export const RATE_LIMIT_DEFAULT_WINDOW_SECONDS = 600;

export const RATE_LIMIT_MESSAGE =
  "You've sent a few requests in a short time. Please wait about 10 minutes and try again, or email Aaron@pilk.ai.";

export type RateLimit = {
  limited: boolean;
  /** seconds until the window resets (for Retry-After) */
  retryAfter: number;
  /** counts one accepted submission; never throws */
  record: () => Promise<void>;
};

const OPEN: RateLimit = { limited: false, retryAfter: 0, record: async () => {} };

function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function defaultCache(): Cache | undefined {
  const store = (globalThis as { caches?: { default?: Cache } }).caches;
  return store?.default;
}

export async function checkRateLimit(request: Request, scope: string, env: RateLimitEnv): Promise<RateLimit> {
  try {
    const cache = defaultCache();
    const ip = request.headers.get("cf-connecting-ip");
    if (!cache || !ip) return OPEN;

    const max = positiveInt(env.FORM_RATE_LIMIT_MAX, RATE_LIMIT_DEFAULT_MAX);
    const windowSeconds = positiveInt(env.FORM_RATE_LIMIT_WINDOW_SECONDS, RATE_LIMIT_DEFAULT_WINDOW_SECONDS);
    const now = Math.floor(Date.now() / 1000);
    const bucket = Math.floor(now / windowSeconds);
    const retryAfter = Math.max(1, (bucket + 1) * windowSeconds - now);

    const hash = await sha256Hex(`pilk-form-rate:${scope}:${ip}`);
    // A same-origin URL under /api/ that no route answers. Only this code reads it.
    const key = new Request(`${new URL(request.url).origin}/api/__rate-limit/${scope}/${hash.slice(0, 40)}/${bucket}`);

    const hit = await cache.match(key);
    const count = hit ? Number.parseInt(await hit.text(), 10) || 0 : 0;

    return {
      limited: count >= max,
      retryAfter,
      record: async () => {
        try {
          await cache.put(
            key,
            new Response(String(count + 1), {
              headers: { "content-type": "text/plain", "cache-control": `max-age=${retryAfter + 5}` },
            })
          );
        } catch (e) {
          console.error("[rate-limit] put failed", e instanceof Error ? e.name : "error");
        }
      },
    };
  } catch (e) {
    console.error("[rate-limit] check failed", e instanceof Error ? e.name : "error");
    return OPEN;
  }
}

export function rateLimitedResponse(rl: RateLimit): Response {
  return new Response(JSON.stringify({ success: false, code: "rate_limited", error: RATE_LIMIT_MESSAGE }), {
    status: 429,
    headers: { "content-type": "application/json", "retry-after": String(rl.retryAfter), "cache-control": "no-store" },
  });
}

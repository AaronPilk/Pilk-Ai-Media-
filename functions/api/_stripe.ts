/// <reference types="@cloudflare/workers-types" />
// Minimal Stripe REST client using fetch + Stripe's bracket form-encoding.
// Files prefixed with _ are NOT routed by Cloudflare Pages Functions.

export function formEncode(obj: Record<string, unknown>, prefix = ""): string {
  const parts: string[] = [];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined || val === null) continue;
    const k = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(val)) {
      val.forEach((v, i) => {
        if (v !== null && typeof v === "object") {
          parts.push(formEncode(v as Record<string, unknown>, `${k}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${k}[${i}]`)}=${encodeURIComponent(String(v))}`);
        }
      });
    } else if (typeof val === "object") {
      parts.push(formEncode(val as Record<string, unknown>, k));
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`);
    }
  }
  return parts.filter(Boolean).join("&");
}

export async function stripe(
  path: string,
  secret: string,
  params?: Record<string, unknown>,
  opts: { method?: string; idempotencyKey?: string } = {}
): Promise<any> {
  const method = opts.method ?? "POST";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secret}`,
    "Stripe-Version": "2024-06-20",
  };
  let url = `https://api.stripe.com/v1/${path}`;
  let body: string | undefined;
  if (method === "GET" && params) {
    url += "?" + formEncode(params);
  } else if (params) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = formEncode(params);
  }
  if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
  const res = await fetch(url, { method, headers, body });
  const data = (await res.json()) as any;
  if (!res.ok) throw new Error(data?.error?.message || `Stripe ${path} failed (${res.status})`);
  return data;
}

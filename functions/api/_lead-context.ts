/// <reference types="@cloudflare/workers-types" />
// Small helpers the lead functions share for the CRM: what a visitor picked
// (template or package) and its starting price, where they came from, and
// plain-text lines for the GoHighLevel note. Files prefixed _ aren't routed.
import { getTemplate } from "../../src/content/templates";
import { hostingPlan, mortgagePackage, packageStartingPrice, packages } from "../../src/content/packages";

/** "Label: value", or "" when there is no value (dropped from the note). */
export function line(label: string, value: unknown): string {
  const v = Array.isArray(value) ? value.filter(Boolean).join(", ") : String(value ?? "").trim();
  return v ? `${label}: ${v}` : "";
}

/** Origin and path of an http(s) URL, without the query (which can carry click IDs). */
export function pageUrlOf(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) {
    if (!c) continue;
    try {
      const u = new URL(c);
      if (u.protocol === "https:" || u.protocol === "http:") return `${u.origin}${u.pathname}`.slice(0, 500);
    } catch {
      /* not a URL; try the next one */
    }
  }
  return "";
}

/** The path of a URL ("/start/rate-ready/"), or "" if it isn't one. */
export function pathOf(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).pathname.slice(0, 300);
  } catch {
    return url.startsWith("/") ? url.split("?")[0].slice(0, 300) : "";
  }
}

function packageName(id: string): string {
  if (id === mortgagePackage.id) return mortgagePackage.name;
  if (id === hostingPlan.id) return hostingPlan.name;
  return packages.find((p) => p.id === id)?.name ?? "";
}

export type QuoteContext = {
  templateSlug: string;
  templateName: string;
  packageId: string;
  packageName: string;
  /** the package's (or else the template's) starting figure in dollars */
  monetaryValue?: number;
  /** " (RateReady)" for an opportunity name, or "" */
  suffix: string;
};

/**
 * What the visitor chose, as far as the form knows. A package from a pricing
 * card wins over a template for the value, because it describes the scope.
 */
export function quoteContext(templateSlug?: string, packageId?: string): QuoteContext {
  const slug = String(templateSlug ?? "").trim();
  const pkg = String(packageId ?? "").trim();
  const tpl = slug ? getTemplate(slug) : undefined;
  const pkgName = pkg ? packageName(pkg) : "";
  const templateValue = tpl && tpl.price > 0 ? tpl.price : undefined;
  const monetaryValue = packageStartingPrice(pkg) ?? templateValue;
  const label = tpl?.name || pkgName || "";
  return {
    templateSlug: slug,
    templateName: tpl?.name ?? slug,
    packageId: pkg,
    packageName: pkgName,
    monetaryValue,
    suffix: label ? ` (${label})` : "",
  };
}

type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
};

/** Where the visitor came from, for the end of the GHL note. fbclid lives only here. */
export function attributionLines(d: Attribution, pageUrl: string): string[] {
  return [
    line("Form page", pageUrl),
    line("Landing page", d.landingPage),
    line("Referrer", d.referrer),
    line("UTM source", d.utmSource),
    line("UTM medium", d.utmMedium),
    line("UTM campaign", d.utmCampaign),
    line("UTM content", d.utmContent),
    line("UTM term", d.utmTerm),
    line("Google click ID", d.gclid),
    line("Facebook click ID", d.fbclid),
  ];
}

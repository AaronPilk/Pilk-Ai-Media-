import type { BuiltSite } from "@/types/built-site";

/**
 * Pilk.ai Media's real website builds, shown in the Website Showcase.
 *
 * AARON:
 * - Labels are set to "Client Build" for real businesses — change any that are
 *   concept/internal/personal to the honest label.
 * - For a full website screenshot (better than the hero image), drop:
 *     public/showcase-sites/<slug>/desktop.webp  (+ mobile.webp, preview.mp4, poster.webp)
 *   and point the `assets` paths at it. Until then a clean preview renders.
 * - Add `liveUrl` to make a card link out to the live site.
 */
export const builtSites: BuiltSite[] = [
  {
    slug: "stephenie-tocado",
    name: "Stephenie Tocado Real Estate",
    label: "Client Build",
    industry: "Real Estate",
    summary:
      "A cinematic real-estate website with featured listings, neighborhoods, home valuation, and lead capture.",
    accent: "#7c3aed",
    sourceFolder: "Stepehenie Tocado Real estste/",
    assets: { desktop: "/showcase-sites/stephenie-tocado/desktop.jpg" },
    services: ["Design", "Development", "Lead Capture"],
  },
  {
    slug: "ballantyne-title",
    name: "Ballantyne Title JV",
    label: "Client Build",
    industry: "Title",
    summary:
      "A clean, credible title-company site built around services, locations, and quote requests.",
    accent: "#9d6bff",
    sourceFolder: "Ballantyne title JV stand alone/",
    assets: { desktop: "/showcase-sites/ballantyne-title/desktop.jpg" },
    services: ["Design", "Development", "Conversion"],
  },
  {
    slug: "carnegie-title",
    name: "Carnegie Title",
    label: "Client Build",
    industry: "Title",
    summary:
      "A professional title-company website focused on trust, services, and fast quote requests.",
    accent: "#6d5bd0",
    sourceFolder: "Carnegie Title/",
    assets: { desktop: "/showcase-sites/carnegie-title/desktop.jpg" },
    services: ["Design", "Development"],
  },
  {
    slug: "refine-title",
    name: "Refine Title",
    label: "Client Build",
    industry: "Title",
    summary:
      "A refined title-services brand and website built to convert referral and direct traffic.",
    accent: "#8b5cf6",
    sourceFolder: "Refine Title/",
    assets: { desktop: "/showcase-sites/refine-title/desktop.jpg" },
    services: ["Design", "Development"],
  },
  {
    slug: "star-processing",
    name: "Star Processing",
    label: "Client Build",
    industry: "Mortgage / Processing",
    summary:
      "A trust-driven loan-processing website with services, team, and a clear inquiry path.",
    accent: "#a78bfa",
    sourceFolder: "Star Processing/",
    assets: { desktop: "/showcase-sites/star-processing/desktop.jpg" },
    services: ["Design", "Development", "Lead Capture"],
  },
  {
    slug: "stage-echo",
    name: "Stage Echo",
    label: "Client Build",
    industry: "Events",
    summary:
      "An events brand and website built around story, energy, and booking inquiries.",
    accent: "#7c3aed",
    sourceFolder: "Stage Echo/",
    assets: { desktop: "/showcase-sites/stage-echo/desktop.jpg" },
    services: ["Design", "Development", "Motion"],
  },
];

export function getBuiltSite(slug: string) {
  return builtSites.find((site) => site.slug === slug);
}

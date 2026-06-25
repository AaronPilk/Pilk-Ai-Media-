import type { BuiltSite } from "@/types/built-site";

/**
 * Previous website builds shown in the Website Showcase.
 *
 * AARON — to add a real build:
 * 1. Drop assets in:  public/showcase-sites/<slug>/desktop.webp (+ mobile.webp, preview.mp4, poster.webp)
 * 2. Fill the `assets` paths below, e.g.:
 *      assets: {
 *        desktop: "/showcase-sites/luxury-agent-build/desktop.webp",
 *        mobile:  "/showcase-sites/luxury-agent-build/mobile.webp",
 *        video:   "/showcase-sites/luxury-agent-build/preview.mp4",
 *        poster:  "/showcase-sites/luxury-agent-build/poster.webp",
 *      }
 * 3. Change `label` to "Client Build" ONLY if it's real, approved client work.
 *
 * While `assets` are empty, a premium faux-browser mockup renders automatically —
 * the section still looks good before any files exist.
 */
export const builtSites: BuiltSite[] = [
  {
    slug: "luxury-agent-build",
    name: "Luxury Agent Build",
    label: "Coming Soon",
    industry: "Real Estate",
    summary:
      "A cinematic real-estate website built to make a single agent's brand feel as premium as the homes they sell.",
    accent: "#7c3aed",
    sourceFolder: "public/showcase-sites/luxury-agent-build/",
    assets: {}, // AARON: add desktop/mobile/video/poster here
    services: ["Design", "Development", "Lead Capture"],
  },
  {
    slug: "brokerage-build",
    name: "Brokerage Build",
    label: "Coming Soon",
    industry: "Brokerage",
    summary:
      "A team-focused brokerage website with agent roster, listings, recruiting, and clear inquiry paths.",
    accent: "#9d6bff",
    sourceFolder: "public/showcase-sites/brokerage-build/",
    assets: {}, // AARON: add desktop/mobile/video/poster here
    services: ["UX", "Website Build", "Conversion"],
  },
  {
    slug: "custom-business-build",
    name: "Custom Business Build",
    label: "Coming Soon",
    industry: "Local Business",
    summary:
      "A fully custom local-business website built around the brand, offer, and the way its customers actually decide.",
    accent: "#6d5bd0",
    sourceFolder: "public/showcase-sites/custom-business-build/",
    assets: {}, // AARON: add desktop/mobile/video/poster here
    services: ["Design", "Development", "Motion"],
  },
];

export function getBuiltSite(slug: string) {
  return builtSites.find((site) => site.slug === slug);
}

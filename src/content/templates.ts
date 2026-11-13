import type { TemplateCategory, WebsiteTemplate } from "@/types/template";
import { QUOTED_PER_PROJECT, startingAt } from "../lib/pricing";

export const templateCategories: { id: TemplateCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "agent", label: "Real Estate Agent" },
    { id: "luxury-agent", label: "Luxury Real Estate" },
    { id: "brokerage", label: "Brokerage" },
    { id: "mortgage", label: "Mortgage" },
    { id: "local-business", label: "Property Management" },
    { id: "custom", label: "Custom" },
  ];

/**
 * Choosable website templates. Each real-estate template is a real, browsable
 * site at public/template-previews/<slug>/index.html, opened via `liveUrl`
 * (the folder URL: Cloudflare 308-redirects /index.html to it).
 *
 * AARON — to refresh card/detail thumbnails, run:
 *   node scripts/capture-templates.mjs
 * (writes public/template-previews/<slug>/desktop.jpg). Until then a faux preview shows.
 */
export const templates: WebsiteTemplate[] = [
  {
    slug: "modern-agent",
    name: "Real Estate Agent",
    category: "agent",
    label: "Template",
    accent: "#1f6feb",
    shortDescription:
      "A clean personal site for an individual agent — just showcase you, your listings, and how to reach you. The fast, simple option.",
    price: 1000,
    pages: 4,
    timeline: "7-day build available",
    featured: true,
    liveUrl: "/template-previews/modern-agent/",
    preview: { desktop: "/template-previews/modern-agent/desktop.jpg" },
    features: ["Personal hero & bio", "About / your story", "Recent sales showcase", "Testimonials", "Contact & lead form", "Mobile responsive"],
    upgrades: ["Blog / market updates", "Neighborhood guides", "CRM connection", "Custom copywriting"],
  },
  {
    slug: "signature-estate",
    name: "Signature Estate",
    category: "luxury-agent",
    label: "Premium Template",
    accent: "#b08d57",
    shortDescription:
      "A luxury, editorial real-estate template for agents who want their website to feel as premium as the properties they sell.",
    price: 1000,
    pages: 6,
    timeline: "7–10 day build available",
    featured: true,
    liveUrl: "/template-previews/signature-estate/",
    preview: { desktop: "/template-previews/signature-estate/desktop.jpg" },
    features: ["Editorial homepage", "Luxury listing showcase", "Neighborhood section", "Agent story", "Lead capture", "Mobile responsive"],
    upgrades: ["IDX / MLS integration", "Custom listing pages", "Video hero", "CRM automation"],
  },
  {
    slug: "brokerage-command",
    name: "Brokerage Command",
    category: "brokerage",
    label: "Premium Template",
    accent: "#3b82f6",
    shortDescription:
      "A bold, team-focused brokerage website with agent roster, featured properties, recruiting, and inquiry paths.",
    price: 1000,
    pages: 7,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/brokerage-command/",
    preview: { desktop: "/template-previews/brokerage-command/desktop.jpg" },
    features: ["Brokerage homepage", "Agent roster", "Listings section", "Recruiting page", "Lead routing", "Mobile responsive"],
    upgrades: ["IDX / MLS integration", "Agent profile pages", "Office location pages", "CRM routing"],
  },
  {
    slug: "coastal-luxe",
    name: "Coastal Luxe",
    category: "luxury-agent",
    label: "Premium Template",
    accent: "#1f7a6b",
    shortDescription:
      "A warm, coastal real-estate template built around lifestyle — perfect for beach, waterfront, and resort markets.",
    price: 1000,
    pages: 6,
    timeline: "7–10 day build available",
    featured: true,
    liveUrl: "/template-previews/coastal-luxe/",
    preview: { desktop: "/template-previews/coastal-luxe/desktop.jpg" },
    features: ["Coastal homepage", "Home search", "Lifestyle section", "Team bio", "Lead form", "Mobile responsive"],
    upgrades: ["IDX / MLS integration", "Neighborhood guides", "Video tours", "CRM connection"],
  },
  {
    slug: "urban-loft",
    name: "Urban Loft",
    category: "agent",
    label: "Premium Template",
    accent: "#8b5cf6",
    shortDescription:
      "A dark, modern template for downtown condos, lofts, and new developments — sleek residences and amenity storytelling.",
    price: 1000,
    pages: 6,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/urban-loft/",
    preview: { desktop: "/template-previews/urban-loft/desktop.jpg" },
    features: ["Residences homepage", "Availability list", "Amenities section", "About / story", "Inquiry form", "Mobile responsive"],
    upgrades: ["Floor-plan pages", "Availability sync", "3D / video tours", "CRM connection"],
  },
  {
    slug: "mortgage-broker",
    name: "Beacon Lending",
    category: "mortgage",
    label: "Template",
    accent: "#0f766e",
    shortDescription:
      "A trust-driven teal lending site with loan programs, a working payment calculator, and a clean application path.",
    price: 500,
    pages: 6,
    timeline: "14-day build available",
    featured: true,
    liveUrl: "/template-previews/mortgage-broker/",
    preview: { desktop: "/template-previews/mortgage-broker/desktop.jpg" },
    features: ["Lender homepage", "Loan programs", "Payment calculator", "Reviews", "Application form", "GoHighLevel-ready"],
    upgrades: ["Full GHL build-out", "MLS connection", "Automated follow-up", "Rate feed"],
  },
  ...([
    ["rate-ready", "RateReady", "#2563eb", "Fintech-modern and crisp — electric blue on white, built for speed-to-close messaging."],
    ["home-first", "HomeFirst", "#c2571b", "Warm, family-friendly cream and terracotta — the approachable neighborhood lender."],
    ["trust-lending", "TrustPoint", "#0d2247", "Corporate navy and gold — established, bank-grade trust for brokerages."],
    ["clear-mortgage", "ClearPath", "#16a34a", "Minimal white editorial — huge whitespace, plain-spoken 'mortgages made clear' energy."],
    ["summit-loans", "Summit", "#4f46e5", "Bold indigo-violet gradients and glassy cards — energetic, modern, ambitious."],
    ["keystone-lending", "Keystone Capital", "#7a1f2b", "Classic private-bank ivory and burgundy — serif elegance for refined lenders."],
    ["velocity-mortgage", "Velocity", "#22d3ee", "Dark and electric with cyan glow — fast-closing, tech-forward lending."],
    ["harbor-lending", "Harbor", "#0e7490", "Coastal sea-glass and ocean teal — relaxed design for waterfront and vacation markets."],
    ["prime-rate", "PrimeRate", "#15803d", "Data-forward money-green with rate tables — for lenders who compete on rate."],
    ["legacy-mortgage", "Legacy", "#b08d57", "Editorial luxury in charcoal and bronze — jumbo and portfolio lending for remarkable homes."],
    ["swift-approve", "SwiftApprove", "#f97362", "Friendly coral and rounded — first-time-buyer focused, warm and headache-free."],
    ["metro-lending", "Metro", "#dc2626", "Urban monochrome with a single red accent — big-city condo and conventional lending."],
    ["golden-oak", "Golden Oak", "#d9a441", "Warm gold on deep brown — cozy-premium, family-estate lending with heritage feel."],
    ["north-star", "NorthStar", "#1e3a8a", "Split-screen modern in midnight blue — crisp, geometric, guidance-driven."],
  ] as const).map(([slug, name, accent, shortDescription]): WebsiteTemplate => ({
    slug,
    name,
    category: "mortgage",
    label: "Template",
    accent,
    shortDescription,
    price: 500,
    pages: 6,
    timeline: "14-day build available",
    featured: true,
    liveUrl: `/template-previews/${slug}/`,
    preview: {},
    features: ["Lender homepage", "Loan programs", "Working payment calculator", "Reviews", "Application form", "GoHighLevel-ready"],
    upgrades: ["Full GHL build-out", "MLS connection", "Automated follow-up", "Custom copywriting"],
  })),
  {
    slug: "single-property",
    name: "One Listing",
    category: "luxury-agent",
    label: "Premium Template",
    accent: "#9d6bff",
    shortDescription:
      "A dedicated single-property website for a luxury listing — cinematic hero, gallery, details, neighborhood, and inquiry.",
    price: 1000,
    pages: 5,
    timeline: "5–7 day build available",
    featured: true,
    liveUrl: "/template-previews/single-property/",
    preview: { desktop: "/template-previews/single-property/desktop.jpg" },
    features: ["Property hero", "Photo gallery", "Features & details", "Neighborhood", "Inquiry form", "Mobile responsive"],
    upgrades: ["3D / video tour", "Floor plans", "Schedule a showing", "Custom domain"],
  },
  {
    slug: "rental-management",
    name: "Tenant Hub",
    category: "local-business",
    label: "Premium Template",
    accent: "#2563eb",
    shortDescription:
      "A full property-management / rentals build — featured rentals, owner and tenant portals, and application paths. Every property-management site is custom-scoped.",
    price: 0,
    pages: 7,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/rental-management/",
    preview: { desktop: "/template-previews/rental-management/desktop.jpg" },
    features: ["Management homepage", "Featured rentals", "Owner services", "Tenant services", "Application form", "Mobile responsive"],
    upgrades: ["Rental sync / listings feed", "Tenant portal", "Online payments", "CRM connection"],
  },
  {
    slug: "listing-page",
    name: "Single Listing Page",
    category: "agent",
    label: "Template",
    accent: "#1f6feb",
    shortDescription:
      "A dedicated page for one listing — we build a fresh page for each of your properties as they come in. The affordable, per-listing option for agents.",
    price: 250,
    priceUnit: "per listing",
    pages: 1,
    timeline: "2–3 day build available",
    featured: true,
    liveUrl: "/template-previews/single-property/",
    preview: { desktop: "/template-previews/single-property/desktop.jpg" },
    features: ["Cinematic property hero", "Photo gallery", "Key details & features", "Neighborhood blurb", "Lead capture / inquiry", "Mobile responsive"],
    upgrades: ["Video / drone flythrough", "Floor plans", "Schedule a showing", "IDX listing sync"],
  },
  {
    slug: "custom-site",
    name: "Custom Site",
    category: "custom",
    label: "Custom",
    accent: "#a78bfa",
    shortDescription:
      "A fully custom website built from zero around your brand, offer, content, market, and required functionality — like this very site.",
    price: 2500,
    pages: 0,
    timeline: "Timeline based on scope",
    featured: true,
    liveUrl: "/",
    preview: {},
    features: ["Original creative direction", "Custom page structure", "Custom visual design", "Custom motion", "Lead strategy", "Integration planning"],
    upgrades: [],
  },
];

/** "Starting at $1,000", or "Quoted per project" when there's no starting figure. */
export function templatePriceLabel(t: Pick<WebsiteTemplate, "price" | "priceUnit">): string {
  return t.price > 0 ? startingAt(t.price, t.priceUnit) : QUOTED_PER_PROJECT;
}

export function getTemplate(slug: string): WebsiteTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getRelatedTemplates(slug: string, limit = 3): WebsiteTemplate[] {
  const current = getTemplate(slug);
  if (!current) return templates.slice(0, limit);
  return templates
    .filter((t) => t.slug !== slug)
    .sort((a, b) => (a.category === current.category ? -1 : 1))
    .slice(0, limit);
}

/** Maps a template's label to the contact wizard project type. */
export function templateProjectType(label: WebsiteTemplate["label"]): string {
  if (label === "Premium Template") return "premium-template";
  if (label === "Custom") return "custom";
  return "template";
}

import type { TemplateCategory, WebsiteTemplate } from "@/types/template";

export const templateCategories: { id: TemplateCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "agent", label: "Real Estate Agent" },
    { id: "luxury-agent", label: "Luxury Real Estate" },
    { id: "brokerage", label: "Brokerage" },
    { id: "custom", label: "Custom" },
  ];

/**
 * Choosable website templates.
 *
 * AARON — add real template preview files here:
 *   public/templates/<template-slug>/desktop.webp
 *   public/templates/<template-slug>/mobile.webp
 *   public/templates/<template-slug>/preview.mp4
 * Then set the matching `preview` paths below. Until then, a faux-browser preview renders.
 */
export const templates: WebsiteTemplate[] = [
  {
    slug: "modern-agent",
    name: "Modern Agent",
    category: "agent",
    label: "Template",
    accent: "#7c3aed",
    shortDescription:
      "A clean personal-brand website for real-estate agents who need a sharp online presence fast.",
    price: 750,
    pages: 4,
    timeline: "7-day build available",
    featured: true,
    preview: {},
    features: [
      "Home page",
      "Agent bio",
      "Featured properties",
      "Lead form",
      "Social links",
      "Mobile responsive",
    ],
    upgrades: [
      "IDX / MLS integration",
      "Neighborhood pages",
      "CRM connection",
      "Custom copywriting",
    ],
  },
  {
    slug: "signature-estate",
    name: "Signature Estate",
    category: "luxury-agent",
    label: "Premium Template",
    accent: "#9d6bff",
    shortDescription:
      "A luxury real-estate template built for agents who want their website to feel as premium as the properties they sell.",
    price: 1000,
    pages: 6,
    timeline: "7–10 day build available",
    featured: true,
    preview: {},
    features: [
      "Editorial homepage",
      "Luxury listing showcase",
      "Neighborhood section",
      "Agent story",
      "Lead capture",
      "Mobile responsive",
    ],
    upgrades: ["IDX / MLS integration", "Custom listing pages", "Video hero", "CRM automation"],
  },
  {
    slug: "brokerage-command",
    name: "Brokerage Command",
    category: "brokerage",
    label: "Premium Template",
    accent: "#6d5bd0",
    shortDescription:
      "A team-focused brokerage website with agent roster, featured properties, recruiting, and inquiry paths.",
    price: 1500,
    pages: 7,
    timeline: "10–14 day build available",
    featured: true,
    preview: {},
    features: [
      "Brokerage homepage",
      "Agent roster",
      "Listings section",
      "Recruiting page",
      "Lead routing",
      "Mobile responsive",
    ],
    upgrades: ["IDX / MLS integration", "Agent profile pages", "Office location pages", "CRM routing"],
  },
  {
    slug: "custom-site",
    name: "Custom Site",
    category: "custom",
    label: "Custom",
    accent: "#a78bfa",
    shortDescription:
      "A fully custom website built from zero around your brand, offer, content, market, and required functionality.",
    price: 2500,
    pages: 0,
    timeline: "Timeline based on scope",
    featured: true,
    preview: {},
    features: [
      "Original creative direction",
      "Custom page structure",
      "Custom visual design",
      "Custom motion",
      "Lead strategy",
      "Integration planning",
    ],
    upgrades: [],
  },
];

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

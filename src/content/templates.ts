import type { TemplateCategory, WebsiteTemplate } from "@/types/template";

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
 * site at public/template-previews/<slug>/index.html — opened via `liveUrl`.
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
    price: 750,
    pages: 4,
    timeline: "7-day build available",
    featured: true,
    liveUrl: "/template-previews/modern-agent/index.html",
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
    liveUrl: "/template-previews/signature-estate/index.html",
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
    price: 1500,
    pages: 7,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/brokerage-command/index.html",
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
    price: 1200,
    pages: 6,
    timeline: "7–10 day build available",
    featured: true,
    liveUrl: "/template-previews/coastal-luxe/index.html",
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
    price: 1500,
    pages: 6,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/urban-loft/index.html",
    preview: { desktop: "/template-previews/urban-loft/desktop.jpg" },
    features: ["Residences homepage", "Availability list", "Amenities section", "About / story", "Inquiry form", "Mobile responsive"],
    upgrades: ["Floor-plan pages", "Availability sync", "3D / video tours", "CRM connection"],
  },
  {
    slug: "mortgage-broker",
    name: "Lender Pro",
    category: "mortgage",
    label: "Premium Template",
    accent: "#0f766e",
    shortDescription:
      "A trust-driven mortgage / lending website with loan programs, a rate-style calculator, and a clean application path.",
    price: 1200,
    pages: 6,
    timeline: "7–10 day build available",
    featured: true,
    liveUrl: "/template-previews/mortgage-broker/index.html",
    preview: { desktop: "/template-previews/mortgage-broker/desktop.jpg" },
    features: ["Lender homepage", "Loan programs", "Payment calculator", "Reviews", "Application CTA", "Mobile responsive"],
    upgrades: ["Application integration", "CRM connection", "Automated follow-up", "Rate feed"],
  },
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
    liveUrl: "/template-previews/single-property/index.html",
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
      "A property-management / rentals website with featured rentals, owner and tenant services, and application paths.",
    price: 1500,
    pages: 7,
    timeline: "10–14 day build available",
    featured: true,
    liveUrl: "/template-previews/rental-management/index.html",
    preview: { desktop: "/template-previews/rental-management/desktop.jpg" },
    features: ["Management homepage", "Featured rentals", "Owner services", "Tenant services", "Application form", "Mobile responsive"],
    upgrades: ["Rental sync / listings feed", "Tenant portal", "Online payments", "CRM connection"],
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

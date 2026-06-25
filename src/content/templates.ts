import type { TemplateCategory, WebsiteTemplate } from "@/types/template";

export const templateCategories: { id: TemplateCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "agent", label: "Real Estate Agent" },
    { id: "luxury-agent", label: "Luxury Real Estate" },
    { id: "brokerage", label: "Brokerage" },
    { id: "mortgage", label: "Mortgage" },
    { id: "title", label: "Title" },
    { id: "local-business", label: "Local Business" },
    { id: "custom", label: "Custom" },
  ];

/** Conceptual designs — labeled honestly. Add real screenshots/video to `preview` later. */
export const templates: WebsiteTemplate[] = [
  {
    slug: "modern-agent",
    name: "Modern Agent",
    category: "agent",
    label: "Template",
    accent: "#7c3aed",
    shortDescription:
      "A polished personal-brand website for agents who need a professional presence without a long custom build.",
    price: 750,
    pages: 4,
    timeline: "Approximately 1–2 weeks",
    featured: true,
    preview: {},
    features: [
      "Mobile-responsive design",
      "Agent profile",
      "Featured properties section",
      "Lead inquiry form",
      "Social media links",
      "Basic analytics setup",
    ],
    upgrades: [
      "Additional pages",
      "IDX or MLS integration",
      "Custom copywriting",
      "CRM connection",
      "Automated lead follow-up",
    ],
  },
  {
    slug: "signature-estate",
    name: "Signature Estate",
    category: "luxury-agent",
    label: "Template",
    accent: "#9d6bff",
    shortDescription:
      "An editorial luxury template built around premium listings, strong photography, and an elevated personal brand.",
    price: 1000,
    pages: 6,
    timeline: "Approximately 2–3 weeks",
    featured: true,
    preview: {},
    features: [
      "Editorial homepage",
      "Property showcase",
      "Neighborhood pages",
      "Agent biography",
      "Lead forms",
      "Analytics setup",
    ],
    upgrades: [
      "IDX or MLS integration",
      "Property search",
      "Custom video",
      "CRM connection",
      "Custom animations",
    ],
  },
  {
    slug: "coastal-brokerage",
    name: "Coastal Brokerage",
    category: "brokerage",
    label: "Concept",
    accent: "#6d5bd0",
    shortDescription:
      "A team-first brokerage site with agent rosters, listings, and a clear recruiting and lead path.",
    price: 1000,
    pages: 7,
    timeline: "Approximately 2–4 weeks",
    featured: true,
    preview: {},
    features: [
      "Team roster",
      "Office & listings",
      "Recruiting page",
      "Lead routing",
      "Blog / market updates",
      "Analytics setup",
    ],
    upgrades: ["IDX or MLS integration", "Agent subdomains", "CRM connection", "Automation"],
  },
  {
    slug: "summit-mortgage",
    name: "Summit Mortgage",
    category: "mortgage",
    label: "Concept",
    accent: "#7c3aed",
    shortDescription:
      "A trust-driven mortgage professional site with calculators, programs, and an application path.",
    price: 1000,
    pages: 5,
    timeline: "Approximately 2–3 weeks",
    featured: false,
    preview: {},
    features: [
      "Loan programs",
      "Rate / payment calculator",
      "Application CTA",
      "Reviews section",
      "Lead form",
      "Analytics setup",
    ],
    upgrades: ["CRM connection", "Application integration", "Automated follow-up"],
  },
  {
    slug: "meridian-title",
    name: "Meridian Title",
    category: "title",
    label: "Concept",
    accent: "#5b54c9",
    shortDescription:
      "A clean, credible title-company site focused on services, locations, and quote requests.",
    price: 750,
    pages: 5,
    timeline: "Approximately 1–2 weeks",
    featured: false,
    preview: {},
    features: [
      "Services overview",
      "Locations",
      "Quote request",
      "Resources",
      "Contact",
      "Analytics setup",
    ],
    upgrades: ["Quote automation", "CRM connection", "Document portal"],
  },
  {
    slug: "custom-experience",
    name: "Custom Experience",
    category: "custom",
    label: "Custom",
    accent: "#9d6bff",
    shortDescription:
      "A completely original website created around your business, market, audience, content, and integrations.",
    price: 2500,
    pages: 0,
    timeline: "Timeline determined by scope",
    featured: true,
    preview: {},
    features: [
      "Original creative direction",
      "Custom user experience",
      "Custom frontend development",
      "Advanced interaction",
      "Conversion strategy",
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

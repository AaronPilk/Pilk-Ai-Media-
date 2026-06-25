export type PackageTier = {
  id: "template" | "premium-template" | "custom";
  name: string;
  price: number;
  priceLabel: string;
  summary: string;
  features: string[];
  cta: { label: string; href: string };
  mostPopular?: boolean;
  disclaimer?: string;
};

/** Edit prices/features/CTAs here — no component changes needed. */
export const packages: PackageTier[] = [
  {
    id: "template",
    name: "Template Website",
    price: 750,
    priceLabel: "Starting at $750",
    summary: "Start with an existing design and make it yours.",
    features: [
      "Start with an existing design",
      "Core page customization",
      "Brand colors and content",
      "Mobile responsive",
      "Lead form",
      "Standard launch setup",
    ],
    cta: { label: "Start with a template", href: "/contact?projectType=template" },
  },
  {
    id: "premium-template",
    name: "Premium Template",
    price: 1000,
    priceLabel: "Starting at $1,000",
    summary: "More layout, more customization, stronger storytelling.",
    features: [
      "Premium layout options",
      "More pages",
      "More customization",
      "Stronger visual storytelling",
      "Additional sections",
      "Enhanced motion",
    ],
    cta: { label: "Choose premium", href: "/contact?projectType=premium-template" },
    mostPopular: true,
  },
  {
    id: "custom",
    name: "Custom Website",
    price: 2500,
    priceLabel: "Starting at $2,500",
    summary: "Built from zero around your business and goals.",
    features: [
      "Original creative direction",
      "Custom UX",
      "Custom visual system",
      "Advanced interaction",
      "Integration planning",
      "Scope-based development",
    ],
    cta: { label: "Commission custom", href: "/contact?projectType=custom" },
  },
];

export const optionalUpgrades = [
  "Additional pages",
  "IDX / MLS integration",
  "Booking & scheduling",
  "Lead funnels",
  "Copywriting",
  "Hosting & maintenance",
  "CRM connections",
  "Automation",
  "Custom software",
];

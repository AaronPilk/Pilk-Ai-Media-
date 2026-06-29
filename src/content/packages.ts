export type PackageTier = {
  id: "template" | "premium-template" | "custom" | "crm";
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
      "Start with a proven design",
      "Your copy, photos & branding",
      "Brand colors and content",
      "Mobile responsive",
      "Lead capture form",
      "Launch in ~7 days",
    ],
    cta: { label: "Start with a template", href: "/templates" },
  },
  {
    id: "premium-template",
    name: "Premium Template",
    price: 1000,
    priceLabel: "Starting at $1,000",
    summary: "More layout, more customization, stronger storytelling.",
    features: [
      "Premium layout options",
      "More pages & sections",
      "Deeper customization",
      "Stronger visual storytelling",
      "Enhanced motion",
      "Lead capture form",
    ],
    cta: { label: "Choose premium", href: "/templates" },
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
      "Custom UX & visual system",
      "Advanced interaction & motion",
      "Conversion-focused build",
      "Integration planning",
      "Scope-based development",
    ],
    cta: { label: "Commission custom", href: "/contact?projectType=custom" },
  },
  {
    id: "crm",
    name: "Custom Website + Full CRM",
    price: 5000,
    priceLabel: "$5,000",
    summary: "A custom site plus a complete GoHighLevel CRM built to run your business.",
    features: [
      "Everything in Custom Website",
      "Full GoHighLevel (GHL) build-out",
      "Lead pipelines & stages",
      "Automated follow-up (SMS + email)",
      "Calendars & booking automation",
      "Forms, funnels & nurture sequences",
      "Reputation / review automation",
      "Setup, wiring & handoff training",
    ],
    cta: { label: "Build my system", href: "/contact?projectType=custom&package=crm-buildout" },
  },
];

/** Recurring plan — rendered as its own banner under the build tiers. */
export const hostingPlan = {
  name: "Hosting & Ongoing Support",
  priceLabel: "$199",
  priceSuffix: "/month",
  summary:
    "Keep your site fast, secure, and handled. Hosting, monitoring, backups, and ongoing edits + support — month to month, cancel anytime.",
  features: [
    "Managed hosting & SSL",
    "Uptime monitoring & backups",
    "Security & software updates",
    "Ongoing content / copy edits",
    "Priority support",
    "Monthly — no long-term contract",
  ],
  cta: { label: "Add hosting & support", href: "/contact?projectType=custom&package=hosting" },
};

export const optionalUpgrades = [
  "Additional pages",
  "IDX / MLS integration",
  "Booking & scheduling",
  "Lead funnels",
  "Copywriting",
  "CRM connections",
  "Automation",
  "Custom software",
];

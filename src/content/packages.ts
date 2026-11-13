import { startingAt } from "../lib/pricing";

export type PackageTier = {
  id: "listing" | "template" | "premium-template" | "custom" | "crm";
  name: string;
  /** The lowest figure the package starts at, in dollars. Never a flat price. */
  price: number;
  /** Optional unit after the figure, e.g. "per listing". */
  priceUnit?: string;
  priceLabel: string;
  summary: string;
  features: string[];
  cta: { label: string; href: string };
  mostPopular?: boolean;
  disclaimer?: string;
};

function tier(t: Omit<PackageTier, "priceLabel">): PackageTier {
  return { ...t, priceLabel: startingAt(t.price, t.priceUnit) };
}

/**
 * Edit starting prices/features/CTAs here — no component changes needed.
 * `package=` in a CTA is read by the /contact/ brief and travels with the lead,
 * so the CRM knows which card the visitor came from.
 */
export const packages: PackageTier[] = [
  tier({
    id: "listing",
    name: "Single Listing Page",
    price: 250,
    priceUnit: "per listing",
    summary: "A dedicated page for one listing — a fresh page built for each property as it comes in.",
    features: [
      "One property, one standout page",
      "Cinematic hero + photo gallery",
      "Key details & neighborhood",
      "Lead capture / inquiry",
      "Mobile responsive",
      "2–3 day turnaround",
    ],
    cta: { label: "Get a quote", href: "/contact/?projectType=template&template=listing-page&package=listing" },
  }),
  tier({
    id: "template",
    name: "Complete Website",
    price: 1000,
    summary: "A full website — start from a proven design and make it your own.",
    features: [
      "Start from a proven design",
      "Your copy, photos & branding",
      "Multiple pages & sections",
      "Enhanced motion",
      "Mobile responsive",
      "Lead capture form",
    ],
    cta: { label: "Start with a template", href: "/templates/" },
    mostPopular: true,
  }),
  tier({
    id: "custom",
    name: "Custom Website",
    price: 2500,
    summary: "Built from zero around your business and goals.",
    features: [
      "Original creative direction",
      "Custom UX & visual system",
      "Advanced interaction & motion",
      "Conversion-focused build",
      "Integration planning",
      "Scope-based development",
    ],
    cta: { label: "Get a quote", href: "/contact/?projectType=custom&package=custom" },
  }),
  tier({
    id: "crm",
    name: "Custom Website + Full CRM",
    price: 5000,
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
    cta: { label: "Get a quote", href: "/contact/?projectType=custom&package=crm" },
  }),
];

/**
 * Mortgage websites are their own package (15 designs on /mortgage/). The
 * figure is the lowest a mortgage website starts at; add-ons are quoted.
 */
export const mortgagePackage = {
  id: "mortgage" as const,
  name: "Mortgage Website",
  price: 500,
};

/**
 * Recurring plan — rendered as its own banner under the build tiers. Plans
 * start at the mortgage plan's figure; what a client pays is in their proposal.
 */
export const hostingPlan = {
  id: "hosting" as const,
  name: "Hosting & Ongoing Support",
  priceFrom: 100,
  priceLabel: startingAt(100),
  priceSuffix: "/mo",
  availability: "Hosting and support plans available",
  summary:
    "Keep your site fast, secure, and handled. Hosting, monitoring, backups, and ongoing edits + support, set out in your proposal — month to month, cancel anytime.",
  features: [
    "Managed hosting & SSL",
    "Uptime monitoring & backups",
    "Security & software updates",
    "Ongoing content / copy edits",
    "Priority support",
    "Monthly — no long-term contract",
  ],
  cta: { label: "Ask about hosting", href: "/contact/?projectType=unsure&package=hosting" },
};

/** Package ids the CRM can attach a starting figure to. */
export type QuotePackageId = PackageTier["id"] | typeof mortgagePackage.id | typeof hostingPlan.id;

/**
 * The starting figure for a package id, for the CRM's opportunity value.
 * Undefined when the id is unknown or the package has no starting figure.
 */
export function packageStartingPrice(id: string | undefined): number | undefined {
  if (!id) return undefined;
  if (id === mortgagePackage.id) return mortgagePackage.price;
  if (id === hostingPlan.id) return undefined; // monthly, not a project value
  return packages.find((p) => p.id === id)?.price;
}

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

/**
 * Typical build times, by package. One source for the FAQ, the process note,
 * the mortgage page and the Terms, so a timeline can't say one thing on one
 * page and another elsewhere. Each template also lists its own build time in
 * src/content/templates.ts, inside the Complete Website range below.
 */
export const buildTimes = {
  listing: "2–3 days",
  template: "5–14 days, depending on the template",
  templateStandard: "seven days",
  mortgage: "about 14 days",
  mortgageRush: "5 days",
  custom: "a schedule based on scope, agreed in writing before we start",
} as const;

export const timelineNote =
  "Timelines depend on the package and scope. They start once we have your content, account access and approvals, and they move if those arrive late.";

/** Comes with every template build, on top of the template's own features. */
export const everyBuildIncludes = [
  "Built with your branding, copy & photos",
  "Mobile-responsive on every device",
  "Lead form that emails you every inquiry",
  "Click-to-call, email & map ready",
  "Basic on-page SEO setup",
  "Launched on your domain",
  "One round of revisions",
];

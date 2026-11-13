/**
 * Central brand + copy config. Edit here — never hardcode brand/copy in components.
 */
export const site = {
  name: "Pilk.ai",
  shortName: "Pilk.ai",
  domain: "pilk.ai",
  url: "https://pilk.ai",
  tagline: "Websites people remember.",
  description:
    "Pilk.ai is a St. Petersburg, Florida studio that builds websites and custom apps and sets up AI automation, ads and lead funnels that turn attention into business.",
  location: "St. Petersburg · Tampa Bay · Remote",

  // Search-facing copy. The on-page hero keeps the brand line above.
  seo: {
    homeTitle: "Pilk.ai — Websites, Apps & AI Consulting in St. Petersburg",
    description:
      "Pilk.ai builds websites and custom apps and sets up AI automation, ads and lead funnels for businesses in St. Petersburg and Tampa Bay, Florida.",
  },

  contact: {
    email: "Aaron@pilk.ai",
    phone: "(704) 877-3511",
    phoneHref: "tel:+17048773511",
    phoneE164: "+1-704-877-3511",
  },

  // Entity facts for search engines and structured data. Only verified facts
  // belong here: no street address (it is private), no ratings, no claims a
  // reader could not check.
  entity: {
    name: "Pilk.ai",
    legalName: "Pilk Consulting LLC",
    // The site used the name "Pilk.ai Media" until Nov 2026. It stays in the
    // JSON-LD only, so search engines connect old mentions to this entity.
    // Visible copy uses "Pilk.ai"; the legal line is brandLine below.
    alternateName: "Pilk.ai Media",
    founder: "Aaron Pilkington",
    locality: "St. Petersburg",
    region: "FL",
    regionName: "Florida",
    country: "US",
    areaServed: ["St. Petersburg, Florida", "Tampa Bay, Florida"],
  },

  // Real third-party profiles only. Instagram, LinkedIn and X are left out
  // until real URLs exist; a dead "#" link is worse than no link.
  profiles: [
    { label: "Clutch", href: "https://clutch.co/profile/pilkai" },
    { label: "Crunchbase", href: "https://www.crunchbase.com/organization/pilk-ai" },
    { label: "Sortlist", href: "https://www.sortlist.com/agency/pilk-ai" },
    { label: "Dribbble", href: "https://dribbble.com/aaron-pilkington" },
    { label: "Contra", href: "https://contra.com/aaron_pilkington_yesgau52" },
    { label: "Medium", href: "https://medium.com/@pilkai" },
    { label: "DEV", href: "https://dev.to/pilkai" },
  ],

  // Which of the profiles above the footer links to.
  footerProfiles: ["Clutch", "Crunchbase", "Dribbble", "Medium"],

  nav: [
    { label: "Mortgage", href: "/mortgage" },
    { label: "Real Estate", href: "/real-estate" },
    { label: "Rent vs Own", href: "/own-vs-rent" },
    { label: "Process", href: "/process" },
    { label: "Apps", href: "/apps" },
    { label: "Work", href: "/work" },
  ],

  cta: {
    primary: { label: "Start a Project", href: "/contact" },
    inquiry: { label: "Inquiry Now", href: "/inquiry" },
    primaryHomeLabel: "Explore Our Work",
    primaryHomeHref: "/work",
    secondaryHomeLabel: "Inquiry Now",
    secondaryHomeHref: "/inquiry",
  },

  hero: {
    eyebrow: "Independent design & development studio",
    headline: "Websites people remember.",
    headlineLines: ["Websites", "people remember."],
    sub: "We build high-conversion websites with cinematic design, custom interaction, and the technical infrastructure to turn attention into business.",
  },

  positioning: {
    eyebrow: "Positioning",
    headline: "A website shouldn't sit there. It should perform.",
    points: [
      { title: "Strategic structure", body: "Pages built around how buyers actually decide." },
      { title: "Premium visual design", body: "Original art direction, never a recycled theme." },
      { title: "Custom development", body: "Fast, responsive, maintainable, built to expand." },
      { title: "Conversion-focused", body: "Clear journeys, calls to action, and lead capture." },
      { title: "Tracking & integrations", body: "Analytics, forms, CRM, and automation wired in." },
      { title: "Mobile-first execution", body: "It has to feel premium on a phone first." },
    ],
  },

  capabilities: {
    eyebrow: "Why Pilk.ai",
    headline: "Design that gets attention. Structure that turns it into business.",
    items: [
      { title: "Design", body: "Original visual systems built around your business — not a generic theme." },
      { title: "Development", body: "Responsive, maintainable websites engineered for performance and future growth." },
      { title: "Conversion", body: "Clear user journeys, calls to action, lead capture, and tracking." },
      { title: "Execution", body: "Domains, hosting, analytics, forms, CRM, automation, and launch support." },
    ],
  },

  process: {
    eyebrow: "The seven-day build",
    headline: "From first conversation to a finished website in seven days.",
    sub: "A focused build process with clear decisions, fast communication, and no months of agency limbo.",
    timeline: [
      { day: "Day 1", title: "Kickoff and direction", body: "We discuss the business, audience, goals, offer, required pages, visual direction, and examples you like.", deliverable: "Approved project direction" },
      { day: "Day 2", title: "Structure and messaging", body: "We map the pages, calls to action, content order, lead path, and the information visitors need to make a decision.", deliverable: "Page structure and content plan" },
      { day: "Day 3", title: "Visual design", body: "The selected template is customized — or the custom visual system begins — with your colors, imagery, typography, and brand.", deliverable: "Designed homepage direction" },
      { day: "Day 4", title: "Website development", body: "The approved design becomes a responsive website with motion, navigation, forms, and core functionality.", deliverable: "Working responsive build" },
      { day: "Day 5", title: "Content and integrations", body: "We load the approved copy and media, connect lead forms, analytics, domains, CRM tools, and available integrations.", deliverable: "Complete working website" },
      { day: "Day 6", title: "Review and quality control", body: "You review the site while we test mobile devices, browsers, forms, links, speed, accessibility, and tracking.", deliverable: "Final approved revision" },
      { day: "Day 7", title: "Launch", body: "The website is connected to the production domain, final analytics are verified, and the new experience goes live.", deliverable: "Live website" },
    ],
    disclaimer: "The seven-day build applies to qualified projects on a standard template (Complete Website package) and starts once we have your content, account access and approvals. Other templates take 5–14 days, mortgage websites about 14, and custom builds get a schedule based on scope. Late content or approvals move the launch date.",
  },

  finalCta: {
    headline: "Let's build something worth remembering.",
    sub: "Tell us about your business. We'll show you what's possible.",
  },

  footer: {
    blurb: "Premium web design and development. Start with a template or commission something completely custom.",
    legalName: "Pilk Consulting LLC",
    brandLine: "Pilk.ai is a brand of Pilk Consulting LLC.",
  },

  pricingDisclaimer:
    "Final pricing is based on pages, content, integrations, functionality, and customization requirements.",
} as const;

export type SiteConfig = typeof site;

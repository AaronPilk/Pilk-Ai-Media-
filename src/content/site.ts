/**
 * Central brand + copy config. Edit here — never hardcode brand/copy in components.
 * Contact details are PLACEHOLDERS — replace before launch.
 */
export const site = {
  name: "Pilk.ai Media",
  shortName: "Pilk.ai",
  domain: "pilk.ai",
  url: "https://pilk.ai",
  tagline: "Websites people remember.",
  description:
    "Pilk.ai Media is an independent design and development studio building high-conversion websites with cinematic design, custom interaction, and the infrastructure to turn attention into business.",
  location: "St. Petersburg · Tampa Bay · Remote",

  // PLACEHOLDERS — replace before launch
  contact: {
    email: "hello@pilk.ai",
    phone: "+1 (000) 000-0000",
    phoneHref: "tel:+10000000000",
  },

  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],

  nav: [
    { label: "Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "Real Estate", href: "/real-estate" },
  ],

  cta: {
    primary: { label: "Start a Project", href: "/contact" },
    primaryHomeLabel: "Explore Our Work",
    primaryHomeHref: "/work",
    secondaryHomeLabel: "Start a Website",
    secondaryHomeHref: "/contact",
  },

  hero: {
    eyebrow: "Independent design & development studio",
    headline: "Websites people remember.",
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
    eyebrow: "Process",
    headline: "From first call to launch — in about 7 days.",
    sub: "One quick conversation to start. Roughly a week later, you're live.",
    steps: [
      { n: "01", day: "Day 1", title: "Discover", body: "A short call to learn your business, market, and the buyer you're trying to reach." },
      { n: "02", day: "Day 1", title: "Position", body: "We sharpen the offer, message, and structure before any design begins." },
      { n: "03", day: "Day 2", title: "Structure", body: "Wireframes and page architecture mapped directly to conversion." },
      { n: "04", day: "Day 3", title: "Design", body: "Original art direction, typography, and motion — built around your brand." },
      { n: "05", day: "Day 4–5", title: "Build", body: "Clean, fast, responsive development with your integrations wired in." },
      { n: "06", day: "Day 6", title: "Test", body: "Devices, browsers, speed, accessibility, and tracking — all checked." },
      { n: "07", day: "Day 7", title: "Launch", body: "You go live with hosting, analytics, and follow-up support." },
    ],
  },

  finalCta: {
    headline: "Let's build something worth remembering.",
    sub: "Tell us about your business. We'll show you what's possible.",
  },

  footer: {
    blurb: "Premium web design and development. Start with a template or commission something completely custom.",
    legalName: "Pilk.ai Media",
  },

  pricingDisclaimer:
    "Final pricing is based on pages, content, integrations, functionality, and customization requirements.",
} as const;

export type SiteConfig = typeof site;

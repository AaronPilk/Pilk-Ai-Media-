export type ExpStat = { v: string; l: string };
export type ExpScene = {
  at: number;
  align: "center" | "left" | "right";
  eyebrow: string;
  title: string;
  body?: string;
  stats?: ExpStat[];
  cta?: boolean;
};

export type ExpListing = { title: string; price: string; meta: string; img: string };

export type ExpSite = {
  brand: string;
  tagline: string;
  listingsEyebrow: string;
  listingsTitle: string;
  listings: ExpListing[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  agentName: string;
  agentTitle: string;
  agentImg: string;
  neighborhoodTitle: string;
  neighborhoodBody: string;
  neighborhoodImg: string;
  contactTitle: string;
  contactBody: string;
};

export type ExperienceConfig = {
  slug: string;
  label: string;
  blurb: string;
  framesDir: string;
  frameCount: number;
  scrollVh: number;
  video: string;
  poster: string;
  ctaHref: string;
  ctaLabel: string;
  scenes: ExpScene[];
  site: ExpSite;
};

const F = "/experience/mansion-v4/frames";

export const experiences: Record<string, ExperienceConfig> = {
  estate: {
    slug: "estate",
    label: "The Estate",
    blurb: "A continuous FPV drone tour of a modern waterfront mansion — buttery-smooth scrubbing with agent, firm, and property details revealing as you fly through.",
    framesDir: F,
    frameCount: 381,
    scrollVh: 1700,
    video: "/experience/mansion-v4/drone.mp4",
    poster: "/experience/mansion-v4/poster.jpg",
    ctaHref: "/contact?projectType=custom&service=real-estate",
    ctaLabel: "Schedule a private showing →",
    scenes: [
      { at: 0.04, align: "center", eyebrow: "Meridian Estates", title: "Welcome home.", body: "A waterfront estate, presented privately." },
      { at: 0.18, align: "left", eyebrow: "Now showing", title: "20 Bayshore Terrace", body: "A one-of-one architectural estate on open water." },
      { at: 0.33, align: "left", eyebrow: "The residence", title: "Built for the way you live.", stats: [{ v: "6", l: "Beds" }, { v: "8", l: "Baths" }, { v: "11,400", l: "Sq Ft" }, { v: "0.9", l: "Acres" }] },
      { at: 0.48, align: "right", eyebrow: "Features", title: "Infinity pool. Private dock. 180° water.", body: "Floor-to-ceiling glass and resort-grade finishes throughout." },
      { at: 0.62, align: "left", eyebrow: "Your agent", title: "Alexandra Reyes", body: "Luxury specialist with $1.2B+ in career sales — your private guide from first showing to closing." },
      { at: 0.76, align: "right", eyebrow: "The firm", title: "Meridian Estates", body: "Boutique representation, global reach — the name the market's finest listings trust." },
      { at: 0.9, align: "center", eyebrow: "Offered at $24,500,000", title: "Keep scrolling to explore the listing.", cta: false },
    ],
    site: {
      brand: "Meridian Estates",
      tagline: "Boutique luxury representation — by private appointment.",
      listingsEyebrow: "Featured listings",
      listingsTitle: "A private collection of waterfront estates.",
      listings: [
        { title: "20 Bayshore Terrace", price: "$24,500,000", meta: "6 BD · 8 BA · 11,400 SF", img: `${F}/frame-030.jpg` },
        { title: "The Glass House", price: "$18,900,000", meta: "5 BD · 6 BA · 8,900 SF", img: `${F}/frame-075.jpg` },
        { title: "Cascade Estate", price: "$31,000,000", meta: "7 BD · 9 BA · 14,200 SF", img: `${F}/frame-120.jpg` },
      ],
      aboutEyebrow: "The firm",
      aboutTitle: "Quietly, the most trusted name in luxury.",
      aboutBody: "Meridian Estates represents a curated portfolio of the market's most exceptional homes. Discreet, relationship-driven, and relentless on results — we sell the feeling of a property, not just its square footage.",
      agentName: "Alexandra Reyes",
      agentTitle: "Founder · Luxury Specialist · $1.2B+ sold",
      agentImg: `${F}/frame-095.jpg`,
      neighborhoodTitle: "Moments from the marina.",
      neighborhoodBody: "Minutes to downtown, the best dining, and the water. A world away from everything else.",
      neighborhoodImg: `${F}/frame-140.jpg`,
      contactTitle: "Arrange a private showing.",
      contactBody: "Tell us about what you're looking for and we'll arrange a private, no-pressure tour.",
    },
  },
};

export const experienceList = [experiences.estate];

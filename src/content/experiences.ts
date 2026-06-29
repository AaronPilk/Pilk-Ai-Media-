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

export const experiences: Record<string, ExperienceConfig> = {
  estate: {
    slug: "estate",
    label: "The Estate",
    blurb: "A continuous drone tour of a waterfront mansion — buttery-smooth scrubbing with agent, firm, and property details revealing as you fly through.",
    framesDir: "/experience/frames",
    frameCount: 161,
    scrollVh: 820,
    video: "/experience/drone.mp4",
    poster: "/experience/poster.jpg",
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
        { title: "20 Bayshore Terrace", price: "$24,500,000", meta: "6 BD · 8 BA · 11,400 SF", img: "/experience/frames/frame-030.jpg" },
        { title: "The Glass House", price: "$18,900,000", meta: "5 BD · 6 BA · 8,900 SF", img: "/experience/frames/frame-075.jpg" },
        { title: "Cascade Estate", price: "$31,000,000", meta: "7 BD · 9 BA · 14,200 SF", img: "/experience/frames/frame-120.jpg" },
      ],
      aboutEyebrow: "The firm",
      aboutTitle: "Quietly, the most trusted name in luxury.",
      aboutBody: "Meridian Estates represents a curated portfolio of the market's most exceptional homes. Discreet, relationship-driven, and relentless on results — we sell the feeling of a property, not just its square footage.",
      agentName: "Alexandra Reyes",
      agentTitle: "Founder · Luxury Specialist · $1.2B+ sold",
      agentImg: "/experience/frames/frame-095.jpg",
      neighborhoodTitle: "Moments from the marina.",
      neighborhoodBody: "Minutes to downtown, the best dining, and the water. A world away from everything else.",
      neighborhoodImg: "/experience/frames/frame-140.jpg",
      contactTitle: "Arrange a private showing.",
      contactBody: "Tell us about what you're looking for and we'll arrange a private, no-pressure tour.",
    },
  },
  skyline: {
    slug: "skyline",
    label: "The Skyline",
    blurb: "An aerial flight over a city-skyline penthouse tower — the same scroll-driven experience tuned for a luxury new-development feel.",
    framesDir: "/experience/v1/frames",
    frameCount: 160,
    scrollVh: 820,
    video: "/experience/v1/drone.mp4",
    poster: "/experience/v1/poster.jpg",
    ctaHref: "/contact?projectType=custom&service=real-estate",
    ctaLabel: "Reserve a private tour →",
    scenes: [
      { at: 0.04, align: "center", eyebrow: "Meridian Residences", title: "Above the skyline.", body: "A penthouse collection in the heart of the city." },
      { at: 0.2, align: "left", eyebrow: "Now releasing", title: "The Penthouse Collection", body: "Full-floor residences with panoramic city and water views." },
      { at: 0.36, align: "left", eyebrow: "The residences", title: "Space, light, and a view that never repeats.", stats: [{ v: "3–5", l: "Beds" }, { v: "4,200+", l: "Sq Ft" }, { v: "360°", l: "Views" }, { v: "24/7", l: "Concierge" }] },
      { at: 0.52, align: "right", eyebrow: "Amenities", title: "A private club, forty floors up.", body: "Sky lounge, spa, pool deck, and residents-only dining." },
      { at: 0.68, align: "left", eyebrow: "The location", title: "The center of everything.", body: "Steps from the waterfront, the best dining, and the business district." },
      { at: 0.82, align: "right", eyebrow: "Represented by", title: "Meridian Residences", body: "Private sales gallery — by appointment only." },
      { at: 0.93, align: "center", eyebrow: "From $3,900,000", title: "Keep scrolling to explore the collection.", cta: false },
    ],
    site: {
      brand: "Meridian Residences",
      tagline: "A landmark penthouse collection — now releasing.",
      listingsEyebrow: "Available residences",
      listingsTitle: "Full-floor homes above the city.",
      listings: [
        { title: "Penthouse 4400", price: "$8,400,000", meta: "5 BD · 6 BA · 6,100 SF", img: "/experience/v1/frames/frame-030.jpg" },
        { title: "Sky Residence 38A", price: "$5,250,000", meta: "4 BD · 4 BA · 4,400 SF", img: "/experience/v1/frames/frame-075.jpg" },
        { title: "Tower Residence 31C", price: "$3,900,000", meta: "3 BD · 3 BA · 3,200 SF", img: "/experience/v1/frames/frame-120.jpg" },
      ],
      aboutEyebrow: "The development",
      aboutTitle: "A new landmark on the skyline.",
      aboutBody: "Meridian Residences is a limited collection of full-floor homes with panoramic views, hotel-grade amenities, and 24/7 concierge — designed for those who want the city at their feet.",
      agentName: "Meridian Sales Gallery",
      agentTitle: "Private appointments · Now releasing",
      agentImg: "/experience/v1/frames/frame-095.jpg",
      neighborhoodTitle: "The center of everything.",
      neighborhoodBody: "Steps from the waterfront, the finest dining, and the business district — with the skyline as your backdrop.",
      neighborhoodImg: "/experience/v1/frames/frame-140.jpg",
      contactTitle: "Reserve a private tour.",
      contactBody: "Register your interest and our sales team will arrange a private viewing of the collection.",
    },
  },
};

export const experienceList = [experiences.estate, experiences.skyline];

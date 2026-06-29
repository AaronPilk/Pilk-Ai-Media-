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
      { at: 0.9, align: "center", eyebrow: "Offered at $24,500,000", title: "Schedule a private showing.", cta: true },
    ],
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
      { at: 0.93, align: "center", eyebrow: "From $3,900,000", title: "Reserve a private tour.", cta: true },
    ],
  },
};

export const experienceList = [experiences.estate, experiences.skyline];

export type AppCapability = { title: string; body: string };
export type AppProcessStep = { step: string; title: string; body: string };

export type AppProject = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  summary: string;
  features: string[];
  logo?: string;
  video?: { src: string; poster?: string };
  shots: { src: string; alt: string }[];
  stores: { appStore?: string; googlePlay?: string };
  cost?: string;
  costLabel?: string;
};

/** Single source of truth for the App Building offer + showcased apps. */
export const appBuilding = {
  eyebrow: "Custom App Building",
  headline: "Custom software, built to run your business.",
  sub: "When a website isn't enough — we design and build the actual product. Mobile apps, internal tools, AI products, dashboards, and automations that do real work.",
  pricingLabel: "Starting at $15,000",
  pricingNote:
    "Final scope depends on complexity, integrations, and timeline. We scope it precisely before anyone commits — no vague estimates.",

  capabilities: [
    { title: "Mobile apps (iOS & Android)", body: "Native-feeling apps your users download, log into, and keep coming back to." },
    { title: "Internal tools & dashboards", body: "Replace the spreadsheets and manual work with a system built around how your team operates." },
    { title: "AI-powered products", body: "Apps with real AI under the hood: assistants, automation, and smart workflows." },
    { title: "Automations & integrations", body: "Wire your tools together — CRM, payments, calendars, APIs — so data moves on its own." },
    { title: "Client portals & booking", body: "Logins, scheduling, payments, and self-serve flows that cut the back-and-forth." },
    { title: "Dashboards & reporting", body: "Live data in one place, built to show the numbers that drive decisions." },
  ] as AppCapability[],

  whatYouGet: [
    "Discovery & precise scoping",
    "Custom UX/UI design",
    "Full-stack build (web & mobile)",
    "Database, auth & user accounts",
    "Integrations (CRM, payments, APIs, AI)",
    "App Store & Google Play submission",
    "Deployment, testing & handoff",
    "Ongoing support options",
  ],

  process: [
    { step: "01", title: "Scope & blueprint", body: "We map the problem, the users, and the exact build — features, data, integrations, and what's in v1. You get a clear plan before development starts." },
    { step: "02", title: "Design & architecture", body: "We design the interface and the system underneath it — flows, screens, database, and how everything connects." },
    { step: "03", title: "Build & iterate", body: "We build in focused cycles with working previews, so you steer it — not a black box for months." },
    { step: "04", title: "Launch & support", body: "We test, ship to the App Store and Google Play, hand off with documentation, and support it as you grow." },
  ] as AppProcessStep[],
};

/**
 * Showcased apps — proof of work. UI demos of apps designed & built by Pilk.ai.
 * AARON: send real store links (replace the "#") and any product details to refine copy.
 */
export const apps: AppProject[] = [
  {
    slug: "watchmen",
    name: "Watchmen",
    tagline: "A custom mobile app, designed and built end to end.",
    category: "Custom mobile app",
    summary:
      "A native mobile experience designed, built, and shipped by Pilk.ai — custom interface, smooth interaction, and a polished feel across iOS and Android.",
    features: ["Custom mobile UI", "Smooth, native-feel interaction", "iOS & Android", "Built for the App Store"],
    cost: "$75,000",
    costLabel: "App build cost",
    logo: "/apps/watchmen/logo.png",
    video: { src: "/apps/watchmen/demo.mp4", poster: "/apps/watchmen/poster.jpg" },
    shots: [
      { src: "/apps/watchmen/shot-1.jpg", alt: "Watchmen app screen 1" },
      { src: "/apps/watchmen/shot-2.jpg", alt: "Watchmen app screen 2" },
      { src: "/apps/watchmen/shot-3.jpg", alt: "Watchmen app screen 3" },
      { src: "/apps/watchmen/shot-4.jpg", alt: "Watchmen app screen 4" },
      { src: "/apps/watchmen/shot-5.jpg", alt: "Watchmen app screen 5" },
    ],
    stores: { appStore: "#", googlePlay: "#" },
  },
  {
    slug: "famlink",
    name: "FamLink",
    tagline: "A custom mobile app, designed and built end to end.",
    category: "Custom mobile app",
    summary:
      "A clean, modern mobile app built by Pilk.ai — designed for an effortless experience with a custom interface and fluid motion throughout.",
    features: ["Custom mobile UI", "Fluid motion & transitions", "iOS & Android", "Built for the App Store"],
    logo: "/apps/famlink/logo.png",
    video: { src: "/apps/famlink/demo.mp4", poster: "/apps/famlink/poster.jpg" },
    shots: [],
    stores: { appStore: "#", googlePlay: "#" },
  },
];

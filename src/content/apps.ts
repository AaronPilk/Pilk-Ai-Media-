export type AppCapability = { title: string; body: string };
export type AppProcessStep = { step: string; title: string; body: string };
export type AppShot = { src?: string; alt: string; device: "desktop" | "mobile" };

export type AppCaseStudy = {
  name: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  features: string[];
  results: string[];
  /**
   * AARON — drop screenshots in /public/apps/proof/ and list them here
   * (e.g. { src: "/apps/proof/dashboard.jpg", alt: "...", device: "desktop" }).
   * Until then, styled device frames render as placeholders.
   */
  shots: AppShot[];
};

/** Single source of truth for the App Building offer. Edit copy/pricing here. */
export const appBuilding = {
  eyebrow: "Custom App Building",
  headline: "Custom software, built to run your business.",
  sub: "When a website isn't enough — we design and build the actual tool. Internal systems, customer apps, AI products, dashboards, and automations that do real work.",
  pricingLabel: "Starting at $15,000",
  pricingNote:
    "Final scope depends on complexity, integrations, and timeline. We scope it precisely before anyone commits — no vague estimates.",

  capabilities: [
    { title: "Internal tools & dashboards", body: "Replace the spreadsheets and manual work with a system built around how your team actually operates." },
    { title: "Customer-facing apps", body: "Web and mobile apps your customers log into, use, and pay for — fast, clean, and reliable." },
    { title: "AI-powered products", body: "Apps with real AI under the hood: assistants, automation, content engines, and smart workflows." },
    { title: "Automations & integrations", body: "Wire your tools together — CRM, payments, calendars, APIs — so data moves without you touching it." },
    { title: "Client portals & booking", body: "Logins, scheduling, payments, and self-serve flows that cut the back-and-forth." },
    { title: "Dashboards & reporting", body: "Live data in one place, built to show the numbers that actually drive decisions." },
  ] as AppCapability[],

  whatYouGet: [
    "Discovery & precise scoping",
    "Custom UX/UI design",
    "Full-stack build (web or mobile)",
    "Database, auth & user accounts",
    "Integrations (CRM, payments, APIs, AI)",
    "Deployment, testing & handoff",
    "Documentation & training",
    "Ongoing support options",
  ],

  process: [
    { step: "01", title: "Scope & blueprint", body: "We map the problem, the users, and the exact build — features, data, integrations, and what's in v1 vs later. You get a clear plan and a fixed direction before development starts." },
    { step: "02", title: "Design & architecture", body: "We design the interface and the system underneath it — flows, screens, database, and how everything connects." },
    { step: "03", title: "Build & iterate", body: "We build in focused cycles with working previews, so you see real progress and steer it, not a black box for three months." },
    { step: "04", title: "Launch & support", body: "We test, deploy, hand it over with documentation, and stay on for support and improvements as you grow." },
  ] as AppProcessStep[],

  // Proof of work — your built app. Send screenshots/video and the specifics
  // and this becomes a full case study.
  caseStudy: {
    name: "Proof of work",
    tagline: "A custom application we designed, built, and shipped end to end.",
    category: "Custom build",
    problem:
      "A real operational problem that off-the-shelf software couldn't solve — manual work, disconnected tools, and no single system to run it.",
    solution:
      "A purpose-built application: custom interface, real database, user accounts, and the integrations needed to make it run on its own.",
    features: [
      "Custom, branded interface",
      "Secure user accounts & data",
      "Connected integrations",
      "Built to scale",
    ],
    results: [
      "Manual work replaced with one system",
      "Faster, cleaner workflows",
      "A real product, not a patchwork",
    ],
    shots: [
      { alt: "App — main screen", device: "desktop" },
      { alt: "App — mobile view", device: "mobile" },
    ],
  } as AppCaseStudy,
};

export type ProcessStep = {
  day: string;
  title: string;
  body: string;
  deliverable: string;
};

export const processTimeline: ProcessStep[] = [
  {
    day: "Day 1",
    title: "Kickoff and direction",
    body: "We discuss the business, audience, offer, pages, visual direction, and example sites you like.",
    deliverable: "Approved project direction",
  },
  {
    day: "Day 2",
    title: "Structure and content",
    body: "We map the site sections, calls to action, page flow, required content, and lead path.",
    deliverable: "Website structure and content plan",
  },
  {
    day: "Day 3",
    title: "Design direction",
    body: "Your selected template is customized or your custom visual direction begins with colors, typography, images, and layout.",
    deliverable: "Homepage design direction",
  },
  {
    day: "Day 4",
    title: "Website build",
    body: "The approved direction becomes a responsive website with navigation, motion, core pages, and lead forms.",
    deliverable: "Working website build",
  },
  {
    day: "Day 5",
    title: "Content and integrations",
    body: "We load your content, connect forms, analytics, tracking, CRM tools, domains, and available integrations.",
    deliverable: "Complete working website",
  },
  {
    day: "Day 6",
    title: "Review and revisions",
    body: "You review the site while we test mobile, desktop, forms, links, speed, accessibility, and tracking.",
    deliverable: "Final approved revision",
  },
  {
    day: "Day 7",
    title: "Launch",
    body: "The website connects to the production domain, final analytics are verified, and the new site goes live.",
    deliverable: "Live website",
  },
];

export const processDisclaimer =
  "The seven-day build applies to qualified projects on a standard template (Complete Website package) and starts once we have your content, account access and approvals. Other templates take 5–14 days, mortgage websites about 14, and custom builds get a schedule based on scope. Late content or approvals move the launch date.";

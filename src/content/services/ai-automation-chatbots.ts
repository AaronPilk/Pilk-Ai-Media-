import type { Service } from "./types";
import { packageName, packagePrice } from "./pricing";

export const aiAutomationChatbots: Service = {
  slug: "ai-automation-chatbots",
  href: "/services/ai-automation-chatbots/",
  name: "AI Automation & Chatbots",
  serviceType: "AI automation and chatbot development",
  summary:
    "Instant replies to new leads, chatbots that answer real questions, and less copying between apps.",
  title: "AI Automation & Chatbots for Small Businesses",
  description:
    "Pilk.ai builds AI chatbots and automations that reply to leads in seconds, answer common questions and keep your CRM up to date. Based in St. Petersburg, FL.",
  image: "/brand/brand-automation.jpg",
  eyebrow: "AI automation & chatbots",
  headline: "AI automation and chatbots that do real work.",
  intro:
    "Reply to every lead the minute it comes in. Stop copying the same details between forms, spreadsheets and your CRM. Let routine questions get answered without someone picking up the phone. We build automations and chatbots around the tools you already use.",
  whatItIs: [
    "An automation is a set of steps that runs on its own when something happens: a form is submitted, a call is missed, a deal moves to a new stage. A chatbot is a conversation on your website, in Instagram or Facebook messages, or by text, that answers questions and collects details. AI makes both of them better at handling messy, real-world input, like a lead who types a paragraph instead of filling in the fields.",
    "We map the process, build it inside your own accounts, test it against realistic conversations, and connect it to your CRM so nothing sits in a separate inbox no one checks.",
  ],
  whoFor: [
    "Businesses that lose leads because nobody replies fast enough",
    "Teams that copy the same information between forms, email, spreadsheets and a CRM",
    "Offices that answer the same handful of questions every day",
    "GoHighLevel users who pay for the software but never finished setting it up",
  ],
  steps: [
    {
      title: "Pick one workflow",
      body: "Start with the process that costs you the most time or the most leads. One that works beats five half-built.",
    },
    {
      title: "Map it",
      body: "Every step, every tool, every exception, including what should happen when the bot doesn't know the answer and when a person needs to take over.",
    },
    {
      title: "Build and test",
      body: "Built in your accounts and tested with realistic examples, including the awkward ones: wrong details, angry customers, off-topic questions.",
    },
    {
      title: "Launch and tune",
      body: "It goes live, we watch real conversations, and we adjust the prompts and rules over the first weeks.",
    },
  ],
  includedHeading: "What we build",
  included: [
    "Website chat that answers questions and books appointments",
    "Instant text and email replies to new leads",
    "Missed-call text-back",
    "Lead qualification that asks the right questions and routes the lead",
    "Call and meeting summaries sent to your CRM",
    "Clear rules for handing a conversation to a person",
    "Testing before launch and adjustments after it",
    "A walkthrough of how everything works, so you're never locked out",
  ],
  pricing: `Automated text and email follow-up is part of our ${packageName("crm")} package (${packagePrice("crm")}). Standalone automations and chatbots are quoted per project after we map the workflow.`,
  relatedWork: [
    {
      label: "This site's own lead flow",
      href: "/contact/",
      note: "Every project brief sent here lands in email and in GoHighLevel automatically, the moment it's submitted.",
    },
    {
      label: "Rolodex AI",
      href: "/work/rolodex-ai/",
      note: "An AI-driven contact and relationship tool we designed and built.",
    },
    {
      label: "GoHighLevel build-outs for lenders",
      href: "/mortgage/",
      note: "Pipelines, automated follow-up and booking calendars behind a mortgage website.",
    },
  ],
  faqs: [
    {
      q: "Will a chatbot make things up?",
      a: "It can if it's set up badly. We limit it to your own information, tell it exactly what to do when it doesn't know an answer, and have it hand the conversation to a person when it should. We test for this before launch.",
    },
    {
      q: "Which tools can you connect?",
      a: "GoHighLevel, most popular CRMs, Google and Microsoft email and calendars, Stripe, Facebook and Instagram messaging, SMS, and most software that has an API. If something can't be connected, we tell you before we start.",
    },
    {
      q: "Who owns the automations?",
      a: "You do. We build in your accounts wherever possible, so if we ever stop working together, everything keeps running.",
    },
    {
      q: "What does it cost to run each month?",
      a: "Usually the software subscriptions involved plus AI usage fees, which depend on volume. We estimate those before building so the monthly cost isn't a surprise.",
    },
    {
      q: "Can you add a chatbot to my existing website?",
      a: "Yes. A chat widget or form automation can be added to most websites. If the site itself needs work, we build websites too.",
    },
  ],
  related: ["ai-consulting", "lead-funnels", "social-media-automation"],
};

import type { Service } from "./types";
import { packageName, packagePrice } from "./pricing";

export const leadFunnels: Service = {
  slug: "lead-funnels",
  href: "/services/lead-funnels/",
  name: "Lead Funnels",
  serviceType: "Lead funnel and CRM automation setup",
  summary:
    "Landing pages, forms and booking calendars with automatic follow-up, usually built in GoHighLevel.",
  title: "Lead Funnels & CRM Follow-Up Systems",
  description:
    "Pilk.ai builds lead funnels with landing pages, forms, booking calendars and automatic text and email follow-up, usually in GoHighLevel. St. Petersburg, FL.",
  eyebrow: "Lead funnels",
  headline: "Lead funnels that capture the lead and follow up for you.",
  intro:
    'A lead funnel is the path from "saw your ad or post" to "booked a call." We build the landing page, the form and the follow-up behind it, so every lead gets a fast reply and a clear next step.',
  whatItIs: [
    "A funnel has three parts. The page: one offer and one clear action. The capture: a form, quiz, booking calendar or chat that collects the right details. The follow-up: texts, emails, reminders and tasks that keep the lead moving until they book or say no.",
    "Most businesses have the first part and skip the rest, which is where leads go cold. We usually build funnels in GoHighLevel because pages, forms, calendars, texting and email all live in one place, but we can work with the CRM you already have.",
  ],
  whoFor: [
    "Businesses sending ad or social traffic to a general homepage",
    "Teams paying for GoHighLevel or another CRM that was never fully set up",
    "Real estate agents and lenders who need follow-up that runs every day",
    "Coaches, consultants and communities that sell through calls or applications",
  ],
  steps: [
    {
      title: "Offer and path",
      body: "What you're offering, who it's for, and the one next step you want people to take.",
    },
    {
      title: "Build the funnel",
      body: "Landing page, form or calendar, thank-you page and tracking, written and designed to match your brand.",
    },
    {
      title: "Build the follow-up",
      body: "Pipeline stages, text and email sequences, appointment reminders and tasks for your team.",
    },
    {
      title: "Launch and tune",
      body: "We test every path before launch, then adjust based on how people actually move through it.",
    },
  ],
  included: [
    "Landing page and thank-you page",
    "Forms, quizzes or booking calendars",
    "Pipeline and stages in your CRM",
    "Automated text and email follow-up",
    "Appointment reminders",
    "Google tag and Meta Pixel tracking, so you know which source converts",
    "Handoff training for your team",
  ],
  pricing: `Full GoHighLevel build-outs with forms, funnels and nurture sequences are part of our ${packageName("crm")} package (${packagePrice("crm")}). Standalone funnels are quoted per project.`,
  relatedWork: [
    {
      label: "GoHighLevel build-outs for lenders",
      href: "/mortgage/",
      note: "The CRM pipeline, automated follow-up and booking calendars we build behind mortgage websites.",
    },
    {
      label: "Single listing pages",
      href: "/templates/listing-page/",
      note: "A one-property page with lead capture, built for each new listing.",
    },
  ],
  faqs: [
    {
      q: "Do I need GoHighLevel?",
      a: "No. It's our usual choice for funnels because pages, forms, calendars, texting and email live in one place, but we can route leads into most CRMs.",
    },
    {
      q: "What's the difference between a website and a funnel?",
      a: "A website explains your whole business. A funnel is one focused path for one offer. Many businesses use both, with ads and social posts pointing at the funnel.",
    },
    {
      q: "How quickly does follow-up go out?",
      a: "Automated replies go out the moment someone submits the form, and you get notified at the same time.",
    },
    {
      q: "Can you connect my existing CRM?",
      a: "Usually. If your CRM has no way to receive leads automatically, we tell you before we start.",
    },
    {
      q: "Who writes the pages and messages?",
      a: "We can write the landing page and every follow-up message, or work from copy you already have.",
    },
  ],
  related: ["meta-ads", "ai-automation-chatbots", "websites"],
};

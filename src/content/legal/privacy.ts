import { site } from "@/content/site";
import type { LegalDocument } from "./types";

// Written to match docs/legal/data-flow-20261113.md. If a form, provider,
// cookie or storage key changes, update that audit and this policy together.

const email = site.contact.email;
const phone = site.contact.phone;
const mail = `[${email}](mailto:${email})`;
const tel = `[${phone}](${site.contact.phoneHref})`;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  effective: "November 13, 2026",
  updated: "November 13, 2026",
  intro: [
    "This Privacy Policy explains what personal information Pilk.ai collects, how we use it, who we share it with and the choices you have. It covers the pilk.ai website and the services we sell. Pilk.ai is a brand of Pilk Consulting LLC.",
    "The short version: we collect what you type into our forms, what you send us and the technical data needed to run the site. We use it to answer you, do the work and get paid. We don't sell it, we don't run advertising pixels on pilk.ai, our only analytics is a cookie-free visit counter from Cloudflare, and you can ask us to see, fix or delete what we hold. The full policy below is what governs.",
  ],
  sections: [
    {
      id: "who",
      title: "Who we are",
      blocks: [
        "Pilk.ai is a brand of Pilk Consulting LLC, a Florida limited liability company based in St. Petersburg, Florida (\"Pilk.ai\", \"we\", \"us\"). We decide how and why the personal information in this policy is used, except for information we handle for clients, which {{s:clients}} covers.",
        `Questions or requests: ${mail} or ${tel}.`,
      ],
    },
    {
      id: "scope",
      title: "What this policy covers",
      blocks: [
        "This policy covers:",
        {
          list: [
            "visits to pilk.ai, including the demo template sites under pilk.ai/template-previews/",
            "forms, orders and payments made through the site",
            "emails, calls and text messages between you and us",
            "information we collect while providing services to clients",
          ],
        },
        "It does not cover:",
        {
          list: [
            "websites, apps, chatbots, funnels, communities or ad campaigns we build or run for clients. The client's own privacy policy covers its customers and visitors ({{s:clients}})",
            "Stripe's checkout page, where Stripe collects payment details under its own privacy policy ({{s:collect.4}})",
            "other websites we link to ({{s:links}})",
          ],
        },
      ],
    },
    {
      id: "collect",
      title: "Information we collect",
      subsections: [
        {
          title: "Information you give us",
          blocks: [
            "We collect what you enter in our forms and send us. Most fields are optional; each form marks what it needs.",
            {
              table: {
                head: ["Where", "What we ask for"],
                rows: [
                  [
                    "Project brief ([/contact/](/contact/))",
                    "Name, email, phone, company, industry, current website, a description of your business and audience, project details (type, template, goals, pages, integrations), design preferences, links to sites you like, budget range, desired launch, preferred contact method (email, phone or text), notes, and any images or PDFs you upload.",
                  ],
                  [
                    "Contact form (real estate and mortgage pages)",
                    "Name, email, phone, company or brokerage, industry, project type, budget, desired launch, preferred contact method, current website, whether you need IDX/MLS, and project details.",
                  ],
                  [
                    "Quick inquiry and the demo listing forms",
                    "Name, email, phone and a message. For a showing request on the demo listing, a preferred date and time.",
                  ],
                  [
                    "Template order ([/templates/](/templates/), then the order form)",
                    "Name, email, business name, mobile phone, what your business does, NMLS number (mortgage professionals), service area, a short description, services, job title, the phone and email to show on your site, links to your website or social pages, notes, and your logo, photos and other files.",
                  ],
                  [
                    "Checkout",
                    "The add-ons and template you chose. Your card, name, email and billing address go into Stripe's checkout page, not ours ({{s:collect.4}}).",
                  ],
                  [
                    "Email, phone and text",
                    "Whatever you choose to tell us.",
                  ],
                  [
                    "Client projects",
                    "Account access, content, files and data you give us to do the work. Data about your own customers is covered in {{s:clients}}.",
                  ],
                ],
              },
            },
            "**Please don't send us sensitive information** such as Social Security numbers, bank or card numbers, loan application details, health information or passwords through our forms or uploads. We don't ask for it and don't need it. If a project needs that kind of data, we'll agree in writing how it will be handled first.",
          ],
        },
        {
          title: "Information collected automatically",
          blocks: [
            "**Server and security data.** Cloudflare hosts pilk.ai. When you visit, Cloudflare processes your IP address, browser and device type, the pages you request, the referring page, the time of each request and similar technical data so it can deliver pages, keep the site secure and block abuse. Your browser may also report failed page loads to Cloudflare. Our form-handling functions run on Cloudflare too, and when they log an event (a submission or an error), the log can include your name, email and the type of project.",
            "**Campaign details.** If you arrive through a link with tracking tags, the site reads the UTM tags, ad click IDs (such as gclid or fbclid), the page you landed on and the page that referred you. It keeps them in your browser for the session and sends them with any form you submit. We use them only to see which marketing brought you to us. We don't send them back to Google, Meta or anyone else.",
            "**Analytics.** We use Cloudflare Web Analytics to count visits and measure how fast pages load. It doesn't use cookies or local storage and doesn't fingerprint you. Cloudflare processes the page address, the referring page, your browser and device type, and your IP address, which it uses to work out your country. We see only totals, such as visits per page.",
            "**No advertising tracking.** We don't use advertising pixels, session recording or any other analytics on pilk.ai. {{s:cookies}} lists the small amount of browser storage the site uses.",
          ],
        },
        {
          title: "Information from other sources",
          blocks: [
            {
              list: [
                "**Public pages you point us to.** If you send us links to your website or social profiles, we look at them for photos and details to use in your project.",
                "**Platforms you connect us to.** During a project you may give us access to accounts such as Meta, Google, GoHighLevel, Skool, your domain registrar or hosting. We see the account and performance data those platforms show.",
                "**People who refer you** or bring us into a project.",
                "**Stripe**, which tells us when a payment succeeds ({{s:collect.4}}).",
              ],
            },
          ],
        },
        {
          title: "Payment information",
          blocks: [
            "Payments on pilk.ai are processed by Stripe. You enter card details on Stripe's checkout page; they never pass through or get stored on our systems. Stripe tells us the payment status, the amount, your email and what you ordered, and gives us reference IDs for your Stripe customer record and saved payment method.",
            "When you buy a mortgage website, Stripe saves your card so the monthly hosting plan can be charged as our [Terms of Service](/terms/) describe. Stripe handles payment information under its own privacy policy at [stripe.com/privacy](https://stripe.com/privacy).",
          ],
        },
      ],
    },
    {
      id: "use",
      title: "How we use information",
      blocks: [
        "We use personal information to:",
        {
          list: [
            "answer inquiries and prepare quotes",
            "build, deliver, host and support what you buy, including sending previews and launching your site",
            "take payments, run monthly plans, and keep accounting and tax records",
            "send service messages such as confirmations, previews, receipts, billing notices and changes to our terms",
            "keep track of leads and clients in our CRM, including following up on your inquiry",
            "send marketing emails or texts, only as {{s:messages}} allows",
            "see which marketing brought you to us",
            "keep the site and our accounts secure and stop spam, fraud and abuse",
            "comply with the law, enforce our terms and defend legal claims",
            "show finished client work in our portfolio, as our Terms allow",
          ],
        },
        "**Template orders.** What you send with a template order is used to build your site, to contact you about that order and your site, and to bill you. We don't use it for unrelated marketing unless you separately agree.",
        "We don't make decisions about you based only on automated processing that have legal or similarly significant effects on you.",
      ],
    },
    {
      id: "share",
      title: "How we share information",
      blocks: [
        "**We don't sell personal information. We don't share it for cross-context behavioral advertising** (ads targeted at you based on your activity across other sites and apps), and we don't let third parties collect personal information on pilk.ai for their own advertising.",
        "We share personal information only as follows.",
        "**Service providers.** These companies process information for us, under their terms with us, to run our business:",
        {
          table: {
            head: ["What they do", "Provider", "What they handle"],
            rows: [
              [
                "Hosting, content delivery, security, form processing and cookie-free web analytics",
                "Cloudflare",
                "All site traffic, server logs and visit statistics, and form submissions while they are processed",
              ],
              [
                "Transactional email",
                "Resend",
                "The contents of your form and any files you upload, sent to our inbox; the confirmation email we send you; order notices",
              ],
              [
                "Business email",
                "Our email provider",
                "Our inbox, where form notifications, files and your emails arrive",
              ],
              [
                "CRM",
                "GoHighLevel (LeadConnector)",
                "Your name, email, phone, company, how you reached us and which project or template you chose; after an order, what you bought and the amount",
              ],
              [
                "Payments",
                "Stripe",
                "Checkout, saved cards for monthly plans, receipts and fraud screening",
              ],
              [
                "File and database storage",
                "Storage providers we may use to keep copies of submissions and files (for example Cloudflare R2)",
                "Form contents and uploaded files",
              ],
              [
                "Fonts on demo templates",
                "Google Fonts",
                "Your IP address and browser details when a demo template, or a page showing a live preview of one, loads its fonts ({{s:demos}})",
              ],
              [
                "AI tools",
                "The AI providers we use to deliver services",
                "As described in {{s:ai}}",
              ],
              [
                "Professional advisers",
                "Lawyers, accountants and insurers",
                "What they need to advise us",
              ],
            ],
          },
        },
        "**Platforms you ask us to work in.** When we work inside your Meta, Google, GoHighLevel, Skool, app store, hosting or other accounts, information moves under that platform's terms and your account settings.",
        "**Legal and safety reasons.** We may disclose information to comply with law, a subpoena or court order, to protect the rights, safety or property of you, us or others, or to investigate fraud or security problems.",
        "**Business transfers.** If Pilk Consulting LLC is involved in a merger, acquisition, financing or sale of assets, information may transfer to the new owner, who must handle it consistently with this policy.",
        "**With your consent** or at your direction.",
        "We may share aggregated or de-identified information that can't reasonably be linked to you. We won't try to re-identify it.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and browser storage",
      blocks: [
        "**pilk.ai does not set its own cookies,** and Cloudflare Web Analytics doesn't use any. The site saves a few items in your browser's local or session storage. They stay on your device and are sent to us only when you submit a form.",
        {
          table: {
            head: ["Name", "Type", "Purpose", "How long"],
            rows: [
              ["pilk-theme", "Local storage", "Remembers whether you chose light or dark mode", "Until you clear it"],
              ["pilk-intro-seen", "Session storage", "Shows the intro animation only once per visit", "Until you close the tab"],
              ["pilk-attribution", "Session storage", "Holds the campaign details described in {{s:collect.2}}", "Until you close the tab"],
              ["pilk-project-brief-draft", "Local storage", "Saves your project brief as you type so you don't lose it (files are not saved)", "Until you submit the brief or clear it"],
              ["pilk_intake_v2", "Local storage", "Saves your template order form as you type", "Until you submit, choose \"Start over\" or clear it"],
              ["__cf_bm, cf_clearance", "Cookies set by Cloudflare", "Strictly necessary security cookies Cloudflare may set to tell people from bots or after a security check", "Usually 30 minutes"],
            ],
          },
        },
        "You can clear these items or block storage in your browser settings. If you do, form drafts won't be saved and the site won't remember your theme.",
        "How we handle Do Not Track and Global Privacy Control signals is in {{s:california}}.",
      ],
    },
    {
      id: "demos",
      title: "Demo template sites",
      blocks: [
        "The demo sites under pilk.ai/template-previews/ show designs we build for clients. Live previews of them also appear in frames on pages such as the home page, the template pages and the mortgage page. Their businesses, people, reviews, rates and licence numbers are fictional, and their forms don't send anything.",
        "Each demo loads its fonts from Google Fonts. So when you open a demo, or a page that shows a live preview of one, Google receives your IP address, browser details and the address of the demo page as the fonts load. Google's privacy policy applies to that: [policies.google.com/privacy](https://policies.google.com/privacy).",
        "The demo files also contain placeholder Google Analytics and Meta Pixel tags, so a client's own IDs can be added when we build their site. On pilk.ai our security settings block those tags, and our own analytics, from loading on demo pages, so they send nothing to Google Analytics, Meta or Cloudflare Web Analytics and set no cookies.",
      ],
    },
    {
      id: "messages",
      title: "Email, calls and text messages",
      subsections: [
        {
          title: "Email",
          blocks: [
            "**Service emails** (confirmations, previews, invoices, billing and legal notices) are part of the service. You'll receive them while you have an active project, order or plan.",
            "**Marketing emails.** We may email clients and people who asked us about a project about our services. Every marketing email has an unsubscribe link. We honor opt-outs within 10 business days, as the CAN-SPAM Act requires, and you can also opt out by emailing us.",
          ],
        },
        {
          title: "Calls",
          blocks: [
            "We may call the number you gave us about your inquiry, project or account. We don't make autodialed or prerecorded marketing calls without your prior express written consent.",
          ],
        },
        {
          title: "Text messages",
          blocks: [
            "We text you only if you gave us your mobile number and agreed to be contacted by text, for example by choosing text as your preferred contact method or by checking a box that says we may text you.",
            {
              list: [
                "**What we send:** messages about your inquiry, project, order, appointments and account. Marketing texts only if you separately agreed to receive them.",
                "**Consent is not a condition of purchase.** You can buy from us without agreeing to texts.",
                "**Message frequency varies.** Message and data rates may apply.",
                "**Reply STOP** to any text to opt out. We'll send one message confirming you're unsubscribed and no more texts unless you opt back in. **Reply HELP** for help, or contact us at " + mail + " or " + tel + ".",
                "Carriers are not liable for delayed or undelivered messages.",
              ],
            },
            "**We do not sell, rent or share mobile phone numbers, text message opt-in data or consent with third parties or affiliates for their marketing or promotional purposes.** The sharing described in {{s:share}} excludes text messaging opt-in data and consent, except that the provider that sends our texts processes them to deliver the messages.",
          ],
        },
      ],
    },
    {
      id: "ai",
      title: "AI tools",
      blocks: [
        "We use AI tools, including third-party AI models and services, to deliver some services: drafting copy, writing and reviewing code, summarizing documents and calls, and running the chatbots, voice agents and automations we build for clients.",
        {
          list: [
            "When we do, information you give us may be sent to an AI provider to produce the result. The provider processes it under its own terms.",
            "For client work we use AI providers' business or API services whose terms say the data we send is not used to train their models.",
            "We don't train our own AI models on client confidential information.",
            "AI output can be wrong. We review it before we rely on it in client deliverables, and our [Terms of Service](/terms/) explain your part in reviewing it.",
            "Please don't give us sensitive personal information for use with AI tools unless we've agreed in writing how it will be handled.",
          ],
        },
        "Chatbots and voice agents we build for clients are covered by the client's privacy policy ({{s:clients}}).",
      ],
    },
    {
      id: "clients",
      title: "Information we handle for clients",
      blocks: [
        "When we build or run websites, CRMs, funnels, chatbots, voice agents, automations, ad campaigns or communities for a client, we may handle personal information about the client's own customers, leads, members or website visitors (\"client data\").",
        {
          list: [
            "For client data we act as the client's **service provider** (or processor). We use it only to provide the services the client asked for, under the client's instructions and our agreement, and never for our own marketing.",
            "**The client is responsible** for its own privacy policy, notices and consents, including consent for texts, calls, call recording, cookies, tracking pixels and AI chat or voice interactions, and for having the right to give us the data.",
            "If you are a client's customer and want to exercise privacy rights over client data, please contact that client. If you contact us instead, we'll pass your request to the client and help it respond.",
            "When our work for a client ends, we return or delete client data as our agreement with the client says, unless the law requires us to keep it.",
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      blocks: [
        "We keep personal information only as long as we need it for the purposes in this policy:",
        {
          table: {
            head: ["Information", "How long"],
            rows: [
              ["Inquiries that don't become projects, and CRM records of leads", "Up to 3 years after our last contact with you"],
              ["Client project records, contracts and invoices", "For the relationship and 7 years after it ends, for tax, accounting and legal claims"],
              ["Files and content you send for a project", "While we build, host or maintain the work, then up to 1 year after it ends, unless you ask us to delete them sooner"],
              ["Marketing opt-outs", "As long as needed to keep honoring them"],
              ["Server and security logs", "As set by Cloudflare's retention practices, usually a short period"],
              ["Payment records held by Stripe", "As Stripe's policies and the law require"],
              ["Browser storage", "As listed in {{s:cookies}}"],
            ],
          },
        },
        "We may keep information longer when the law requires it or to resolve a dispute, and then only for that purpose.",
      ],
    },
    {
      id: "security",
      title: "How we protect information",
      blocks: [
        "We use reasonable administrative, technical and physical safeguards for the information we hold. The site and our forms use encrypted connections (HTTPS), payments are handled by Stripe, keys and passwords are kept out of the site's code, and access to our accounts is limited to the people who need it.",
        "No system is perfectly secure, and we can't guarantee the security of information sent over the internet or stored by any provider.",
        "If a security breach affects your personal information, we will notify you and any regulators as the law requires, including Florida's Information Protection Act.",
      ],
    },
    {
      id: "rights",
      title: "Your privacy rights",
      blocks: [
        "Several US states give residents rights over their personal information. **We honor the following requests from any US resident, whether or not your state's law requires it:**",
        {
          list: [
            "**Know and access:** what personal information we hold about you, where it came from, why we use it and who we share it with, and a copy of it",
            "**Correct** information that is inaccurate",
            "**Delete** information we hold about you",
            "**Portability:** a copy in a commonly used electronic format",
            "**Opt out** of the sale of personal information, targeted advertising and profiling. We don't do any of these, but you can still record your choice",
            "**Opt out of marketing** emails and texts at any time ({{s:messages}})",
          ],
        },
        `**How to ask.** Email ${mail} with the subject "Privacy request", or call ${tel}. Tell us which right you want to use and how to reach you.`,
        "**Verification.** To protect you, we'll confirm your request by matching details you give us against what we hold, for example by replying to the email address we have on file. We'll only ask for what we need to verify you, and we'll use it only for that.",
        "**Authorized agents.** Someone you authorize can make a request for you with your signed permission. We may still confirm the request directly with you.",
        "**Timing and cost.** We respond within 45 days. If we need more time, up to 45 more days, we'll tell you why. Requests are free unless they are clearly unfounded or excessive.",
        "**Exceptions.** We may keep some information when the law requires it, to complete a transaction you asked for, for security and fraud prevention, or to establish or defend legal claims. If we can't fully meet a request, we'll explain why.",
        "**Appeals.** If we decline your request, you can appeal by replying with \"Appeal\" in the subject. We'll respond in writing within 60 days. If you're not satisfied, you can contact your state attorney general.",
        "**No discrimination.** We won't deny you service, charge you a different price or give you a different quality of service because you used your privacy rights.",
      ],
    },
    {
      id: "california",
      title: "California disclosures",
      blocks: [
        "This section adds to the rest of the policy for California residents and covers the 12 months before the date at the top.",
        {
          table: {
            head: ["Category (California law)", "What it means here", "Disclosed for a business purpose to"],
            rows: [
              ["Identifiers", "Name, email, phone, IP address, Stripe customer ID", "Cloudflare, Resend, our email provider, GoHighLevel, Stripe; IP address only to Google Fonts when demo templates load"],
              ["Customer records", "Name, phone, business details; card details are held by Stripe, not us", "Same as identifiers"],
              ["Commercial information", "What you ordered, amounts paid, plan status", "Stripe, GoHighLevel, Resend, our email provider"],
              ["Professional information", "Company, job title, industry, NMLS number", "Resend, our email provider; company name to GoHighLevel"],
              ["Internet activity", "Pages requested, referring page, campaign tags, browser and device data, visit statistics", "Cloudflare (hosting and web analytics)"],
              ["Approximate location", "General area inferred from your IP address. We don't collect precise location", "Cloudflare"],
              ["Audio, electronic or visual information", "Photos and other files you upload", "Resend, our email provider"],
            ],
          },
        },
        "We don't collect biometric information, education records, or information about protected characteristics, and we don't create inferences or profiles about you. We don't ask for sensitive personal information and don't use any for purposes that would give you a right to limit its use.",
        "**Sources** are listed in {{s:collect}}. **Purposes** are listed in {{s:use}}. **Retention** is described in {{s:retention}}.",
        "**Sale and sharing.** In the past 12 months we have not sold personal information or shared it for cross-context behavioral advertising, including that of consumers under 16.",
        "**Shine the Light.** We don't disclose personal information to third parties for their own direct marketing purposes.",
        "**Do Not Track.** Browsers' Do Not Track signals have no common standard. We don't track you across other sites, so there is nothing for the signal to switch off.",
        "**Global Privacy Control.** We treat a Global Privacy Control signal as a request to opt out of sale and sharing for that browser. Because we don't sell or share personal information, honoring it changes nothing about how the site works.",
        "**Financial incentives.** We don't offer any.",
        "This policy is our notice at collection. Each form on pilk.ai links to it.",
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        "pilk.ai and our services are for businesses and adults. They are not directed to children under 13, or to anyone under 16, and we don't knowingly collect personal information from them. If you believe a child has sent us personal information, contact us and we'll delete it.",
      ],
    },
    {
      id: "international",
      title: "Where information is processed and visitors outside the US",
      blocks: [
        "We are based in the United States, and we and our service providers store information mainly in the United States. Cloudflare serves the site from data centers around the world, so a visit from outside the US may first be handled in a data center near you. If you contact us from outside the US, your information will be transferred to and processed in the US, where privacy laws may differ from those where you live.",
        "If the data protection laws of the EU, UK or Switzerland apply to you, we rely on these legal bases: performing a contract with you or taking steps at your request before one (answering inquiries, delivering services, taking payment); our legitimate interests (running and securing the site, following up with business contacts, improving our services), balanced against your rights; your consent (marketing texts, where consent is required); and legal obligations (tax and accounting records). You may also ask us to restrict or object to our use of your information, withdraw consent at any time, and complain to your local data protection authority.",
      ],
    },
    {
      id: "links",
      title: "Links to other sites",
      blocks: [
        "pilk.ai links to sites we don't control, such as client websites, profile sites and Stripe. Their own privacy policies apply when you visit them.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        "We'll post any changes on this page and update the \"Last updated\" date. If a change materially affects how we use information we already hold, we'll tell clients and plan subscribers by email before it takes effect, and ask for consent where the law requires it.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [
        "Pilk Consulting LLC (Pilk.ai), St. Petersburg, Florida",
        `Email: ${mail}`,
        `Phone: ${tel}`,
      ],
    },
  ],
};

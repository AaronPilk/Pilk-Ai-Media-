import { site } from "@/content/site";
import { buildTimes, hostingPlan, mortgagePackage, packages } from "@/content/packages";
import { CHECKOUT, RENEWAL_CONSENT_TEXT } from "@/lib/checkout-pricing";
import { startingAtLower } from "@/lib/pricing";
import type { LegalDocument } from "./types";

// Every commitment here must match the marketing copy (ownership, timelines,
// revisions, hosting, no guarantees). docs/legal/data-flow-20261113.md lists
// the site's promises that these Terms were written against. Starting prices
// and build times are read from the same files the pages use, so they can't
// drift. Nothing is sold online: work starts after a written proposal or quote
// and an invoice.

const email = site.contact.email;
const phone = site.contact.phone;
const mail = `[${email}](mailto:${email})`;
const tel = `[${phone}](${site.contact.phoneHref})`;

const price = (id: (typeof packages)[number]["id"]) => {
  const p = packages.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown package ${id}`);
  return startingAtLower(p.price, p.priceUnit);
};
const name = (id: (typeof packages)[number]["id"]) => packages.find((x) => x.id === id)?.name ?? id;

const mortgageFrom = startingAtLower(mortgagePackage.price);
const hostingFrom = `${startingAtLower(hostingPlan.priceFrom)} a month`;
// Plans started through the former online order form keep the terms agreed then.
const legacyMonthly = `$${CHECKOUT.monthly}`;

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  effective: "November 13, 2026",
  updated: "November 13, 2026",
  intro: [
    "These Terms of Service (\"Terms\") are the agreement between you and Pilk Consulting LLC for using pilk.ai and for the services we provide. Pilk.ai is a brand of Pilk Consulting LLC.",
    {
      callout:
        "**Please read {{s:disputes}} carefully.** It requires most disputes to be resolved by binding individual arbitration instead of in court, and it waives class actions and jury trials. You can opt out of arbitration within 30 days, as {{s:disputes.7}} explains.",
    },
  ],
  sections: [
    {
      id: "about",
      title: "Who we are and what these Terms cover",
      blocks: [
        "Pilk Consulting LLC is a Florida limited liability company based in St. Petersburg, Florida (\"Pilk.ai\", \"we\", \"us\"). \"You\" means the person using the site or buying from us and, if you act for a business, that business.",
        "These Terms cover your use of pilk.ai, quote requests made through the site, payments for our services, and every service we provide, including websites and website templates, custom apps, AI consulting, AI automation, chatbots and voice agents, Meta ads management, social media automation, lead funnels and CRM setup, Skool community growth, and hosting and support.",
        "Our [Privacy Policy](/privacy/) explains how we handle personal information and is part of these Terms.",
      ],
    },
    {
      id: "acceptance",
      title: "Accepting these Terms and who can use our services",
      blocks: [
        "You accept these Terms when you use pilk.ai, submit a form, sign or approve a proposal or quote, pay us, or use our services. If you don't agree, don't use the site or our services.",
        "You must be at least 18 and able to enter a binding contract. If you use our services for a business, you confirm that you have authority to bind that business to these Terms.",
        "Our services are sold mainly to businesses. If you buy as an individual for personal, family or household use, any consumer protection rights that the law doesn't allow us to limit still apply to you.",
      ],
    },
    {
      id: "sow",
      title: "Proposals, statements of work and which document controls",
      blocks: [
        "**We don't sell through the site.** pilk.ai has no online checkout. Every project, including template, mortgage website and single listing page projects, starts with a written proposal or quote. Before work starts, we agree in writing what we'll build, what it costs and what you need to provide. That can be a proposal, quote, statement of work or invoice (each a \"SOW\"). Work starts once you've approved it and paid the invoice or deposit it calls for.",
        "**If a SOW conflicts with these Terms, the SOW controls for that project.** {{s:liability}} and {{s:disputes}} still apply unless the SOW expressly says it replaces them.",
        "Prices shown on the site are starting prices, and the features and timelines shown there are a general guide. A form you send us, including a template request, asks for a quote; it isn't an order and doesn't commit either of us. Your SOW sets what you actually pay and receive.",
      ],
    },
    {
      id: "services",
      title: "Our services",
      blocks: [
        "We provide the services described in your SOW. We choose the tools, platforms and methods we use unless the SOW says otherwise. We may use trusted subcontractors, and we remain responsible for their work.",
        "We may decline any project. We don't provide legal, tax, accounting, lending, insurance or regulatory compliance advice, even when our work touches those subjects ({{s:regulated}}).",
      ],
    },
    {
      id: "payment",
      title: "Quotes, prices, payment and taxes",
      subsections: [
        {
          title: "Quotes, deposits and invoices",
          blocks: [
            "A written quote is valid for 30 days unless it says otherwise. Fixed-price packages, such as template websites, mortgage websites and single listing pages, are usually invoiced in full before work starts. Custom projects usually require a deposit, set in the SOW. We schedule and start the work once the invoice or deposit has been paid and the payment has cleared. Add-ons, such as rush delivery or analytics setup, are quoted with the project.",
          ],
        },
        {
          title: "Paying invoices",
          blocks: [
            "Invoices are due on the date shown on the invoice, or within 7 days of the invoice date if none is shown, using the payment methods we accept. We may send invoices and payment links through Stripe or another payment processor; you pay on the processor's own page, and your card details never pass through pilk.ai. The invoice shows the full amount before you pay.",
          ],
        },
        {
          title: "Late payment and suspension",
          blocks: [
            "Overdue amounts accrue a late charge of 1.5% per month (18% a year, simple interest) or the highest rate the law allows, whichever is lower, from the due date until paid. If we have to take action to collect overdue amounts, you'll also pay our reasonable costs of collection, including attorneys' fees, to the extent the law allows.",
            "If any amount is more than 10 days overdue, we may pause work and suspend services, including hosting, ad management and automations, after giving you at least 10 days' written notice. {{s:hosting}} adds protections for hosted websites.",
          ],
        },
        {
          title: "Taxes",
          blocks: [
            "Prices don't include taxes. If a sales, use or similar tax applies to what you buy, we'll add it to the invoice and you'll pay it. We pay taxes on our own income.",
          ],
        },
        {
          title: "Promotions and price changes",
          blocks: [
            "Promotions and sale prices apply only during the stated period and on the stated terms, and can't be combined unless we say so. We may change the starting prices on our site at any time. A change doesn't affect a quote you've already accepted, an invoice you've already paid or a SOW you've already signed. Changes to monthly plans follow {{s:subscriptions}}.",
          ],
        },
      ],
    },
    {
      id: "subscriptions",
      title: "Monthly plans: hosting, support and other recurring services",
      subsections: [
        {
          title: "Plans",
          blocks: [
            `Our monthly plans include hosting and support plans for the sites we build (${hostingFrom} per site) and any recurring service listed in a SOW, such as ad management or automation upkeep. Your proposal or SOW sets the plan's price, what it includes and when it starts.`,
          ],
        },
        {
          title: "Automatic renewal",
          blocks: [
            "**Monthly plans renew automatically each month until you cancel.** At the start of each billing period we invoice you, or charge the payment method you've authorized for the plan.",
            "**Before a plan starts,** your proposal or SOW shows what renews, the amount, when the first charge or invoice comes and how to cancel, and you agree to it in writing. If you choose to pay by a saved card or automatic payment, you authorize us, through our payment processor, to charge that payment method for each billing period until you cancel. We'll confirm the plan's terms to you by email when it starts.",
            `**Plans started through our former online order form** keep the terms agreed at purchase: ${legacyMonthly} a month for hosting, support and edits, first charged ${CHECKOUT.monthlyTrialDays} days after the build payment and then every month on that date, after you ticked a box that read \u201c${RENEWAL_CONSENT_TEXT}\u201d You authorized us, through Stripe, to charge the card you used for those payments until you cancel. Cancelling works as {{s:subscriptions.3}} describes.`,
            "There is no long-term contract unless your SOW says otherwise.",
          ],
        },
        {
          title: "Cancelling",
          blocks: [
            `You can cancel any monthly plan at any time by emailing ${mail} or calling ${tel}, or through any cancellation option we give you in writing. Plan confirmation emails include a link that opens a ready-to-send cancellation email. We'll confirm the cancellation in writing. It takes effect at the end of the billing period you've already paid for; the service continues until then and you won't be charged again. If you cancel before the first monthly charge, you won't be charged for the plan at all.`,
            "We don't refund partial months, except where the law requires it.",
            "Cancelling a plan doesn't affect your ownership of your website. {{s:hosting}} explains how to get your files and move your site.",
          ],
        },
        {
          title: "Price changes",
          blocks: [
            "We'll email you at least 30 days before a price increase applies to your plan. You can cancel before it takes effect.",
          ],
        },
        {
          title: "What hosting and support includes",
          blocks: [
            "Unless your SOW says otherwise, a hosting and support plan covers: hosting and SSL for the site we built, uptime monitoring, backups, security and software updates, and small edits to the site's existing content, such as text, photos, links, hours and listings. New pages, new features, redesigns, new integrations and large content loads are quoted separately. Plan customers' support requests are handled ahead of work that isn't under a plan, on business days.",
          ],
        },
        {
          title: "Failed payments",
          blocks: [
            "If a monthly payment fails, we'll let you know. If it isn't fixed within 10 days, we may suspend the plan as {{s:payment.3}} and {{s:hosting}} describe.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      title: "Refunds and cancelling a project",
      blocks: [
        "Our site doesn't promise refunds, so this section is our complete refund policy. Your SOW can give you more.",
        {
          list: [
            "**Before work starts.** If you cancel a project in writing before we start work on it, we'll refund what you paid for that project, minus any third-party costs we've already paid for you (such as domains, licenses or software) and any payment processing fees we can't recover. Work starts when we begin the kickoff, design or build, or send you a first preview, whichever comes first.",
            "**Fixed-price builds** (website templates, mortgage websites, single listing pages and other fixed-price packages). Once we've started work, the price is non-refundable, because the work is done up front and your place in our schedule is reserved.",
            "**Custom projects.** Your deposit is non-refundable once work starts; it reserves our time and covers early work. If you cancel a custom project later, you pay for the work done up to the cancellation date (by the milestones in your SOW, or otherwise in proportion to the work completed), and we refund anything you've paid beyond that. We deliver the work you've paid for.",
            "**Monthly plans** are covered in {{s:subscriptions.3}}.",
            "**Rush delivery.** If we miss a paid rush deadline for reasons within our control, we'll refund the rush fee ({{s:timelines}}).",
            "**If we cancel.** If we end a project for any reason other than your breach of these Terms, we'll refund what you've paid for work we haven't done.",
            "**Never refundable by us:** ad spend, platform and software subscriptions, AI and messaging usage fees, domain registrations, app store fees and other third-party costs, because they are paid to those third parties.",
          ],
        },
        "Approved refunds go back to the original payment method within 10 business days of approval. Your bank may take longer to show them.",
      ],
    },
    {
      id: "chargebacks",
      title: "Chargebacks",
      blocks: [
        "If you have a problem with a charge, contact us first. Most billing issues can be fixed quickly.",
        "If you dispute a valid charge for services we delivered or that you agreed to, we may suspend the related services until the dispute is resolved, and we'll give the card issuer the evidence we have, including your proposal or quote, the invoice, these Terms and our communications. If the dispute is decided in our favor, you'll repay the reversed amount and any dispute fees we were charged. A chargeback doesn't cancel a monthly plan; to cancel, follow {{s:subscriptions.3}}.",
      ],
    },
    {
      id: "responsibilities",
      title: "Your responsibilities",
      blocks: [
        "To do our work we depend on you. You agree to:",
        {
          list: [
            "give us the content, approvals, feedback and accurate information we ask for, on time",
            "give us the access we need (for example to your domain and DNS, hosting, ad accounts, CRM, social accounts, Skool or app store accounts), and keep your own passwords secure",
            "name one person who can approve work and make decisions for you",
            "own or have permission to use everything you give us, including photos (such as listing photos from an MLS or a photographer), logos, fonts, testimonials, reviews and data",
            "make sure your content, offers, prices, rates, licence numbers and claims are accurate and lawful",
            "have the consent or other legal basis required to give us contact lists and to email, text, call, track, record or advertise to people, and follow the laws on those activities, such as the TCPA, the Florida Telephone Solicitation Act, the CAN-SPAM Act and state privacy laws",
            "have your own privacy policy, terms and any cookie or tracking notices your sites need. We can supply starter text if your SOW includes it, but you are responsible for having it reviewed",
            "keep your own copies of your content and data",
          ],
        },
      ],
    },
    {
      id: "timelines",
      title: "Timelines and delays",
      blocks: [
        `**Timelines depend on the package and scope.** The typical timelines on our site are: ${name("listing")} (${price("listing")}): ${buildTimes.listing}. Mortgage website (${mortgageFrom}): ${buildTimes.mortgage}, or ${buildTimes.mortgageRush} with the rush add-on. ${name("template")} (${price("template")}): ${buildTimes.template}; qualified projects on a standard template follow our ${buildTimes.templateStandard} build. ${name("custom")}, ${name("crm")}, apps, AI and marketing work: ${buildTimes.custom}.`,
        "**Every timeline starts once we have what we need from you:** your content, account access, approvals and payment. Timelines are good-faith estimates, not guarantees, unless your SOW expressly guarantees a date. The rush add-on is the exception: if we miss a paid rush deadline for reasons within our control, we refund the rush fee.",
        "**If you're late, the date moves.** If content, access or approvals arrive late, the launch date moves by at least the length of the delay, and possibly more to fit our schedule. If a project waits on you for 30 days, we may put it on hold and restart it when we have capacity. If we hear nothing for 60 days after a written reminder, we may close the project; amounts for work already done are not refunded, and restarting may need a new quote.",
        "**Starter content.** For template projects we may build with temporary text or images where the request form or your SOW says we will. You are responsible for replacing them before launch.",
        "**Licence details.** For mortgage, real estate, title, insurance and other licensed businesses, we'll ask for the licence numbers and disclosures your site needs (such as your NMLS ID) before launch, and we may hold the launch until you provide them.",
      ],
    },
    {
      id: "changes-scope",
      title: "Changes to scope",
      blocks: [
        "The scope of a project is what your SOW or package describes. Anything else is a change: extra pages or features, new integrations, revisions beyond those included, new content after approval, or a switch of platform.",
        "Ask for changes in writing (email is fine). We'll tell you what the change costs and how it affects the timeline, and we'll start once you approve it in writing. We may make small changes at no charge at our discretion; doing so once doesn't commit us to doing it again.",
      ],
    },
    {
      id: "revisions",
      title: "Revisions, review and acceptance",
      blocks: [
        "**Included revisions.** Template builds include one round of revisions: one consolidated list of changes to the delivered design and content within the template's structure. Other projects include the revisions stated in the SOW. Further rounds are quoted before we do them. Revisions don't include switching templates, a new design direction after you've approved one, or new features.",
        "**Acceptance.** A deliverable is accepted when you approve it in writing (email or text is fine), when you launch or use it in your business, or 10 business days after we deliver it if you haven't sent us a written list of specific ways it doesn't match the SOW, whichever happens first. If you send such a list in time, we'll fix those items and redeliver, and the same acceptance steps apply to the fixes.",
        "After acceptance, further changes are new work, except fixes covered by our warranty in {{s:warranties}}.",
      ],
    },
    {
      id: "platforms",
      title: "Third-party platforms, fees and accounts",
      blocks: [
        "Much of our work runs on platforms we don't own or control, such as Meta (Facebook, Instagram, Messenger, WhatsApp), Google, Skool, GoHighLevel, hosting providers, domain registrars, AI model providers, the Apple App Store and Google Play, payment processors, and email and SMS providers. We're not affiliated with or endorsed by any of them unless we say so.",
        {
          list: [
            "**Fees.** You pay the platforms' fees, including subscriptions, ad spend, usage fees (AI usage, SMS and call minutes, email sends), domain registrations, app store developer accounts and MLS/IDX fees. Where possible you pay them directly from your own accounts. If we pay one for you, we bill it to you at cost unless your SOW shows a different amount. Our fees don't include third-party fees unless the SOW says so.",
            "**Your accounts.** We set up and build in accounts you own wherever the platform allows, so everything keeps running if we stop working together. If a platform requires the account to sit with us (for example a GoHighLevel sub-account under our agency account), we'll help you move it to your own account at the end where the platform allows, or export your data.",
            "**Their rules.** You must follow each platform's terms and policies. Platforms can change features, prices, policies, data access and algorithms at any time; reject or limit ads, posts or apps; and suspend or ban accounts. Those decisions are outside our control. We're not responsible for them or for their effects, and fees for work already done stay due. We'll help with appeals as part of paid services where we can.",
            "**Integrations.** Integrations such as IDX/MLS feeds depend on the vendor, your brokerage's approval, MLS rules, data access and your credentials. We'll confirm what's possible before we commit to it.",
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Advertising, marketing and results",
      blocks: [
        "**Ad spend.** Ad spend is paid by you, directly to the platform, from your own ad account. Our management fee is separate. You set or approve budgets, and we won't knowingly go over a budget you approved, although platforms may spend somewhat more on a given day under their own rules.",
        "**No guarantee of results.** We don't guarantee search rankings, traffic, leads, sales, revenue, cost per lead, return on ad spend, follower or member growth, ad approval, app store approval or any other result. Results depend on your market, offer, budget, competition and content, and on platforms we don't control. Projections, examples and sample dashboards on our site or in proposals are illustrations, not promises.",
        "**Reporting.** Our reports use the data platforms provide, which can be incomplete, delayed or later revised.",
        "**Your ads and posts.** You're responsible for the claims in your ads and posts once you approve them or let them run. For social media automation we use tools the platforms approve. We don't use bots that log in as you, mass-follow accounts or send spam.",
      ],
    },
    {
      id: "ai",
      title: "AI features, chatbots and voice agents",
      blocks: [
        "**AI output can be wrong.** Content and answers produced with AI can be inaccurate, incomplete, out of date or similar to output produced for others. You must review AI-generated content and automated responses before you rely on or publish them, especially anything about prices, rates, terms, licensing, legal, financial or medical matters.",
        "**Guardrails, not guarantees.** We limit chatbots and voice agents to your information, tell them what to do when they don't know an answer, and set up handoffs to a person. We test before launch. Even so, we can't guarantee an AI system will never give a wrong or unexpected answer.",
        "**Disclosure and consent are your responsibility.** For chatbots, voice agents and automated messages we build for you, you are responsible for:",
        {
          list: [
            "telling people they are dealing with an automated or AI system wherever the law requires it (we recommend always doing so)",
            "getting consent before calls are recorded. Florida requires the consent of everyone on a call (Florida Statutes section 934.03), and other states have similar laws",
            "getting the consent the TCPA and the Florida Telephone Solicitation Act require for automated or artificial-voice calls and texts, including prior express written consent for marketing, and honoring opt-outs and do-not-call lists",
            "making sure AI isn't used to make decisions about credit, housing, employment or insurance without human review and legal compliance",
          ],
        },
        "AI model, telephony and messaging usage fees are third-party fees under {{s:platforms}}. How we handle data sent to AI providers is in our [Privacy Policy](/privacy/).",
      ],
    },
    {
      id: "regulated",
      title: "Real estate, mortgage, title and other regulated businesses",
      blocks: [
        "Many of our clients are in real estate, mortgage lending and brokerage, title and insurance. If you are, **you are solely responsible for making sure your website, ads, funnels, messages, chatbots and other materials comply with the laws and rules that apply to you.** These include, for example:",
        {
          list: [
            "RESPA, including the Section 8 rules on referral fees and co-marketing",
            "the Truth in Lending Act and Regulation Z advertising rules, including trigger terms and APR disclosures, and the Mortgage Acts and Practices rule (Regulation N)",
            "the Equal Credit Opportunity Act (Regulation B), the Fair Housing Act and HUD's advertising rules",
            "Meta's Special Ad Categories for housing and financial products and services, and similar policies on other platforms",
            "NMLS ID and licence display rules under the SAFE Act and state law",
            "state real estate, mortgage, title and insurance licensing and advertising rules, such as requirements to show your brokerage name",
            "the TCPA, the Florida Telephone Solicitation Act, the CAN-SPAM Act and state privacy laws",
          ],
        },
        "We build with these rules in mind. For example, we set housing and credit ads up in Meta's Special Ad Categories, and our mortgage templates have space for your NMLS ID and required disclosures. **That is not legal or compliance advice and doesn't replace review by your compliance officer or lawyer.** You provide your licence details and required disclosures, and you approve final copy. We may refuse to publish content we believe is unlawful or misleading.",
        "Sample rates, reviews, testimonials and licence numbers in our demo templates are placeholders. They must be replaced with your real, verified information before launch and must never be published as real.",
      ],
    },
    {
      id: "ownership",
      title: "Ownership of your website and other work",
      subsections: [
        {
          title: "What \"you own your website\" means",
          blocks: [
            "Our site says you own your website outright and can take it with you. In legal terms, once you've paid in full for a project:",
            {
              list: [
                "**Your content stays yours.** You always own the text, photos, logos, data and other materials you give us.",
                "**Custom work becomes yours.** We assign to you all our rights in the deliverables we create specifically for you under that project: custom designs, custom code, copy we write for you, graphics and configurations (\"Custom Deliverables\").",
                "**Our reusable materials are licensed to you, permanently.** Every project also uses things we didn't make only for you: our templates, design systems, code, components, scripts, workflows, prompts and know-how, whether they existed before your project or were developed for general use (\"Pilk Materials\"). We keep ownership of Pilk Materials and give you a permanent, irrevocable, worldwide, royalty-free, non-exclusive license to use, copy, modify, host and move the Pilk Materials included in your deliverables, as part of those deliverables. The license doesn't depend on keeping any hosting or support plan with us, and it transfers with your website if you sell the site or your business.",
                "**Third-party components** such as open-source software, fonts, stock images, plugins and platform features stay under their own licenses. We'll tell you if any needs a paid license from you.",
              ],
            },
            "The result: once you've paid, you can keep running, editing and moving your website anywhere, with or without us, without paying us again. What the license doesn't allow is taking Pilk Materials, including our template designs, out of your deliverables to sell, license or give to others as templates, themes or components, or to build sites for other people.",
          ],
        },
        {
          title: "Before full payment",
          blocks: [
            "Until a project is paid in full, we own the deliverables and you may use previews only to review them. The assignment and license above take effect when payment is complete.",
          ],
        },
        {
          title: "Your accounts and data",
          blocks: [
            "Your domain, ad accounts, pixels, audiences, CRM data and leads, social accounts, Skool community and app store listings belong to you, even when we set them up or manage them.",
          ],
        },
        {
          title: "Custom designs",
          blocks: [
            "We won't resell a custom design we created for you or offer it to others as a template.",
          ],
        },
        {
          title: "Apps",
          blocks: [
            "For custom apps, once you've paid in full we transfer the source code repository to you, or give you a complete copy, and the app store listings stay in your own developer accounts.",
          ],
        },
      ],
    },
    {
      id: "templates",
      title: "Website templates",
      blocks: [
        {
          list: [
            "**Templates aren't exclusive.** Our template designs are Pilk Materials. We build sites for other clients from the same templates and customize each one with that client's brand and content.",
            "**License scope.** A template project licenses the template, as part of your finished site, for one website for one business (yours) on the domains you use for that business, under {{s:ownership.1}}. Another site needs another project or our written permission.",
            "**No resale.** You may not resell, sublicense, redistribute or share a template or its code as a template or theme, or use it to build sites for others.",
            "**Demo content.** Names, photos, reviews, rates and licence numbers in our demos are placeholders. Some demo photos are licensed only for our demos; we'll replace them with your photos or properly licensed images.",
          ],
        },
      ],
    },
    {
      id: "portfolio",
      title: "Your content, portfolio use and credit",
      blocks: [
        "You give us a non-exclusive license to use your content and data to provide the services.",
        "After launch we may show the work in our portfolio, case studies and marketing, with screenshots, a short description, your business name and logo and a link. You can opt out in writing at any time; we'll stop new uses and remove existing ones within a reasonable time. We never show your confidential information.",
        "We may place a small \"Website by Pilk.ai\" credit link in your site's footer. Ask us and we'll remove it.",
        "If you give us feedback or suggestions about our services, we may use them freely. We use your testimonial only with your permission.",
      ],
    },
    {
      id: "hosting",
      title: "Hosting, domains, maintenance and moving your site",
      blocks: [
        {
          list: [
            "**Domains.** Your domain should be registered in your name, in your account. If we register one for you, we register it in your name where the registrar allows, or transfer it to you on request. You pay the registrar's fees.",
            "**Availability.** We host on third-party infrastructure such as Cloudflare. We work to keep sites online and fast, but we don't guarantee uninterrupted availability; maintenance and provider outages happen.",
            "**Backups.** Hosting plans include backups, but keep your own copies of your content. If data is lost, our responsibility is limited to restoring the most recent backup we hold.",
            "**Moving your site.** If you cancel hosting or want to move your site, and your build is paid in full, we'll give you a copy of your website's files within 10 business days of your request, plus reasonable help pointing your domain to your new host. Larger moving work, such as rebuilding on another platform or migrating a CRM, is quoted.",
            "**Unpaid hosting.** If hosting charges go unpaid, we'll give you at least 14 days' written notice before taking your site offline. Your ownership doesn't change, and we won't withhold your site's files because of unpaid hosting fees; you can get them as described above.",
            "**After hosting ends,** we may delete our hosted copies 30 days after the last paid period, after giving you your files if you asked for them.",
            "**Security and accessibility.** We apply updates and follow good security practice, but no site is immune to attack. We check for common accessibility problems, but full conformance with WCAG or the ADA is included only if your SOW says so, and you're responsible for the accessibility of content you add.",
            "**Email hosting** isn't included unless your SOW says so.",
          ],
        },
      ],
    },
    {
      id: "confidentiality",
      title: "Confidentiality",
      blocks: [
        "Each of us may share non-public business information with the other, such as strategies, pricing, customer data, account logins, code and unreleased plans (\"confidential information\"). Each of us will use the other's confidential information only for our work together, protect it with at least reasonable care, and share it only with people and providers who need it for that work and are bound to protect it.",
        "This doesn't apply to information that is or becomes public through no fault of the receiving party, that the receiving party already knew or developed independently, or that it received lawfully from someone else. If the law or a court requires disclosure, the receiving party will give notice where allowed and disclose only what is required.",
        "These duties last while we work together and for 3 years afterwards, and for as long as the information remains a trade secret or a password. On request, each of us will return or delete the other's confidential information, except copies kept in routine backups or required by law. We keep logins you give us confidential and use them only for your work.",
      ],
    },
    {
      id: "sms",
      title: "Text message terms",
      blocks: [
        "These terms apply when we text you.",
        {
          list: [
            "**Program:** text messages from Pilk.ai (Pilk Consulting LLC) about your inquiry, project, order, appointments and account, and occasional marketing messages about our services, some of which may be sent using automated technology.",
            "**Consent:** we text you only if you gave us your mobile number and agreed to texts. You agree by ticking the optional text-message box under the phone field on one of our forms; it is unticked by default and you can send the form without it. If you don't tick it but ask us to text you, for example by choosing text as your preferred contact method, we text only about that inquiry, never marketing. Consent is not a condition of purchase.",
            "**Frequency and cost:** message frequency varies. Message and data rates may apply.",
            "**Opting out:** reply STOP to cancel. We'll confirm and stop texting unless you opt back in. **Help:** reply HELP, or contact " + mail + " or " + tel + ".",
            "**Carriers** are not liable for delayed or undelivered messages.",
            "**Privacy:** our [Privacy Policy](/privacy/) explains how we handle your number. We don't share mobile numbers or text opt-in data with third parties for their marketing.",
          ],
        },
      ],
    },
    {
      id: "site-use",
      title: "Using pilk.ai",
      blocks: [
        "You may browse pilk.ai, contact us and ask for quotes. You may not:",
        {
          list: [
            "break the law, submit false information or impersonate anyone",
            "send spam or automated form submissions, or use our forms to send marketing",
            "upload malware, or content you don't have the right to share",
            "try to access parts of the site or our systems that aren't public, probe or attack them, overload them or get around their security",
            "copy our site's design or our demo templates for commercial use",
          ],
        },
        "Search engines and other crawlers that follow our robots.txt are welcome to index our public pages.",
        "The site's content, design and demo templates belong to Pilk Consulting LLC or its licensors. Apart from viewing and sharing links, no license is granted. The businesses, properties, people and rates on our demo sites and demo listing pages are fictional and are not offers.",
        "We try to keep the site accurate, but it may contain errors, and starting prices and availability can change. Nothing on the site is an offer to sell. A project is agreed only when we both accept a written proposal or quote. We may change or suspend the site at any time.",
      ],
    },
    {
      id: "copyright",
      title: "Copyright complaints",
      blocks: [
        `If you believe content on pilk.ai or on a site we host infringes your copyright, email our designated agent, Aaron Pilkington, at ${mail} with: your contact details; a description of the copyrighted work; the URL of the material you object to; a statement that you believe in good faith the use isn't authorized; a statement, under penalty of perjury, that your notice is accurate and that you own the copyright or are authorized to act for the owner; and your physical or electronic signature.`,
        "If material you posted is removed and you believe that was a mistake, you can send a counter-notice with the details 17 U.S.C. section 512(g) requires. We end the accounts and services of repeat infringers where appropriate.",
      ],
    },
    {
      id: "warranties",
      title: "Warranties and disclaimers",
      blocks: [
        "**Our warranty.** We'll perform our services in a professional manner consistent with generally accepted industry standards. If a deliverable doesn't match its SOW, tell us in writing within 30 days of delivery. We'll fix it at no charge or, if we can't, refund the fees you paid for the part that doesn't match. That is your only remedy under this warranty. It doesn't cover problems caused by you or others, by changes someone else made, by misuse, or by third-party platforms.",
        "**EXCEPT FOR THE WARRANTY ABOVE, THE SITE AND OUR SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\". TO THE FULLEST EXTENT THE LAW ALLOWS, WE DISCLAIM ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT, AND ANY WARRANTY THAT THE SITE, SERVICES, DELIVERABLES OR AI OUTPUT WILL BE ACCURATE, UNINTERRUPTED, SECURE, ERROR-FREE OR WILL PRODUCE ANY PARTICULAR RESULT. WE MAKE NO WARRANTY ABOUT THIRD-PARTY PLATFORMS OR SERVICES.**",
        "Some jurisdictions don't allow certain disclaimers. In those places, the disclaimers apply to the fullest extent allowed.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      blocks: [
        "**TO THE FULLEST EXTENT THE LAW ALLOWS:**",
        {
          list: [
            "**NEITHER PARTY WILL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, BUSINESS, GOODWILL, DATA, LEADS OR AD SPEND, EVEN IF TOLD THEY WERE POSSIBLE.**",
            "**OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SITE, THESE TERMS OR OUR SERVICES IS LIMITED TO THE AMOUNT YOU PAID US FOR THE SPECIFIC SERVICE THAT GAVE RISE TO THE CLAIM IN THE 12 MONTHS BEFORE THE EVENT THAT CAUSED IT, OR $100 IF YOU HAVEN'T PAID US ANYTHING.**",
          ],
        },
        "These limits don't apply to your obligation to pay for services, to your obligations under {{s:indemnity}}, to misuse of the other party's intellectual property, or to liability for fraud or willful misconduct or any other liability that the law doesn't allow to be limited. They are part of the basis of our prices.",
      ],
    },
    {
      id: "indemnity",
      title: "Indemnification",
      blocks: [
        "You will defend, indemnify and hold harmless Pilk Consulting LLC and its members, managers, contractors and agents from all third-party claims, and the related losses, fines, penalties, damages and costs (including reasonable attorneys' fees), arising from:",
        {
          list: [
            "content, data and materials you give us, including claims that they infringe someone's rights",
            "your contact lists and how you collected them",
            "your emails, texts, calls, voice agents and chatbots, including claims under the TCPA, the Florida Telephone Solicitation Act, the CAN-SPAM Act and call-recording laws",
            "your ads, offers and claims",
            "your compliance with the laws and rules that apply to your business, including those in {{s:regulated}}",
            "your use of deliverables after delivery, including changes made by you or others",
            "your breach of these Terms or of a platform's terms",
          ],
        },
        "We'll tell you promptly about any claim. You'll control the defense with counsel reasonably acceptable to us, and you won't settle in a way that admits fault for us or binds us without our consent. We may take part with our own counsel at our own cost.",
      ],
    },
    {
      id: "force-majeure",
      title: "Events outside our control",
      blocks: [
        "Neither party is responsible for delays or failures caused by events beyond its reasonable control, such as hurricanes and other natural disasters, floods, fire, power or internet outages, illness or pandemics, war, terrorism, government action, cyberattacks, or outages, policy changes or account suspensions at third-party platforms, hosts, AI providers or payment processors that we didn't cause. Timelines move by the length of the event. If an event lasts more than 30 days, either party may end the affected SOW by written notice, and you'll pay for work done up to then. Events like these don't excuse payment for services already provided.",
      ],
    },
    {
      id: "termination",
      title: "Ending our work together",
      blocks: [
        {
          list: [
            "**You** may end a project or service at any time by written notice. You'll pay for work done up to the end date and for third-party costs we can't cancel. Monthly plans end as {{s:subscriptions.3}} describes, and refunds follow {{s:refunds}}.",
            "**We** may end a project or service if you materially breach these Terms and don't fix the breach within 10 days of written notice, or immediately if you use our services to break the law or abuse our staff. We may also end a project for any reason with 30 days' written notice; we'll then refund prepaid amounts for work not done and deliver the work you've paid for.",
            "**When work ends,** you pay what you owe; we deliver paid-for deliverables and your site's files as {{s:hosting}} describes; the licenses for paid work continue; each of us returns or deletes the other's confidential information as {{s:confidentiality}} describes; and we remove our access to your accounts when you ask. We recommend changing any passwords you shared with us.",
          ],
        },
      ],
    },
    {
      id: "disputes",
      title: "Resolving disputes: binding individual arbitration and class and jury waiver",
      subsections: [
        {
          title: "Try to resolve it first",
          blocks: [
            `Before starting arbitration or a court case, the party with the dispute must send the other a written notice describing it and the remedy wanted. Notices to us go to ${mail}. We'll both try in good faith to resolve the dispute for 30 days. Time limits for bringing the claim are paused during those 30 days.`,
          ],
        },
        {
          title: "Agreement to arbitrate",
          blocks: [
            "Except as {{s:disputes.5}} provides, any dispute, claim or controversy arising out of or relating to these Terms, the site, our services or our relationship, including disputes about the scope or enforceability of this agreement to arbitrate, will be resolved by **binding individual arbitration** administered by the American Arbitration Association (\"AAA\"). The AAA's Consumer Arbitration Rules apply if you are an individual who bought services mainly for personal, family or household use; otherwise its Commercial Arbitration Rules apply. The rules are at [adr.org](https://www.adr.org).",
            "A single arbitrator will decide the dispute. Hearings may take place by video or phone or in Pinellas County, Florida; if the Consumer Rules apply, you may choose a hearing in the county where you live. The arbitrator may award the same individual relief a court could, but only to the individual party and only as needed for that party's claim. Judgment on the award may be entered in any court with jurisdiction. The Federal Arbitration Act governs this section.",
            "Fees follow the AAA rules. If the Consumer Rules apply, you pay no more than the consumer filing fee they set, and we pay the rest of the AAA and arbitrator fees. Each party pays its own attorneys' fees unless the law or the arbitrator awards them.",
          ],
        },
        {
          title: "Class action waiver",
          blocks: [
            "**Disputes will be resolved only on an individual basis.** Neither of us may bring or take part in a class, collective, consolidated or representative action or arbitration, or act as a private attorney general, and an arbitrator may not consolidate claims of more than one party without both parties' written agreement.",
          ],
        },
        {
          title: "Jury trial waiver",
          blocks: [
            "**YOU AND WE EACH WAIVE ANY RIGHT TO A JURY TRIAL** for any dispute arising out of or relating to these Terms, the site or our services, whether it is heard in arbitration or, where these Terms allow, in court.",
          ],
        },
        {
          title: "Exceptions",
          blocks: [
            "Either of us may bring an individual claim in small claims court if it qualifies there. Either of us may also ask a court for an injunction or other equitable relief to protect intellectual property or confidential information, or to stop unauthorized use of the site or services, including breach of the license limits in {{s:ownership}} and {{s:templates}}.",
          ],
        },
        {
          title: "Many similar claims",
          blocks: [
            "If 25 or more similar arbitration demands are filed against either of us by the same or coordinated counsel, the AAA's Mass Arbitration Supplementary Rules apply.",
          ],
        },
        {
          title: "30-day right to opt out",
          blocks: [
            `You can opt out of this agreement to arbitrate by emailing ${mail} within 30 days after you first accept these Terms. Include your name, the email you use with us and a clear statement that you opt out of arbitration. Opting out doesn't affect any other part of these Terms; disputes will then be resolved in court as {{s:law}} provides.`,
          ],
        },
        {
          title: "If part of this section is unenforceable",
          blocks: [
            "If the class action waiver is found unenforceable as to a claim, that claim must be separated and heard in court under {{s:law}}, not in arbitration. The rest of this section stays in effect.",
          ],
        },
        {
          title: "Changes to this section",
          blocks: [
            "If we change this section, the change won't apply to a dispute either of us gave notice of before the change. You may reject a material change by emailing us within 30 days after it's posted, and the earlier version will continue to apply to you.",
          ],
        },
      ],
    },
    {
      id: "law",
      title: "Governing law and courts",
      blocks: [
        "Florida law governs these Terms and any dispute between us, without regard to conflict-of-laws rules, except that the Federal Arbitration Act governs {{s:disputes}}. The UN Convention on Contracts for the International Sale of Goods doesn't apply.",
        "Any court case these Terms allow, or any dispute not subject to arbitration, must be brought only in the state courts in Pinellas County, Florida, or the United States District Court for the Middle District of Florida, and each of us agrees to the personal jurisdiction of those courts.",
      ],
    },
    {
      id: "electronic",
      title: "Electronic communications and signatures",
      blocks: [
        "You agree to receive communications from us electronically, by email, on the site and by text where you've agreed to texts. Electronic communications satisfy any legal requirement that a communication be in writing.",
        "Clicking a pay or submit button, checking a box, typing your name, or approving by email or text counts as your signature and binds you, under the federal E-SIGN Act and Florida's Uniform Electronic Transaction Act. You can ask us for a paper copy of any agreement. You can withdraw consent to electronic communications by emailing us, but we may then be unable to continue services that depend on them. Please keep your email address current with us.",
      ],
    },
    {
      id: "general",
      title: "General terms",
      blocks: [
        {
          list: [
            "**Relationship.** We are an independent contractor. These Terms don't create a partnership, joint venture, employment or agency relationship.",
            "**Assignment.** You may not assign these Terms without our written consent. We may assign them to an affiliate or to a successor in a merger or sale of our business, with notice to you.",
            "**Severability.** If any part of these Terms is unenforceable, it will be enforced to the extent possible and the rest stays in effect.",
            "**No waiver.** Not enforcing a right isn't a waiver of it.",
            "**Entire agreement.** These Terms, the Privacy Policy and your SOWs are the entire agreement between us about their subject and replace earlier agreements and understandings about it.",
            `**Notices.** Legal notices to us must be emailed to ${mail}. We'll send notices to the email address you gave us or the one in your SOW. Notices take effect when sent, unless the sender learns they weren't delivered.`,
            "**Changes to these Terms.** We may update these Terms by posting a new version here with a new \"Last updated\" date. If a change materially affects an active project or monthly plan, we'll email you at least 30 days before it applies to you. Changes don't alter a SOW you've already signed, and {{s:disputes.9}} governs changes to the arbitration section. Using the site or our services after a change takes effect means you accept it.",
            "**Survival.** Sections that by their nature should continue after our work ends will continue, including those on payment, refunds, ownership, templates, confidentiality, warranties and disclaimers, limitation of liability, indemnification, dispute resolution and governing law.",
            "**Interpretation.** Headings are for convenience. \"Including\" means \"including without limitation\". Examples don't limit the general words they illustrate.",
            "**No third-party beneficiaries.** Only you and we have rights under these Terms.",
          ],
        },
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

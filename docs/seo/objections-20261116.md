# Objection research for "Is a web design agency worth it?", 16 Nov 2026

Feeds the page at `/is-a-web-design-agency-worth-it/` (content in
`src/content/guides/web-design-agency-worth-it.ts`). Everything below is
paraphrased. Nothing from these threads is quoted on the site.

## Why this angle

Websites are where Pilk.ai publishes real starting prices (listing page $250
per listing, Complete Website $1,000, Custom Website $2,500, Custom Website +
Full CRM $5,000, mortgage websites $500, hosting and support $100/mo, all from
`src/content/packages.ts`). AI consulting and automation are quoted per project
with no starting figure, and apps are a single $15,000 starting figure, so an
honest "is it worth it" page has the most to work with on websites. The
AI-consultant and custom-app searches also turned up no usable Reddit threads
(see Method).

## Method and limits

- Searches run (WebSearch, standard mode): `site:reddit.com "web design agency"
"waste of money"`, `site:reddit.com "hired an agency" website regret`,
  `site:reddit.com "AI consultant" "waste of money" small business`,
  `site:reddit.com custom app development "waste of money"`, plus about ten
  variants naming r/smallbusiness, r/Entrepreneur and r/web_design.
- The search tool ignored `site:` and mostly returned agency blog posts. Reddit
  threads showed up only now and then, usually as copies on Reddit front-end
  mirrors.
- reddit.com answered HTTP 403 to direct requests. Two threads were read through
  the mirror copy the search returned. After that, the session's permission
  check refused further mirror fetches, so the rest are known by title or
  through a third-party roundup that links the thread.
- So the sample is small. If the owner wants a deeper pass, running the same
  `site:reddit.com` searches in Google from a normal browser will surface more
  threads. The objections below are also the standard ones agencies hear, so
  the page should hold up.

## Reddit threads used

| #   | Thread                                                                                               | How it was read                                                                          | What it contributes                                                                                                                                                                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | https://www.reddit.com/r/startups/comments/1g89dgt/i_wasted_50000_building_my_startup/               | Full thread (mirror copy from search)                                                    | A non-technical founder left a freelancer for an agency that promised speed, got treated as one small client among many, and the build stalled. Commenters: talk to the founder rather than a salesperson, expect honest pushback, start with a small project, and rank features by what they earn.                            |
| 2   | https://www.reddit.com/r/msp/comments/1epwlpx/another_5k_wasted_with_no_results/                     | Full thread (mirror copy from search)                                                    | An owner spent about $5k on one agency engagement and much more on ads and content with no new clients. Commenters: agencies that don't know the industry write generic messaging, one lost a large sum to a minimum-term contract, ask for references and clear terms, marketing takes months, and referrals work best early. |
| 3   | https://www.reddit.com/r/smallbusiness/comments/145r7jw/best_website_builder/                        | Through the roundup at sitebuilderreport.com/best-website-builder-reddit, which links it | A web designer in the thread tells beginners to launch something simple on a builder, start earning, then pay professionals to rebuild later, and warns that cheap freelancers are hit and miss.                                                                                                                               |
| 4   | https://www.reddit.com/r/smallbusiness/comments/hjoggf/what_is_the_best_website_builder_for_a_small/ | Through the same roundup                                                                 | Owners recommend drag-and-drop builders for small businesses because no code is needed and hosting is handled. DIY is enough for plenty of people.                                                                                                                                                                             |
| 5   | https://www.reddit.com/r/nonprofit/comments/1bm0o2q/webdev_took_website_and_emails/                  | Title only (found in search; the thread could not be opened)                             | The title alone describes a developer taking control of an organisation's website and email. Used only as one example of the ownership complaint, not for any detail.                                                                                                                                                          |

Seen in search but not used, because only the title was available and it was
off the website topic: r/smallbusiness 1e1820n (is paying someone to do social
posts worth it) and r/growmybusiness 1dnq6tr (website platform pros and cons).

Secondary pages that summarise Reddit discussion without linking threads,
used only to confirm a theme was common: aamax.co/blog/web-design-agency-reddit
(communication gaps, hidden fees, lock-in, disappearing after launch,
unrealistic SEO promises) and discury.io/reddit-research/website-builders
(builder plans adding up each month, moving a site being hard).

## The objections, and where the page answers them

1. **"I can build it myself on Wix or Squarespace."** Threads 3, 4. Page:
   says yes, plenty should; explains the time-for-money trade; repeats the
   "launch simple, rebuild later" advice.
2. **"Why pay thousands for what's basically a template?"** Thread 3 (cheap
   vs. pro builds), aamax (pricing questions). Page: what the money covers
   beyond the design, our exact starting prices, and "ask what the money
   covers".
3. **"I paid and got no leads."** Thread 2, aamax (SEO promises). Page: a site
   converts traffic, it doesn't create it; nobody can promise rankings; plan
   for traffic separately (links to Meta ads and lead funnels).
4. **"They'll own my site and hold it hostage."** Thread 5, discury (moving
   sites), aamax (lock-in). Page: domain in your name, admin access, ownership
   in writing; Pilk.ai launches on your domain and you keep the site if you
   stop the plan (links to /own-vs-rent/).
5. **"Small clients get ignored and projects drag on."** Thread 1, aamax
   (communication). Page: you deal with Aaron directly, written scope, the
   seven-day build for qualified template projects, late content moves dates.
6. **"They won't understand my business."** Thread 2. Page: ask for live sites
   in your industry; our work so far is mostly real estate, mortgage and title
   (links to /work/); copywriting is an add-on.
7. **"Long contracts and a fee for every change."** Thread 2 (minimum-term
   contract), aamax (hidden fees, vanishing after launch). Page: hosting is
   month to month with no long-term contract, one round of revisions included,
   extras quoted on top.

## Facts the page relies on, and their source in the repo

- Starting prices, hosting terms, revisions, build times: `src/content/packages.ts`
- Quote-only, nothing sold online: `src/lib/pricing.ts` (`QUOTE_ONLY_NOTE`)
- You own the site, launched on your domain: `src/content/services/websites.ts`,
  `src/app/mortgage/page.tsx`
- Run by Aaron Pilkington, no account managers: `src/content/local.ts`
- Nobody can honestly promise a ranking: `src/content/services/websites.ts` FAQ
- Edits after launch depend on the build: `src/content/faq.ts`
- Past website work in real estate, mortgage and title: `src/content/local.ts`,
  `src/content/projects.ts`

No statistics, client results, testimonials or guarantees appear on the page.

# GoHighLevel (LeadConnector API v2)

Every lead form on pilk.ai sends the lead to Pilk's own GoHighLevel
sub-account, **"Pilk Ai"** (location `rg3WUxqvDHrkiyBmEiCV`). Code:
`functions/api/_ghl.ts` (the API calls), `functions/api/leads.ts` and
`functions/api/template-intake.ts` (what each form sends),
`functions/api/_lead-context.ts` (template/package lookup and note lines),
`functions/api/_consent.ts` (the consent record). Tests:
`npm run test:functions`, which records every outbound GHL call.

## The rule: GHL is best effort

The Resend notification email to Aaron@pilk.ai is the authoritative copy of
every lead. GoHighLevel can never fail or delay a submission:

- the function answers the visitor first and runs the GHL work afterwards in
  `waitUntil`, so a slow or broken GHL adds no wait;
- every call has an 8-second timeout and nothing in `_ghl.ts` throws;
- a failed step doesn't stop the later ones (except that nothing can be
  attached without a contact id);
- with no `GHL_PIT_TOKEN`, no request is made at all.

Errors are logged as `[ghl] <step> failed status=<code> contact=<id>`: the step,
the HTTP status and at most the GHL contact id. No name, email, phone or
response body is ever logged (GHL error bodies can echo them). View them with
`npx wrangler pages deployment tail --project-name pilk-ai-media`.

## Configuration

| Name | Where | Value |
|---|---|---|
| `GHL_PIT_TOKEN` | Pages **secret** | Private Integration Token for the "Pilk Ai" sub-account |
| `GHL_LOCATION_ID` | `wrangler.toml` [vars] | `rg3WUxqvDHrkiyBmEiCV` |
| `GHL_PIPELINE_ID` | `wrangler.toml` [vars] | `b5MOhnwFWpcxyE2s9HS6` (pipeline "PILK AI") |
| `GHL_STAGE_NEW_LEAD` | `wrangler.toml` [vars] | `d59f55de-0454-4a91-97e0-db0d22912c3a` |
| `GHL_STAGE_INTAKE_COMPLETED` | `wrangler.toml` [vars] | `c6b24259-eb67-4b38-98ec-ff3f288a7e43` |
| `GHL_STAGE_LOST` | `wrangler.toml` [vars] | `64681146-391c-4e54-8061-61abc7dd1704` |
| `GHL_STAGE_ORDER` | `wrangler.toml` [vars] | all nine stage ids, comma-separated, in pipeline order |

Change a pipeline or stage id in `wrangler.toml` and redeploy; no code change.
If `GHL_PIPELINE_ID` or the form's stage is missing, the opportunity step is
skipped and everything else still runs.

Pipeline stages, in order: New Lead, Intake Completed, Awaiting Payment,
Paid — Website, In Build, Delivered / Live, GHL Build-Out (Upsell),
Active Client ($100/mo), Lost / No Response.

## Token scopes the Private Integration needs

GHL → **Settings → Private Integrations** → the pilk.ai integration → scopes:

| Scope | Used for |
|---|---|
| `contacts.write` (Edit Contacts) | `POST /contacts/upsert`, `POST /contacts/{id}/tags`, `POST /contacts/{id}/notes`. GHL has no separate tags or notes scope; both sit under contacts. |
| `contacts.readonly` (View Contacts) | not called today; harmless and often required alongside write |
| `opportunities.readonly` (View Opportunities) | `GET /opportunities/search`, to find the contact's existing opportunity |
| `opportunities.write` (Edit Opportunities) | `POST /opportunities/` (create) and `PUT /opportunities/{id}` (move forward) |

**If the token lacks the opportunities scopes, the opportunity step fails
quietly**: the search answers 401/403, the log shows
`[ghl] opportunity search failed status=401 contact=…`, no opportunity is
created or moved, and the contact, tags, fields and note still land. Add the
two opportunities scopes in GHL → Settings → Private Integrations (editing the
scopes may issue a new token; if it does, set it again with
`npx wrangler pages secret put GHL_PIT_TOKEN --project-name pilk-ai-media`).

## What happens on each submission

In this order:

1. **Contact upsert** — `POST /contacts/upsert` with `locationId`, name,
   email, phone, company, `source` and `customFields`. **No `tags`**: GHL's
   upsert replaces the contact's whole tag set with whatever is sent, which used
   to wipe tags such as `pilk-paid` and `sms-consent`. Empty values are left out,
   so a later form never blanks a field. The location matches on email and phone
   (duplicates off), so a returning visitor updates their existing contact.
2. **Tags** — `POST /contacts/{id}/tags`, which adds and never removes.
3. **Opportunity** in the PILK AI pipeline (below).
4. **Note** — `POST /contacts/{id}/notes` with the full submission and the
   consent record (below). Added on every lead, not only when texts were agreed.

The Stripe webhook (`functions/api/stripe-webhook.ts`, kept for hosting plans
started at the former checkout) uses the same upsert, so `pilk-paid` is now
added rather than replacing the contact's tags.

### Per form

| Form | Endpoint | Contact `source` | Tags added | Opportunity stage | `lead_intent` |
|---|---|---|---|---|---|
| Quick inquiry (`/inquiry/`, home "Inquiry Now") | `/api/leads` | pilk.ai website | `pilk-website-lead`, `quick-inquiry`, `pilk-form-inquiry` | New Lead | `inquiry` |
| Contact form (`/mortgage/`, `/real-estate/`) | `/api/leads` | pilk.ai website | `pilk-website-lead`, the project type (e.g. `template`), `pilk-form-contact` | New Lead | `contact` |
| Demo listing "Request info" | `/api/leads` | pilk.ai website | `pilk-website-lead`, `listing-demo-inquiry`, `pilk-form-listing-inquiry` | New Lead | `listing-inquiry` |
| Demo listing "Book a showing" | `/api/leads` | pilk.ai website | `pilk-website-lead`, `listing-demo-showing`, `pilk-form-listing-showing` | New Lead | `listing-showing` |
| Project brief (`/contact/`) | `/api/leads` | pilk.ai website | `pilk-website-lead`, the project type, `pilk-form-brief` | Intake Completed | `project-brief` |
| Template request (`/start/<template>/`) | `/api/template-intake` | pilk.ai template intake | `pilk-template-intake`, the template slug, `pilk-form-template-request` | Intake Completed | `template-request` |

Every form also adds `sms-consent` when the visitor ticked the optional text
box with a usable phone number and a published wording version.

### Custom fields

Sent by field id (`customFields: [{ id, fieldValue, field_value }]`;
`fieldValue` is the v2 name, `field_value` the older alias, same value).
Only fields with a value are sent.

| Field | Id | Filled from |
|---|---|---|
| Website URL | `Z7aH8hTfElbrgAwY2lN7` | brief/contact: current website; template request: the first link that isn't a social profile |
| Service Area | `6iGwqudyrBXFDvyDtcDl` | template request |
| Template Chosen | `6gTNA2dWOj1B42zWCwMK` | the template slug (brief, contact form, template request) |
| Timeline | `dLJTGCwpNRtcjDKdYqxJ` | brief/contact: desired launch |
| UTM Source / Medium / Campaign | `xdzkeIZzKaYh8osvDPLq` / `U1nHfmtNW8YSFPrYJ2Jc` / `Pq9gAzR9Lqj8JCoBKwSR` | the session's UTM tags |
| Google Click ID | `daCb9Q8Pu9iuy5r9jku8` | `gclid` |
| Source Path | `id4Ti8l8VyKTqIAnI3vb` | path of the page the form was sent from (else the landing page) |
| Lead Intent | `9jphm36XMQsBiFxt4TCE` | the form type (table above) |
| Consent Disclosure Version | `Nkt8JgJj2CtYVQ4MNcJB` | only when SMS consent is valid: the wording version, e.g. `sms-v1-2026-11-13` |
| Consent Received At | `eML577wowahPcDZfnitF` | only when SMS consent is valid: server time, ISO 8601 UTC |

The two consent fields are never sent without consent, so a later form without
the box ticked can't clear an earlier consent. There is no Facebook click ID
field: `fbclid` goes in the note. Add-ons Purchased and Order Amount are only
set by the Stripe webhook.

### Opportunity

- Searched with `GET /opportunities/search?location_id=…&pipeline_id=…&contact_id=…`.
- **None yet:** created with `POST /opportunities/`: pipeline PILK AI, the
  form's stage, `status: "open"`, name `"<Name> — <form label>"` plus
  `" (<template or package>)"` when one was chosen, e.g.
  `Maria Lopez — Template request (RateReady)`.
- **Never moved backwards.** If the existing opportunity is at the same or a
  later stage in `GHL_STAGE_ORDER` (for example Paid, In Build or Active
  Client), it is left exactly as it is and only the note is added. If it is at
  an earlier stage (New Lead when a brief arrives), it's moved forward with
  `PUT /opportunities/{id}`. A stage that isn't in `GHL_STAGE_ORDER` is never
  moved.
- **Lost / No Response is reopened**: if the opportunity is in that stage, or
  its status is `lost` or `abandoned`, a new submission moves it to the form's
  stage with `status: "open"`, because the person has come back.
- **Value:** `monetaryValue` is the "starting at" figure of what was chosen: a
  pricing-card package (`?package=` on `/contact/`: listing 250, template 1,000,
  custom 2,500, crm 5,000, mortgage 500) or else the template (mortgage
  templates 500, real estate templates 1,000, single listing page 250, custom
  site 2,500). Nothing chosen, no value. Moving an opportunity forward sets the
  value only if it had none, so a quote figure typed into GHL is kept.
- If the search fails, nothing is created or moved (it can't know where the
  existing opportunity is). With duplicate opportunities off, a create that
  races another one gets `OPPORTUNITY_NO_DUPLICATE` and is logged.
- The API has no `source` field for opportunities, so the form appears in the
  opportunity name, the `lead_intent` field and the note instead.

### Note

Plain text, at most 5,000 characters:

1. `pilk.ai lead: <form label>` and the time received;
2. the consent record: how the Terms were agreed to on that form and, for
   texts, either the full SMS record (given at, page, phone, wording version,
   wording shown, IP address, browser) or "NOT agreed" / "no phone number";
3. the submission: every field the visitor filled in, uploaded file names and
   sizes (never the files), then the form page, landing page, referrer, UTM
   source/medium/campaign/content/term, Google and Facebook click IDs.

A brief too long to fit is shortened at the end of the submission part; the
consent record is always kept whole, and the full text is in the email.

## What GHL does next

Workflows, texts and emails that fire on these contacts, tags or pipeline
stages are configured inside GoHighLevel, not in this repo. Existing workflows
that triggered on "tag added" still see the same tag names; the per-form tags
(`pilk-form-*`) are new. Because tags are now added rather than replaced, a
contact keeps `pilk-paid` and `sms-consent` when they send another form.

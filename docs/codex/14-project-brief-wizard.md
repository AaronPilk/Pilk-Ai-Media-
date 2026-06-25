# Task 14 — Start a Project → website brief wizard

## Objective
Convert `/contact` into a 6-step guided website-brief builder (not an app questionnaire). Visitor feels like they're assembling their website.

## May modify
- `src/lib/project-brief-schema.ts` (new shared zod schema + types + option lists)
- `src/components/contact/ProjectBriefWizard.tsx`, `WizardProgress.tsx`, `WizardNavigation.tsx`
- `src/components/contact/steps/*` (Business, Project, Template, Style, Inspiration, Review)
- `src/components/contact/fields/*` (ColorPalettePicker, TemplateSelector, PageSelector, InspirationUrls, ProjectFileUpload)
- `src/components/contact/project-palettes.ts`
- `src/app/contact/page.tsx` (use wizard)
- `functions/api/leads.ts` (multipart + JSON, R2 upload, validation, escaped emails)
- `wrangler.toml` (R2 binding), `.env.example`

## Steps
1. Business (name, email, phone, company, industry, current site, description, audience)
2. What we're building (project type + goal/pages/functionality/integrations)
3. Starting design (visual template cards, query `?template=` preselect, custom/skip)
4. Colors & direction (palettes + custom colors + style keywords + theme)
5. Inspiration & materials (up to 5 URLs via useFieldArray; uploads: jpg/png/webp/avif/pdf, ≤10 files, ≤15MB each, ≤60MB total)
6. Budget/timing/review (summary + "Submit My Website Brief")

## Security
- Validate step before advancing (`methods.trigger`). Draft to localStorage excluding files.
- Multipart submit via FormData (don't set Content-Type). Validate payload before storing files.
- Server: allow-list types, enforce sizes, sanitize filenames, store in private R2 (`PROJECT_UPLOADS`), persist only keys/metadata, escape all user values in email HTML.

## Acceptance
- Required fields block continuation; template preselect works; files validated client+server; build passes.

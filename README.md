# Pilk.ai Media — Immersive Web Design Website

A production-foundation, App-Router Next.js site that doubles as Pilk.ai Media's portfolio piece: cinematic WebGL hero, a scroll-driven 3D template helix, a filterable template catalog, a real-estate campaign page, and a fully validated lead system. Palette: white / dark purple / black.

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

Runs with **zero third-party credentials** — the lead form works in dev (submissions log to the server console).

## Verify (run these locally — a full build needs the dep tree installed)

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # next lint
npm run build         # production build
npm start             # serve the production build
```

> Note: the build was authored and statically checked (all imports resolve, core Zod + helix logic unit-verified), but `next build` itself must be run on your machine — the build host here couldn't install the full Next + Three.js dependency tree. If `npm run build` surfaces anything, it'll be a quick fix; everything is structured cleanly.

## Edit content without touching components

| What | File |
|---|---|
| Brand, contact, nav, hero/positioning/process copy | `src/content/site.ts` |
| Pricing & packages | `src/content/packages.ts` |
| Templates (catalog + helix + detail) | `src/content/templates.ts` |
| Featured work / case studies | `src/content/projects.ts` |
| FAQ | `src/content/faq.ts` |
| Feature flags (Lab, sound, iframes) | `src/lib/features.ts` |
| Integrations / env | `.env.example` → `.env.local` |

**Contact details in `site.ts` are placeholders** (`hello@pilk.ai`, etc.) — replace before launch.

## Template & project previews

Previews render as **procedural CSS "faux-browser" mockups** — no image assets required, so the site looks alive immediately. To use real screenshots/video, drop files in `public/templates/[slug]/` and set the `preview.desktop` / `preview.mobile` / `preview.video` paths in `src/content/templates.ts`. The faux mock auto-hides when a real image is provided.

## Integrations (all optional, app runs without them)

Set in `.env.local`:

- **Supabase** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — lead storage. Create a `leads` table. Without it, leads log to console.
- **Resend** (`RESEND_API_KEY`, `LEADS_FROM_EMAIL`, `LEADS_NOTIFICATION_EMAIL`) — internal + prospect confirmation emails.
- **CRM** (`CRM_WEBHOOK_URL`) — POSTs each lead as JSON.
- **Analytics** (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) — events fire through `src/lib/analytics.ts`.

## Accessibility & performance

- Reduced-motion: no scroll hijack, no scrubbed camera, content immediately usable.
- WebGL degrades by device capability (`src/hooks/useDeviceCapability.ts`); low-end / no-WebGL → static fallback. Single persistent canvas, lazy-loaded, error-boundaried.
- Helix is pinned on desktop, a simple snap gallery on mobile (no scroll traps).
- Custom cursor disabled on touch/coarse/reduced-motion. Keyboard-accessible nav, ESC-dismissible modals, server-validated forms.

## Local development & preview

```bash
npm install
npm run dev      # Next frontend only — /api/leads does NOT run here
npm run build    # static export to out/
npm run preview  # npx wrangler pages dev out — runs the REAL Cloudflare build + functions
```

- `npm run dev` is for fast UI work. The contact form's `/api/leads` is a Cloudflare Pages Function and will **not** behave the same under plain `next dev` — use `npm run preview` to test it.
- Production output directory is `out`.

## Deploy (Cloudflare Pages)

Connect the GitHub repo in the Cloudflare dashboard with:

- **Framework preset:** `None`
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Settings → Functions → Compatibility flags:** `nodejs_compat` (Production + Preview)
- **Settings → Variables:** `NODE_VERSION = 22`, plus any of the optional env vars above.

### Cloudflare bindings (dashboard, not env vars)
- **R2 bucket binding `PROJECT_UPLOADS`** — create a private R2 bucket and bind it under
  Settings → Functions → R2 bucket bindings. Required only for brief file uploads; text-only
  briefs work without it.

### Project brief uploads
The Start-a-Project wizard submits as multipart form data to `/api/leads`. Files are validated
(images + PDF, ≤10 files, ≤15 MB each, ≤60 MB total), stored in the private `PROJECT_UPLOADS`
bucket, and only their keys/metadata are persisted — no public file URLs.

## Docs

See `docs/` — `repository-audit.md`, `creative-direction.md`, `reference-analysis.md`, `motion-language.md`, `build-plan.md` (phase status + what remains).

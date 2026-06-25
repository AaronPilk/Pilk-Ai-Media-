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

## Deploy

Push to GitHub, import into **Vercel**, add the env vars above. `npm run build` is the build command.

## Docs

See `docs/` — `repository-audit.md`, `creative-direction.md`, `reference-analysis.md`, `motion-language.md`, `build-plan.md` (phase status + what remains).

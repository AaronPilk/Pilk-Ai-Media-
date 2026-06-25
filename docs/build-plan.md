# Build Plan — Pilk.ai Media

## Status legend
✅ done this pass · 🟡 functional foundation, iterate · ⬜ future pass

## Phase 0 — Audit ✅
Workspace empty, npm runtime, no Codex/media. See `repository-audit.md`.

## Phase 1 — Foundation ✅
Next.js App Router, TS, Tailwind v4, tokens/typography, Header/Footer/MobileMenu, Button/Container/SectionLabel, metadata, content config, all routes.

## Phase 2 — Motion foundation ✅
Lenis SmoothScroll provider, GSAP/ScrollTrigger setup, reveal utility, custom cursor, reduced-motion handling, cleanup.

## Phase 3 — WebGL hero 🟡
Persistent R3F canvas, transmission "digital material" reacting to pointer+scroll, capability detection, reduced-motion + no-WebGL fallback, lazy-loaded, error boundary. Iterate: custom shaders, browser-frame geometry, camera paths.

## Phase 4 — Portfolio + template helix 🟡
Template data, DOM-3D helix (GSAP, pinned desktop / snap mobile), catalog + filters, template detail routes, faux-browser previews, preview modal. Iterate: real screenshots/video, drag.

## Phase 5 — Sales content ✅
Positioning, Capabilities, Process, Pricing, FAQ, FinalCTA, `/real-estate` campaign page with template preselect + UTM passthrough.

## Phase 6 — Lead system ✅
RHF+Zod form, conditional fields, UTM/click-id capture, `/api/leads` server validation, dev fallback, success/error, analytics events, honeypot.

## Phase 7 — Asset import ⬜
Capture script, screenshots/video, real case studies, media optimization.

## Phase 8 — Performance + QA ⬜
Lighthouse, bundle analysis, WebGL memory, device/browser/form/a11y tests, Playwright/Vitest.

## Phase 9 — Optional Lab ⬜
"Build Your First Impression" drag experience at `/lab` (flag off). Only after sales site is converting.

## Editable knobs (no component changes needed)
- Brand/contact/nav/copy: `src/content/site.ts`
- Pricing/packages: `src/content/packages.ts`
- Templates: `src/content/templates.ts`
- FAQ: `src/content/faq.ts`
- Projects/case studies: `src/content/projects.ts`
- Feature flags: `src/lib/features.ts`
- Env/integrations: `.env.example`

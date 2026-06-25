# Repository Audit — Pilk.ai Media

_Date: 2026-06-25_

## Environment
- **Workspace:** empty (clean slate — no prior repo, no `package.json`, no git history).
- **Runtime:** Node v22.22.3, npm 10.9.8.
- **Package manager:** `pnpm` and `yarn` are **not** installed in this environment. Build was scaffolded with **npm** (lockfile: `package-lock.json`). The directive targets pnpm; the project is pnpm-compatible — run `corepack enable pnpm` locally if you prefer pnpm. All scripts work identically under npm.
- **Codex CLI:** not available in this environment. All implementation was done directly (no delegation). The `docs/codex/` task files described in the directive are optional and can be added later if you wire up Codex on your own machine.
- **Media inventory:** none found. No logos, fonts (beyond Google Fonts), screenshots, videos, or client project folders were present. Template previews are rendered as **procedural CSS "faux-browser" mockups** (zero binary assets) so the portfolio looks alive immediately and can be swapped for real screenshots/video later without code changes.

## Decisions locked with the user
- **Brand:** Pilk.ai Media — domain **pilk.ai**.
- **Accent palette:** white / **dark purple** / black.
- Contact email/phone are clearly-marked placeholders in `src/content/site.ts` (`hello@pilk.ai`, etc.) — replace before launch.

## What was built this pass
Phases 1–6 at production-foundation quality:
- Next.js App Router + TypeScript + Tailwind v4 + design tokens.
- Centralized content layer (`src/content/*`) — brand, pricing, packages, templates, FAQ, projects.
- Layout system: Header, MobileMenu, Footer, custom Cursor, Lenis SmoothScroll, page reveal motion.
- WebGL hero (R3F transmission material) with capability detection, reduced-motion + no-WebGL fallback, single persistent canvas.
- Template Helix (DOM 3D + GSAP ScrollTrigger), Template Catalog with filters, template detail routes.
- Sales content: Positioning, Capabilities, Process, Pricing, FAQ, Final CTA, dedicated `/real-estate` campaign page.
- Lead system: RHF + Zod form, conditional fields, full UTM/click-id capture, server-validated `/api/leads` route with dev fallback (runs with zero third-party credentials).
- SEO: per-route metadata, JSON-LD (Organization / ProfessionalService / FAQPage), sitemap, robots.

## What remains (future passes)
- Art-directed WebGL: custom liquid/particle shaders, browser-frame geometry, scroll-driven camera paths (starter shaders included in `src/shaders/`, not yet wired into a custom material).
- Real screenshots/video for templates + real client case studies in `/work`.
- Wiring Supabase + Resend + CRM webhook (adapters stubbed, env documented).
- Optional interactive Lab (`/lab` exists behind a feature flag, currently a placeholder).
- Playwright/Vitest test suites + capture-projects script.

## Required before launch (assets/credentials)
- Final logo/wordmark (currently a CSS wordmark).
- Real contact details (email, phone, address, social).
- Template screenshots + short muted preview videos, or live URLs to capture.
- Supabase URL + service-role key, Resend API key + from/notification emails, optional CRM webhook, optional Upstash for rate limiting.
- GA4 + Meta Pixel IDs.

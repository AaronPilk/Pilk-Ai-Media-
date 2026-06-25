# Task 11 — Routing, navigation, hero headline

## Objective
Make every CTA navigate on the deployed Cloudflare Pages build, remove the Templates nav item, and render the hero headline as controlled lines.

## May modify
- `next.config.mjs`
- `src/content/site.ts`
- `src/components/sections/Hero.tsx`
- `src/app/globals.css`
- `e2e/*` (tests)

## Must not modify
- Lead API, orb, process, wizard.

## Requirements
- `next.config.mjs`: `output: "export"`, `trailingSlash: true`, `reactStrictMode: true`, `images.unoptimized: true`. Remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`; fix real errors instead.
- Remove `{ label: "Templates", href: "/templates" }` from `site.nav`. Keep `/templates` + `/templates/[slug]` routes.
- Hero headline renders from `site.hero.headlineLines` (`["Websites", "people remember."]`), `aria-label` on `<h1>`, each line `aria-hidden`, no word clipping at 390/430/768/1024/1440/1920.

## Acceptance
- `npm run typecheck && npm run lint && npm run build` pass.
- `out/contact/index.html`, `out/process/index.html`, etc. exist.
- `npx wrangler pages dev out` → all CTAs navigate.

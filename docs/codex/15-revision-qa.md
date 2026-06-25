# Task 15 — Revision QA

## Objective
Verify the revision end-to-end on the exported Cloudflare build, not just `next dev`.

## Commands
```bash
npm run format
npm run typecheck
npm run lint
npm run build
npx wrangler pages dev out
```

## Checks
- Nav: Templates absent (desktop + mobile); `/templates/[slug]` works; Start a Project → `/contact/`; Process → `/process/`; back nav works.
- Hero: full headline at 390 + 1440, no clipping; CTAs clickable; orb ignores pointer events; orb gone after hero, reassembles on scroll up; reduced-motion static.
- Process: 7 days in order; desktop advances on scroll; mobile not pinned; disclaimer visible; CTA works.
- Wizard: required fields block; back/continue; `?template=` preselect; template + palette + custom colors; inspiration add/remove; invalid URL + invalid/oversized file rejected; review accurate; multipart submit; success clears draft; server rejects malformed payloads + disallowed types.

## Review focus (read-only Codex pass)
Static-export routing, lifecycle/GSAP/R3F cleanup, shader correctness, reverse-scroll orb, reduced-motion, form validation, multipart + R2 security, email HTML injection, file enforcement, a11y, TS correctness, 7-day overpromise.

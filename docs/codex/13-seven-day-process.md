# Task 13 — Seven-day process timeline

## Objective
A scroll-driven 7-day timeline (Day 1 kickoff → Day 7 launch) with deliverables and an honest scope disclaimer. Same component on homepage and `/process`.

## May modify
- `src/content/site.ts` (process data: eyebrow, headline, sub, `timeline[]` with day/title/body/deliverable, disclaimer)
- `src/components/sections/ProcessTimeline.tsx` (new)
- `src/components/sections/Process.tsx` (delegate to ProcessTimeline)
- `src/components/sections/Timeline.tsx` (delegate to ProcessTimeline)
- `src/app/process/page.tsx`

## Requirements
- Desktop: sticky heading, large day indicator, vertical progress rail that fills on scroll, stacked cards with active scaling/dimming via GSAP ScrollTrigger pinned timeline. Distance `+=${steps.length * 520}`. Only `setState` when active index changes.
- Mobile (<900px): no pin — continuous rail, stacked cards revealing on scroll, no horizontal overflow.
- Visible disclaimer: 7 days applies to standard/template projects after content+access+approvals; large custom builds get a custom schedule.

## Acceptance
- 7 days render in order, disclaimer visible, no duplicate intro on `/process`, build passes.

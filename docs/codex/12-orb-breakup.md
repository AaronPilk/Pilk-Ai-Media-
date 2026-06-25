# Task 12 — Dynamic orb + reversible breakup

## Objective
The hero orb floats and deforms, reacts to pointer, gains energy mid-hero, destabilizes, dissolves into particles that leave the viewport, and reassembles when scrolling up. Scroll position is the source of truth (reversible, not a one-time animation).

## May modify
- `src/stores/experience-store.ts` (add `heroProgress` / `setHeroProgress`)
- `src/components/canvas/SceneCanvas.tsx` (compute hero rect progress)
- `src/components/canvas/CanvasExperience.tsx`
- `src/components/canvas/orb/*` (new: DynamicOrb, OrbCore, OrbParticles)
- `src/components/sections/Hero.tsx` (`id="hero" data-scene="hero"`)

## Must not modify
- Process, wizard, lead API.

## Requirements
- One mesh (OrbCore) + one `THREE.Points` (OrbParticles). No hundreds of meshes. Controlled geometry resolution.
- `heroProgress` derived from the hero element's bounding rect (not whole-document progress).
- Core opacity fades 0.48→0.82; particles emerge from ~0.52 (no empty gap). Breakup damped toward a smoothstep of heroProgress so it reverses.
- Reduced-motion / low capability → static fallback (already handled in SceneCanvas).

## Acceptance
- No second canvas. Orb gone after hero, reassembles scrolling up. Build passes.

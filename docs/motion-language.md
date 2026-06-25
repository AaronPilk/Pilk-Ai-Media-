# Motion Language — Pilk.ai Media

One motion system, not scattered animations. Engine: **GSAP + ScrollTrigger** for scroll/timeline, **Lenis** for smooth scroll, **R3F** for WebGL only. No competing libraries.

## Categories
1. **Reveal** — headings, copy, metadata, buttons. Entrance only.
2. **Transform** — one section becoming the next.
3. **Spatial** — previews, browser frames, floating objects, project cards, WebGL geometry.
4. **Feedback** — buttons, form states, nav, hover, drag, filters.
5. **Ambient** — particles, material breathing, lighting, slow drift.

## Global tokens
- Eases: `--ease-out-expo cubic-bezier(0.16,1,0.3,1)`, `--ease-smooth cubic-bezier(0.65,0,0.35,1)`.
- Reveal duration: 0.6–0.9s. Scrub sections: tie to scroll, `scrub: 1`.
- Stagger: 0.06–0.1s.

## Spec table (every major animation)
| Animation | Trigger | Start → End | Timing/Ease | Mobile | Reduced-motion | Cost |
|---|---|---|---|---|---|---|
| Preloader collapse | load | wireframe browser → viewport | 1.2s expo, max ~1.8s, skippable | shorter | skip, show content | low |
| Hero headline layer split | scroll | y0/op1 → y-48%/op0 | scrub | reduced travel | static | low |
| Hero material travel | scroll | float → toward camera | scrub (R3F damp) | video/static fallback | hidden | med (GPU) |
| Positioning fragments → browser | enter | scattered → locked | scrub, expo | simple fade-in | static | low |
| Featured work spatial reveal | enter | depth/scale stagger | 0.8s expo stagger | vertical cards | fade | low |
| Template helix rotate | pinned scroll | helix transform per card | scrub 1, pinned | **snap gallery, no pin** | static list | med |
| Process stage morph | pinned scroll | particles → launch | scrub | stacked steps | static | med |
| Reveal (generic) | enter (once) | y16/op0 → y0/op1 | 0.7s expo | same | instant show | low |
| Magnetic button | pointer | translate toward cursor | damp | disabled | disabled | low |
| Custom cursor | pointer | follow + state | damp | hidden | hidden | low |

## Rules
- Always `gsap.context()` + `return () => ctx.revert()`; kill ScrollTriggers on route change.
- `prefers-reduced-motion`: no smooth-scroll hijack, no scrubbed camera, no large parallax — opacity only, all content immediately usable.
- Mobile: shorten or remove pins; never trap scroll.
- Mutate Three objects inside `useFrame`; never setState per frame.
- Prefer a few exceptional interactions over many average ones.

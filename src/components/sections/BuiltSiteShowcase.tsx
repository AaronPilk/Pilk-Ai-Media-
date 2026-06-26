"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { builtSites } from "@/content/built-sites";
import { getHelixTransform } from "@/lib/get-helix-transform";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BuiltSiteCard } from "@/components/showcase/BuiltSiteCard";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const COPY =
  "A rotating look at high-end websites built to sell, capture leads, and make the first impression impossible to ignore.";

export function BuiltSiteShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const applyTransforms = (progressIndex: number) => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const t = getHelixTransform(index, progressIndex);
        gsap.set(card, {
          x: t.x,
          y: t.y,
          z: t.z,
          rotateX: t.rotateX,
          rotateY: t.rotateY,
          scale: t.scale,
          opacity: t.opacity,
        });
      });
    };

    const media = gsap.matchMedia();
    // Same rotating motion on every screen size.
    media.add("(prefers-reduced-motion: no-preference)", () => {
      applyTransforms(0);
      const state = { p: 0 };
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${builtSites.length * 900}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progressIndex = self.progress * (builtSites.length - 1);
            applyTransforms(progressIndex);
            setActive((c) => {
              const next = Math.round(progressIndex);
              return c === next ? c : next;
            });
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => media.revert();
  }, []);

  const activeSite = builtSites[active] ?? builtSites[0];

  return (
    <>
      {/* Rotating showcase (hidden for reduced-motion) */}
      <section
        ref={sectionRef}
        data-scene="showcase"
        className="template-helix motion-only relative z-10 block"
        style={{ background: "var(--surface)" }}
        aria-label="Website showcase"
      >
        <div className="container-page absolute left-0 right-0 top-0 z-[5] pt-28">
          <SectionLabel index="02">Recent Builds</SectionLabel>
        </div>

        <div className="template-helix__stage">
          {builtSites.map((siteItem, index) => (
            <div
              key={siteItem.slug}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="template-helix__card"
            >
              <BuiltSiteCard site={siteItem} active={index === active} />
            </div>
          ))}
        </div>

        <div className="template-helix__hud max-w-sm">
          <span className="eyebrow opacity-70">
            {activeSite.label} · {activeSite.industry}
          </span>
          <h3 className="mt-2 font-display text-3xl font-semibold">Website showcase.</h3>
          <p className="mt-2 text-sm text-muted">{activeSite.summary}</p>
        </div>
      </section>

      {/* Reduced-motion fallback gallery */}
      <section className="section rm-only relative z-10" style={{ background: "var(--surface)" }}>
        <Container>
          <SectionLabel index="02">Recent Builds</SectionLabel>
          <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Website showcase.
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted">{COPY}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {builtSites.map((siteItem) => (
              <div key={siteItem.slug}>
                <div className="aspect-[16/10]">
                  <BuiltSiteCard site={siteItem} active />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-medium">{siteItem.name}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted">
                    {siteItem.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

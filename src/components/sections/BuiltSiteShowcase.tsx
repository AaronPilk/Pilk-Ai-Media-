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
  const galleryRef = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const media = gsap.matchMedia();

    // DESKTOP — pinned rotating helix
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
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

    // MOBILE — non-pinned gallery, cards scale/fade in as they enter
    media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = galleryRef.current.filter((c): c is HTMLDivElement => c !== null);
      // Scroll-scrubbed: each site slides up + scales continuously as it moves through the screen.
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 110, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 96%",
              end: "top 38%",
              scrub: true,
            },
          }
        );
      });
    });

    return () => media.revert();
  }, []);

  const activeSite = builtSites[active] ?? builtSites[0];

  return (
    <>
      {/* Desktop: rotating helix */}
      <section
        ref={sectionRef}
        data-scene="showcase"
        className="template-helix showcase-helix relative z-10"
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

      {/* Mobile + reduced-motion: animated gallery */}
      <section className="section showcase-gallery relative z-10" style={{ background: "var(--surface)" }}>
        <Container>
          <SectionLabel index="02">Recent Builds</SectionLabel>
          <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Website showcase.
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted">{COPY}</p>
          <div className="mt-10 flex flex-col gap-10">
            {builtSites.map((siteItem, index) => (
              <div
                key={siteItem.slug}
                ref={(el) => {
                  galleryRef.current[index] = el;
                }}
              >
                <div className="aspect-[16/10]">
                  <BuiltSiteCard site={siteItem} active />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-medium">{siteItem.name}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted">
                    {siteItem.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{siteItem.summary}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

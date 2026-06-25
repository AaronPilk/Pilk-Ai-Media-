"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { templates } from "@/content/templates";
import { getHelixTransform } from "@/lib/get-helix-transform";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

gsap.registerPlugin(ScrollTrigger);

export function TemplateHelix() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
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

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      applyTransforms(0);
      const state = { p: 0 };
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${templates.length * 900}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progressIndex = self.progress * (templates.length - 1);
            applyTransforms(progressIndex);
            setActive(Math.round(progressIndex));
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const activeTpl = templates[active] ?? templates[0];

  return (
    <>
      {/* Desktop / tablet: 3D helix */}
      <section
        ref={sectionRef}
        className="template-helix relative z-10 hidden md:block"
        style={{ background: "var(--surface)" }}
        aria-label="Template showcase"
      >
        <div className="container-page absolute left-0 right-0 top-0 z-[5] pt-28">
          <SectionLabel index="03">Template Showcase</SectionLabel>
        </div>

        <div className="template-helix__stage">
          {templates.map((tpl, index) => (
            <Link
              key={tpl.slug}
              href={`/templates/${tpl.slug}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="template-helix__card"
              data-cursor="open"
              data-cursor-label="Open"
            >
              <FauxBrowser accent={tpl.accent} url={`${tpl.slug}.pilk.ai`} />
            </Link>
          ))}
        </div>

        <div className="template-helix__hud">
          <span className="eyebrow opacity-70">{activeTpl.label}</span>
          <h3 className="mt-2 font-display text-3xl font-semibold">{activeTpl.name}</h3>
          <p className="mt-1 text-sm text-muted">
            {activeTpl.price > 0
              ? `Starting at $${formatPrice(activeTpl.price)}`
              : "Scope-based pricing"}
          </p>
        </div>
      </section>

      {/* Mobile: simple snap gallery */}
      <section className="section relative z-10 md:hidden" style={{ background: "var(--surface)" }}>
        <Container>
          <SectionLabel index="03">Template Showcase</SectionLabel>
          <div className="helix-mobile mt-10">
            {templates.map((tpl) => (
              <Link
                key={tpl.slug}
                href={`/templates/${tpl.slug}`}
                className="helix-mobile__card block"
              >
                <FauxBrowser accent={tpl.accent} url={`${tpl.slug}.pilk.ai`} />
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-medium">{tpl.name}</span>
                  <span className="text-sm text-muted">
                    {tpl.price > 0 ? `$${formatPrice(tpl.price)}` : "Custom"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

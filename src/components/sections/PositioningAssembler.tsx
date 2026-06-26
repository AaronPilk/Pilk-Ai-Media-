"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const cardEntrances = [
  { xPercent: -120, yPercent: -25, rotate: -8 },
  { xPercent: 0, yPercent: -120, rotate: 4 },
  { xPercent: 120, yPercent: -20, rotate: 8 },
  { xPercent: -110, yPercent: 80, rotate: 7 },
  { xPercent: 0, yPercent: 120, rotate: -5 },
  { xPercent: 115, yPercent: 75, rotate: -7 },
];

export function PositioningAssembler() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = cardsRef.current.filter(
        (c): c is HTMLDivElement => c !== null
      );

      gsap.set(headingRef.current, { opacity: 0, y: 40 });

      cards.forEach((card, index) => {
        const entrance = cardEntrances[index] ?? cardEntrances[0];
        gsap.set(card, {
          opacity: 0,
          xPercent: entrance.xPercent,
          yPercent: entrance.yPercent,
          rotate: entrance.rotate,
          scale: 0.88,
          transformOrigin: "center center",
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "bottom 58%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0)
        .to(
          cards,
          {
            opacity: 1,
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            stagger: { amount: 0.22, from: "edges" },
            ease: "power3.out",
            duration: 0.75,
          },
          0.16
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    media.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      const targets: HTMLElement[] = [];
      if (headingRef.current) targets.push(headingRef.current);
      cardsRef.current.forEach((card) => {
        if (card) targets.push(card);
      });
      gsap.set(targets, { opacity: 1, xPercent: 0, yPercent: 0, rotate: 0, scale: 1 });
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene="positioning"
      className="section positioning-assembler relative z-10 overflow-hidden"
    >
      <Container>
        <SectionLabel index="01">Positioning</SectionLabel>

        <h2
          ref={headingRef}
          className="mt-6 max-w-[16ch] text-balance"
          style={{ fontSize: "var(--text-2xl)" }}
        >
          {site.positioning.headline}
        </h2>

        <div className="positioning-grid mt-16 grid overflow-hidden rounded-xl border border-line bg-[rgba(13,13,18,0.86)] backdrop-blur-xl md:grid-cols-3">
          {site.positioning.points.map((point, index) => (
            <div
              key={point.title}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              className="positioning-card min-h-[180px] border-line p-8 md:border-b md:border-r"
            >
              <span className="text-xs uppercase tracking-[0.22em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-7 text-xl font-semibold">{point.title}</h3>
              <p className="mt-3 text-sm text-muted">{point.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

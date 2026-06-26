"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { processTimeline, processDisclaimer } from "@/content/process";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline({ standalone = false }: { standalone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const setActive = (next: number) =>
      setActiveIndex((current) => (current === next ? current : next));

    const media = gsap.matchMedia();

    // Same pinned, stacked motion on every screen size.
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null);
      if (cards.length === 0) return;

      // Stack the cards on top of each other (animation layout).
      gsap.set(cards, { position: "absolute", top: "50%", left: 0, right: 0 });

      const applyCards = (rawIndex: number) => {
        cards.forEach((card, index) => {
          const distance = index - rawIndex;
          gsap.set(card, {
            yPercent: -50,
            y: distance * 130,
            opacity: Math.max(0.12, 1 - Math.abs(distance) * 0.58),
            scale: Math.max(0.9, 1 - Math.abs(distance) * 0.065),
            rotateX: distance * -3,
            zIndex: 20 - Math.abs(Math.round(distance)),
          });
        });
      };

      applyCards(0);
      gsap.set(railRef.current, { scaleY: 0, transformOrigin: "top" });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${processTimeline.length * 520}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const rawIndex = self.progress * (cards.length - 1);
          setActive(Math.round(rawIndex));
          applyCards(rawIndex);
          gsap.set(railRef.current, { scaleY: self.progress, transformOrigin: "top" });
        },
      });

      return () => trigger.kill();
    });

    // Reduced motion: plain readable stack, full rail.
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(cardsRef.current.filter((c): c is HTMLDivElement => c !== null), {
        clearProps: "all",
        opacity: 1,
      });
      gsap.set(railRef.current, { scaleY: 1 });
    });

    return () => media.revert();
  }, []);

  const active = processTimeline[activeIndex] ?? processTimeline[0];

  return (
    <section
      ref={sectionRef}
      data-scene="process"
      className="process-timeline relative z-10 overflow-hidden"
    >
      <Container className="grid min-h-screen items-center gap-12 py-24 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <SectionLabel index={standalone ? undefined : "05"}>The Seven-Day Build</SectionLabel>

          <h2 className="mt-6 max-w-[13ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            From first conversation to live website.
          </h2>

          <p className="mt-6 max-w-md text-muted">
            A focused build process with clear decisions, fast communication, and no months of agency
            limbo.
          </p>

          <div className="mt-10 flex items-end gap-4">
            <span className="font-display text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-none text-accent">
              {activeIndex + 1}
            </span>
            <div className="pb-3">
              <p className="text-sm uppercase tracking-[0.22em] text-muted">of 7 days</p>
              <p className="mt-1 font-medium">{active.day}</p>
            </div>
          </div>

          <p className="mt-8 max-w-md text-xs text-muted">{processDisclaimer}</p>
        </div>

        <div className="relative ml-8 min-h-[64vh] [perspective:1200px] md:ml-10 md:min-h-[560px]">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-accent"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {processTimeline.map((step, index) => (
            <div
              key={step.day}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              className="process-card relative mb-6 rounded-xl border border-line bg-[rgba(18,18,24,0.92)] p-6 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-8"
            >
              <span className="text-xs uppercase tracking-[0.22em] text-accent">{step.day}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold md:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-xl text-sm text-muted md:text-base">{step.body}</p>
              <div className="mt-5 border-t border-line pt-4 text-sm">
                <span className="text-muted">Deliverable:</span> <span>{step.deliverable}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

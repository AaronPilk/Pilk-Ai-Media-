"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const steps = site.process.timeline;

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const setActive = (next: number) =>
      setActiveIndex((current) => (current === next ? current : next));

    const media = gsap.matchMedia();

    // Desktop — pinned, stacked, scrubbed
    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = cardsRef.current.filter(
          (c): c is HTMLDivElement => c !== null
        );

        const applyCards = (rawIndex: number) => {
          cards.forEach((card, index) => {
            const distance = index - rawIndex;
            gsap.set(card, {
              yPercent: -50,
              y: distance * 120,
              opacity: Math.max(0.1, 1 - Math.abs(distance) * 0.55),
              scale: Math.max(0.9, 1 - Math.abs(distance) * 0.055),
              rotateX: distance * -3,
              zIndex: 100 - Math.round(Math.abs(distance) * 10),
            });
          });
        };

        // Apply the initial stacked state so there's no flash before first scroll.
        applyCards(0);
        gsap.set(rail, { scaleY: 0, transformOrigin: "top" });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${steps.length * 520}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawIndex = self.progress * (steps.length - 1);
            setActive(Math.round(rawIndex));
            applyCards(rawIndex);
            gsap.set(rail, { scaleY: self.progress, transformOrigin: "top" });
          },
        });

        return () => trigger.kill();
      }
    );

    // Mobile — normal flow, reveal on scroll, rail fills with scroll
    media.add("(max-width: 899px)", () => {
      const cards = cardsRef.current.filter(
        (c): c is HTMLDivElement => c !== null
      );
      cards.forEach((c) => c.classList.add("reveal"));

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              const idx = cards.indexOf(entry.target as HTMLDivElement);
              if (idx >= 0) setActive(idx);
            }
          });
        },
        { threshold: 0.4, rootMargin: "0px 0px -20% 0px" }
      );
      cards.forEach((c) => io.observe(c));

      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect();
          const total = rect.height + window.innerHeight * 0.4;
          const progress = Math.min(
            1,
            Math.max(0, (window.innerHeight * 0.6 - rect.top) / total)
          );
          rail.style.transform = `scaleY(${progress})`;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(raf);
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene="process"
      className="process-timeline relative z-10 overflow-hidden lg:min-h-screen"
    >
      <Container className="grid items-center gap-12 py-24 lg:min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel index="06">{site.process.eyebrow}</SectionLabel>
          <h2 className="mt-6 max-w-[14ch]" style={{ fontSize: "var(--text-2xl)" }}>
            {site.process.headline}
          </h2>
          <p className="mt-6 max-w-md text-muted">{site.process.sub}</p>

          <div className="mt-12 flex items-baseline gap-3">
            <span className="font-display text-7xl font-semibold text-accent">
              {activeIndex + 1}
            </span>
            <span className="text-sm uppercase tracking-[0.2em] text-muted">
              of 7 days
            </span>
          </div>

          <p className="mt-10 max-w-md text-xs text-muted">
            {site.process.disclaimer}
          </p>
        </div>

        <div className="relative">
          {/* progress rail */}
          <div className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-accent"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="ml-8 flex flex-col gap-6 lg:ml-10 lg:block lg:min-h-[520px] lg:[perspective:1200px]">
            {steps.map((step, index) => (
              <div
                key={step.day}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="relative rounded-xl border border-line bg-surface-2 p-7 transition-[opacity,transform] duration-700 ease-expo lg:absolute lg:inset-x-0 lg:top-1/2 lg:p-8"
              >
                <span className="eyebrow text-accent">{step.day}</span>
                <h3 className="mt-3 text-2xl md:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xl text-muted">{step.body}</p>
                <div className="mt-6 border-t border-line pt-4 text-sm">
                  <span className="text-muted">Deliverable:</span>{" "}
                  <span>{step.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

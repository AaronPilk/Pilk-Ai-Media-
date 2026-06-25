"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    // Reveal each step as it enters the viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    itemsRef.current.forEach((el) => el && io.observe(el));

    // Draw the progress line as the section scrolls through the viewport
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh * 0.4;
        const progress = Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / total));
        line.style.transform = `scaleY(${progress})`;
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
  }, []);

  return (
    <section className="section relative z-10">
      <Container>
        <SectionLabel index="01">{site.process.eyebrow}</SectionLabel>
        <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          {site.process.headline}
        </h2>
        {"sub" in site.process && site.process.sub && (
          <p className="mt-6 max-w-xl text-lg text-muted">{site.process.sub}</p>
        )}

        <div ref={containerRef} className="relative mt-20 pl-12 md:pl-16">
          {/* Track + animated fill */}
          <div className="absolute bottom-0 left-[19px] top-2 w-px bg-line md:left-[23px]">
            <div
              ref={lineRef}
              className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col gap-14">
            {site.process.steps.map((step, i) => (
              <div
                key={step.n}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className="reveal relative transition-[opacity,transform] duration-700 ease-expo"
              >
                {/* Node */}
                <span className="absolute -left-12 top-1 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-xs text-accent md:-left-16">
                  {step.n}
                </span>
                <span className="eyebrow text-accent">{step.day}</span>
                <h3 className="mt-2 text-2xl font-medium md:text-3xl">{step.title}</h3>
                <p className="mt-2 max-w-xl text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

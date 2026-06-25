"use client";

import { createElement, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Word-by-word reveal. Falls back to instant for reduced motion. */
export function SplitText({
  text,
  className,
  as = "span",
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");

    if (reduced) {
      targets.forEach((w) => {
        w.style.transform = "none";
        w.style.opacity = "1";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll<HTMLElement>("[data-word]").forEach((w, i) => {
            w.style.transitionDelay = `${i * 55}ms`;
            w.style.transform = "none";
            w.style.opacity = "1";
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const children = words.map((word, i) =>
    createElement(
      "span",
      {
        key: `${word}-${i}`,
        style: { display: "inline-block", overflow: "hidden", verticalAlign: "top" },
      },
      createElement(
        "span",
        {
          "data-word": true,
          style: {
            display: "inline-block",
            transform: "translateY(105%)",
            opacity: 0,
            transition:
              "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
          },
        },
        word
      ),
      i < words.length - 1 ? " " : ""
    )
  );

  return createElement(as, { ref, className: cn(className) }, children);
}

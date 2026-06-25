"use client";

import { createElement, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Lightweight reveal-on-scroll using IntersectionObserver. CSS handles reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return createElement(
    as,
    {
      ref,
      className: cn(
        "reveal transition-[opacity,transform] duration-700 ease-expo",
        className
      ),
    },
    children
  );
}

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faq } from "@/content/faq";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section env-light relative z-10" id="faq">
      <Container>
        <SectionLabel index="08">FAQ</SectionLabel>
        <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          Questions, answered.
        </h2>

        <div className="mx-auto mt-12 max-w-3xl border-t border-line">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-lg font-medium">{item.q}</span>
                  {isOpen ? <Minus size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
                </button>
                <div
                  className="grid transition-all duration-400 ease-expo"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-sm text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

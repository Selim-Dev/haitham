"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionTitle
          eyebrow="أسئلة شائعة"
          title={COPY.faq.title}
          subtitle={COPY.faq.subtitle}
        />

        <div className="mt-12 flex flex-col gap-3">
          {COPY.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-2xl border bg-card transition-colors",
                  isOpen
                    ? "border-primary/40 bg-elevated"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span className="font-display text-base font-bold text-foreground sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full border border-[var(--color-border-strong)] bg-surface transition-transform duration-300",
                      isOpen && "rotate-45 border-primary/40 text-primary",
                    )}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
                {/* CSS-only collapse: grid-template-rows animates from 0fr to 1fr.
                    No DOM measurement, no AnimatePresence, no layout thrash. */}
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
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

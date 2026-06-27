"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accordion FAQ for the offer pages. Mirrors the homepage FaqSection collapse
 * (CSS grid-template-rows 0fr → 1fr, no layout thrash) but takes its items as
 * a prop so it can be reused with the offer copy.
 */
export function OfferFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="mt-10 flex flex-col gap-3">
      {items.map((item, i) => {
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
            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
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
  );
}

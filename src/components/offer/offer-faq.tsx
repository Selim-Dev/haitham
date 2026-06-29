"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accordion FAQ for the offer pages (light theme). CSS grid-template-rows
 * 0fr → 1fr collapse, no layout thrash.
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
              "rounded-2xl border bg-white transition-colors",
              isOpen
                ? "border-green-300 bg-green-50/50"
                : "border-neutral-200 hover:border-neutral-300",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
            >
              <span className="font-display text-base font-bold text-neutral-900 sm:text-lg">
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border border-neutral-300 bg-neutral-50 text-neutral-500 transition-transform duration-300",
                  isOpen && "rotate-45 border-green-400 bg-green-50 text-[#2d8541]",
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
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600">
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

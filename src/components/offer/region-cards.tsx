"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "egypt" | "international";

type RegionCard = {
  variant: Variant;
  href: string;
  flag: string;
  title: string;
  methods: string;
  cta: string;
  ring: string;
  glow: string;
  titleColor: string;
  button: string;
  sweep: string;
};

const CARDS: RegionCard[] = [
  {
    variant: "egypt",
    href: "/offer/egypt",
    flag: "🇪🇬",
    title: "أنا من مصر",
    methods: "فودافون كاش • انستاباي • تحويل حساب بنكي",
    cta: "اشتري من مصر",
    ring: "border-green-200 hover:border-[#4bbc63]/70",
    glow: "hover:shadow-[0_30px_80px_-28px_rgba(45,133,65,0.45)]",
    titleColor: "text-[#2d8541]",
    button:
      "bg-gradient-to-l from-[#3aa551] to-[#1f5d2e] text-white shadow-[0_10px_28px_-10px_rgba(45,133,65,0.55)]",
    sweep: "via-[#4bbc63]/10",
  },
  {
    variant: "international",
    href: "/offer/international",
    flag: "🌍",
    title: "أنا من خارج مصر",
    methods: "PayPal • STC Pay • برق • انجاز • تحويل بنكي • Crypto",
    cta: "اشتري من خارج مصر",
    ring: "border-violet-200 hover:border-violet-400",
    glow: "hover:shadow-[0_30px_80px_-28px_rgba(124,77,255,0.4)]",
    titleColor: "text-violet-700",
    button:
      "bg-gradient-to-l from-violet-600 to-indigo-700 text-white shadow-[0_10px_28px_-10px_rgba(124,77,255,0.5)]",
    sweep: "via-violet-400/10",
  },
];

export function RegionCards({
  recommended,
}: {
  recommended?: Variant | null;
}) {
  return (
    <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
      {CARDS.map((card) => (
        <Link
          key={card.variant}
          href={card.href}
          className={cn(
            "group relative flex flex-col items-center overflow-hidden rounded-3xl border bg-white p-8 text-center shadow-sm transition-all duration-300 ease-[var(--ease-out-expo)]",
            "hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4bbc63]/50",
            card.ring,
            card.glow,
          )}
        >
          {/* shimmer sweep on hover */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full",
              card.sweep,
            )}
          />

          {recommended === card.variant && (
            <span className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-[#2d8541]">
              <Sparkles className="size-3" />
              الأنسب لك
            </span>
          )}

          <span
            aria-hidden="true"
            className="mb-5 grid size-20 place-items-center rounded-2xl border border-neutral-200 bg-neutral-50 text-5xl shadow-inner transition-transform duration-300 group-hover:-translate-y-1"
          >
            {card.flag}
          </span>

          <h2
            className={cn(
              "font-display text-2xl font-extrabold tracking-tight",
              card.titleColor,
            )}
          >
            {card.title}
          </h2>

          <p className="mt-2 min-h-[3rem] max-w-[18rem] text-sm leading-relaxed text-neutral-600">
            {card.methods}
          </p>

          <span
            className={cn(
              "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-display text-base font-bold transition-transform duration-200 group-hover:scale-[1.02]",
              card.button,
            )}
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {card.cta}
          </span>
        </Link>
      ))}
    </div>
  );
}

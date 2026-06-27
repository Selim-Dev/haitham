"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-only sticky purchase bar. Slides up once the user scrolls past the
 * hero and hides again near the footer / when the checkout is in reach.
 */
export function StickyBuyBar({
  amountLabel,
  ltr,
  href = "#checkout",
}: {
  amountLabel: string;
  ltr?: boolean;
  href?: string;
}) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setShow(y > 640 && max - y > 360);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ease-[var(--ease-out-expo)] lg:hidden",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto max-w-2xl px-3 pb-3">
        <a
          href={href}
          className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-card/95 p-2.5 pe-4 shadow-[var(--shadow-red-glow-lg)] backdrop-blur-md transition-colors hover:border-primary/60"
        >
          <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-extrabold text-primary-foreground">
            اشترِ الآن
            <ArrowLeft className="size-4" />
          </span>
          <span className="flex flex-col text-end leading-tight">
            <span className="text-[10px] font-semibold text-muted-2">
              الباقة الكاملة
            </span>
            <span
              dir={ltr ? "ltr" : undefined}
              className="font-display text-lg font-black text-foreground"
            >
              {amountLabel}
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

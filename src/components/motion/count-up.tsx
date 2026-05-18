import { toArabicNumerals } from "@/lib/utils";

// Was a JS-driven number tween via framer-motion's `animate(value)`. That kept
// a motion subscription alive per stat and re-rendered the span every frame.
// Now renders the final value directly — no flicker, no work.

export function CountUp({
  to,
  format = (v: number) => toArabicNumerals(Math.round(v)),
  className,
}: {
  to: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  return <span className={className}>{format(to)}</span>;
}

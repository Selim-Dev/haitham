import * as React from "react";
import { cn } from "@/lib/utils";

// Seamless CSS marquee.
//
// Two identical copies of the item list rendered side by side. The keyframe
// translates the track from 0 → -50% of its own width, landing the start of
// copy #2 exactly where copy #1 began — visually identical, no reset visible.
//
// Spacing lives on each <li> (via gap-10 + pe-10), NOT as a parent `gap`.
// Putting it on the parent breaks the math: the gap between the two copies
// isn't accounted for by -50% and you get a one-gap snap each cycle.
//
// `dir="ltr"` on the track is critical. The page is RTL, so by default a
// w-max child overflows to the LEFT of its container (anchored on the right).
// translateX(-50%) would then push it further left — straight off-screen,
// leaving a visible empty gap until the animation loops. Forcing the track
// to LTR layout makes it overflow rightward, so translating left scrolls
// content into view. Each Arabic phrase still renders correctly inside its
// span because Unicode bidi handles character order regardless of dir.

export function Marquee({
  items,
  className,
  speed = 32,
  separator = "•",
}: {
  items: string[];
  className?: string;
  speed?: number;
  separator?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "[mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <div
        dir="ltr"
        className="flex w-max items-center py-4"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        <MarqueeRow items={items} separator={separator} />
        <MarqueeRow items={items} separator={separator} ariaHidden />
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  separator,
  ariaHidden,
}: {
  items: string[];
  separator: string;
  ariaHidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center gap-10 pe-10">
          <span className="font-display text-2xl font-extrabold tracking-tight text-foreground/80 sm:text-3xl">
            {item}
          </span>
          <span
            className="text-2xl text-primary/60 sm:text-3xl"
            aria-hidden="true"
          >
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );
}

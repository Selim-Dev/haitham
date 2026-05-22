"use client";

import * as React from "react";
import FastMarquee from "react-fast-marquee";
import { cn } from "@/lib/utils";

// Thin wrapper around react-fast-marquee.
//
// We tried two hand-rolled CSS marquees first: both ran into the same class
// of bugs. The math of "translateX(-50%) of a w-max child" depends on the
// content being exactly 2× the visible width AND the child being anchored on
// the correct edge. In an RTL document the child anchors on the right and
// translateX(-50%) drives it off-screen, leaving an empty band on every
// cycle. On iOS Safari, percentage-based transforms also occasionally
// sub-pixel, compounding the gap.
//
// `react-fast-marquee` solves both: it uses a ResizeObserver to measure the
// container and the item track, then duplicates the content as many times
// as needed (via `autoFill`) to guarantee the visible window is always
// filled. Animation is GPU-driven and pause-aware so it doesn't burn
// battery on iOS.
//
// IMPORTANT: we force `dir="ltr"` on the wrapper. The library is designed
// around LTR flex flow (first child on the left, translateX(-100%) scrolls
// content leftward). When the surrounding page is RTL, the flex children
// flow right-to-left and the library's autoFill math can't keep both halves
// of the visible window populated — you get content on one side and an
// empty band on the other (the exact symptom we kept hitting). Setting
// `dir="ltr"` on this wrapper normalizes the layout for the library while
// leaving every Arabic phrase inside each span to render correctly via
// Unicode bidi.
//
// We disable the library's built-in gradient and apply our own mask-image on
// the outer wrapper so the fade matches the rest of the design system.

export function Marquee({
  items,
  className,
  speed = 50,
  separator = "•",
}: {
  items: string[];
  className?: string;
  /** Pixels per second. Library default is 50; higher = faster. */
  speed?: number;
  separator?: string;
}) {
  return (
    <div
      dir="ltr"
      className={cn(
        "relative w-full overflow-hidden",
        "[mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <FastMarquee
        speed={speed}
        gradient={false}
        autoFill
        pauseOnHover={false}
        direction="left"
        className="py-4"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 pe-10"
          >
            <span className="font-display text-2xl font-extrabold tracking-tight text-foreground/80 sm:text-3xl">
              {item}
            </span>
            <span
              className="text-2xl text-primary/60 sm:text-3xl"
              aria-hidden="true"
            >
              {separator}
            </span>
          </span>
        ))}
      </FastMarquee>
    </div>
  );
}

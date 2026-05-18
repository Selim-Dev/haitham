import * as React from "react";
import { cn } from "@/lib/utils";

// Pure CSS marquee. Was a framer-motion `animate={{ x: [0, -50%] }}` loop —
// constantly repainted a large layer and re-ran the JS animation engine even
// when off-screen. The CSS keyframe runs on the compositor, pauses for free
// when the tab is backgrounded, and respects prefers-reduced-motion via the
// global rule in globals.css. No JS needed, so this is a server component.

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
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max items-center gap-10 py-4"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
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
      </div>
    </div>
  );
}

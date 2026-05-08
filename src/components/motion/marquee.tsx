"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

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
  // Duplicate the list so the loop is seamless.
  const loop = React.useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <motion.div
        className="flex w-max items-center gap-10 py-4"
        style={{ willChange: "transform" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="font-display text-2xl font-extrabold tracking-tight text-foreground/80 sm:text-3xl">
              {item}
            </span>
            <span className="text-2xl text-primary/60 sm:text-3xl" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

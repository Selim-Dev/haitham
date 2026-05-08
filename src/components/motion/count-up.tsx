"use client";

import * as React from "react";
import { useInView, useMotionValue, animate } from "framer-motion";
import { toArabicNumerals } from "@/lib/utils";

export function CountUp({
  to,
  duration = 1.4,
  format = (v: number) => toArabicNumerals(Math.round(v)),
  className,
}: {
  to: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const [text, setText] = React.useState(format(0));

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(format(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, value, format]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

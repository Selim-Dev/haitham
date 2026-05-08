"use client";

import * as React from "react";

const POSITIONS = [
  { top: "8%", right: "8%" },
  { top: "12%", left: "8%" },
  { bottom: "20%", right: "12%" },
  { bottom: "8%", left: "8%" },
  { top: "45%", right: "5%" },
  { top: "55%", left: "5%" },
];

export function WatermarkOverlay({ text }: { text: string }) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % POSITIONS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const pos = POSITIONS[idx];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 select-none"
      aria-hidden="true"
    >
      <span
        className="absolute rounded-md bg-black/30 px-2 py-1 text-[10px] font-mono tracking-tight text-white/55 backdrop-blur-sm transition-all duration-700 ease-out sm:text-xs"
        style={pos}
      >
        {text}
      </span>
    </div>
  );
}

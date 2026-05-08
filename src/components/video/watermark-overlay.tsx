"use client";

import * as React from "react";

/**
 * Forensic watermark overlay.
 *
 * Why this matters:
 *  - Screen recording (OBS, etc.) cannot be prevented at the browser level —
 *    only hardware DRM (Widevine L1) blocks it, which Bunny Stream supports
 *    as a paid add-on.
 *  - The realistic deterrent is *traceability*: burn the viewer's identity
 *    visibly into every recording so any leak points back to the leaker.
 *  - Two simultaneous watermarks at top + bottom rotate through positions
 *    independently; a periodic "burst" briefly enlarges and brightens one
 *    so it's nearly impossible to crop out without ruining the recording.
 */

const TOP_POSITIONS = [
  { top: "6%", right: "6%" },
  { top: "10%", left: "6%" },
  { top: "30%", right: "4%" },
  { top: "20%", left: "10%" },
] as const;

const BOTTOM_POSITIONS = [
  { bottom: "8%", left: "6%" },
  { bottom: "14%", right: "8%" },
  { bottom: "30%", left: "5%" },
  { bottom: "22%", right: "5%" },
] as const;

export function WatermarkOverlay({ text }: { text: string }) {
  const [topIdx, setTopIdx] = React.useState(0);
  const [bottomIdx, setBottomIdx] = React.useState(2);
  const [burst, setBurst] = React.useState(false);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const top = setInterval(() => {
      setTopIdx((i) => (i + 1) % TOP_POSITIONS.length);
    }, 4200);
    const bottom = setInterval(() => {
      setBottomIdx((i) => (i + 1) % BOTTOM_POSITIONS.length);
    }, 5300);

    // Periodic burst — every ~22s, briefly enlarge & brighten one watermark
    // for 1.2s. Hard to crop out without obvious damage to the recording.
    const burstTimer = setInterval(() => {
      setBurst(true);
      setTimeout(() => setBurst(false), 1200);
    }, 22000);

    return () => {
      clearInterval(top);
      clearInterval(bottom);
      clearInterval(burstTimer);
    };
  }, []);

  // Pull the user-id slice out of the watermark text for the corner stamp.
  const idStamp = text.split("•")[2]?.trim() ?? "ID";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 select-none"
      aria-hidden="true"
    >
      {/* Always-on top watermark — rotates through positions */}
      <span
        className="absolute rounded-md bg-black/45 px-2.5 py-1 text-[11px] font-mono tracking-tight text-white/75 backdrop-blur-[2px] transition-all duration-700 ease-out sm:text-xs"
        style={TOP_POSITIONS[topIdx]}
      >
        {text}
      </span>

      {/* Always-on bottom watermark — rotates independently */}
      <span
        className="absolute rounded-md bg-black/45 px-2.5 py-1 text-[11px] font-mono tracking-tight text-white/75 backdrop-blur-[2px] transition-all duration-700 ease-out sm:text-xs"
        style={BOTTOM_POSITIONS[bottomIdx]}
      >
        {text}
      </span>

      {/* Persistent small corner stamp — always visible, hard to forget */}
      <span className="absolute right-2 top-2 rounded-sm bg-black/40 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-white/60">
        AHA · {idStamp}
      </span>

      {/* Burst — brighter, larger, dead-center every ~22s for 1.2s */}
      <span
        className={
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/50 px-4 py-2 font-mono backdrop-blur-sm transition-all duration-700 ease-out " +
          (burst
            ? "scale-100 text-base text-white/90 opacity-100 sm:text-lg"
            : "scale-90 text-xs text-white/0 opacity-0")
        }
      >
        {text}
      </span>
    </div>
  );
}

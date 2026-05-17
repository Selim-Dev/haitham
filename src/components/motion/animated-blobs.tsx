"use client";

import { motion } from "framer-motion";

/**
 * Background gradient blobs.
 *
 * Perf notes:
 *  - Animating `blur` together with `scale` makes the browser re-rasterize
 *    the blur every frame. Keep `transform: translate3d` only (no scale).
 *  - 2 blobs is plenty visually; 3+ stack up GPU work.
 *  - Hidden on mobile — the screen is small enough that the blobs add
 *    motion noise rather than depth, and mobile GPUs struggle with the
 *    large blurs.
 *  - `will-change: transform` keeps each blob on its own compositor layer.
 */

const BLOBS = [
  {
    size: 480,
    top: "-8%",
    left: "-8%",
    color: "rgba(37,150,190,0.16)",
    duration: 32,
    x: [0, 50, 0],
    y: [0, -25, 0],
  },
  {
    size: 440,
    bottom: "-12%",
    right: "-10%",
    color: "rgba(15,66,88,0.18)",
    duration: 38,
    x: [0, -35, 0],
    y: [0, 25, 0],
  },
];

export function AnimatedBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden sm:block"
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            willChange: "transform",
          }}
          animate={{
            x: b.x,
            y: b.y,
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

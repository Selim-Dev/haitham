"use client";

import { motion } from "framer-motion";

const BLOBS = [
  {
    size: 520,
    top: "-8%",
    left: "-10%",
    color: "rgba(229,9,20,0.18)",
    duration: 18,
    delay: 0,
    x: [0, 60, -20, 0],
    y: [0, -30, 20, 0],
  },
  {
    size: 460,
    top: "30%",
    right: "-12%",
    color: "rgba(122,0,21,0.22)",
    duration: 22,
    delay: 1,
    x: [0, -40, 30, 0],
    y: [0, 40, -10, 0],
  },
  {
    size: 380,
    bottom: "-14%",
    left: "30%",
    color: "rgba(176,0,32,0.16)",
    duration: 26,
    delay: 2,
    x: [0, 30, -30, 0],
    y: [0, -20, 30, 0],
  },
];

export function AnimatedBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
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
          }}
          animate={{
            x: b.x,
            y: b.y,
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

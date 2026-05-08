"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: x, transformOrigin: "right" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] shadow-[0_0_12px_rgba(229,9,20,0.6)]"
    />
  );
}

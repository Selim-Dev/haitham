"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Infinity as InfinityIcon, Zap } from "lucide-react";
import { COPY } from "@/lib/arabic";

const FLOAT_BADGES = [
  { icon: InfinityIcon, label: COPY.hero.badges[0], top: "8%", left: "-8%" },
  { icon: Sparkles, label: COPY.hero.badges[1], top: "30%", right: "-12%" },
  { icon: ShieldCheck, label: COPY.hero.badges[2], bottom: "18%", left: "-10%" },
  { icon: Zap, label: COPY.hero.badges[3], bottom: "5%", right: "-6%" },
];

export function OwnerHeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-md aspect-[4/5] sm:max-w-lg">
      {/* Red radial glow halo */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-12 -z-10 bg-radial-red blur-2xl"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/40 via-deep-red/30 to-transparent blur-3xl"
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="glass-strong relative h-full w-full overflow-hidden rounded-[2rem] p-1.5 shadow-[var(--shadow-red-glow-lg)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-elevated cinematic-vignette">
          <Image
            src="/owner-hero.jpg"
            alt={COPY.instructor.name}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 480px"
            className="object-cover"
          />
          {/* Bottom gradient for text legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-foreground/90">
                {COPY.instructor.role}
              </span>
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {COPY.instructor.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      {FLOAT_BADGES.map((b, i) => {
        const Icon = b.icon;
        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
            }}
            className="absolute hidden sm:flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-card/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur"
          >
            <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[var(--color-red-300)]">
              <Icon className="size-3.5" />
            </span>
            <span>{b.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

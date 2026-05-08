"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Infinity as InfinityIcon,
  Zap,
} from "lucide-react";
import { COPY } from "@/lib/arabic";

// Desktop badges — overhang the card edges for a magazine-cover feel.
const DESKTOP_BADGES = [
  { icon: InfinityIcon, label: COPY.hero.badges[0], top: "8%", left: "-8%" },
  { icon: Sparkles, label: COPY.hero.badges[1], top: "30%", right: "-12%" },
  { icon: ShieldCheck, label: COPY.hero.badges[2], bottom: "18%", left: "-10%" },
  { icon: Zap, label: COPY.hero.badges[3], bottom: "5%", right: "-6%" },
];

// Mobile badges — sit INSIDE the card edges so they never clip off-screen.
const MOBILE_BADGES = [
  { icon: InfinityIcon, label: COPY.hero.badges[0], top: "4%", right: "4%" },
  { icon: Zap, label: COPY.hero.badges[3], bottom: "22%", left: "4%" },
];

export function OwnerHeroCard() {
  return (
    <div className="relative mx-auto w-[88%] max-w-md aspect-[4/5] sm:w-full sm:max-w-lg">
      {/* Red radial glow halo — fades in once, no continuous animation */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-16 -z-10 bg-radial-red blur-3xl sm:-inset-12 sm:blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/35 via-deep-red/25 to-transparent blur-3xl opacity-70"
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
            sizes="(max-width: 768px) 88vw, 480px"
            className="object-cover"
          />
          {/* Bottom gradient for text legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="size-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-foreground/90 sm:text-xs">
                {COPY.instructor.role}
              </span>
            </div>
            <p className="mt-1 font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {COPY.instructor.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile badges — inside card edges */}
      {MOBILE_BADGES.map((b, i) => {
        const Icon = b.icon;
        return (
          <motion.div
            key={`m-${b.label}`}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.55 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
            }}
            className="absolute z-10 flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-card/90 px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur sm:hidden"
          >
            <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[var(--color-red-300)]">
              <Icon className="size-3" />
            </span>
            <span>{b.label}</span>
          </motion.div>
        );
      })}

      {/* Desktop badges — overhang edges */}
      {DESKTOP_BADGES.map((b, i) => {
        const Icon = b.icon;
        return (
          <motion.div
            key={`d-${b.label}`}
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
            className="absolute hidden items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-card/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur sm:flex"
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

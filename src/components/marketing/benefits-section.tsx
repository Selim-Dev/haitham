"use client";

import { motion } from "framer-motion";
import {
  Crosshair,
  Infinity as InfinityIcon,
  Lock,
  ShieldCheck,
  Languages,
  Hammer,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/motion/fade-in";
import { COPY } from "@/lib/arabic";

const ICONS = [Crosshair, InfinityIcon, ShieldCheck, Lock, Languages, Hammer];

export function BenefitsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <FadeIn>
          <SectionTitle
            eyebrow="مميزات الأكاديمية"
            title={COPY.benefits.title}
            subtitle={COPY.benefits.subtitle}
          />
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COPY.benefits.items.map((b, i) => {
            const Icon = ICONS[i] ?? Crosshair;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-elevated hover:shadow-[var(--shadow-red-glow)]"
              >
                {/* Hover gradient sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px -z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, rgba(37,150,190,0.08), transparent 60%)",
                  }}
                />
                <motion.div
                  initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    delay: i * 0.06 + 0.12,
                  }}
                  whileHover={{ rotate: -6, scale: 1.05 }}
                  className="relative mb-4 grid size-12 place-items-center rounded-xl bg-primary/10 text-[var(--color-red-300)] ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20"
                >
                  <Icon className="size-6" />
                </motion.div>
                <h3 className="relative font-display text-lg font-bold text-foreground">
                  {b.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">
                  {b.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

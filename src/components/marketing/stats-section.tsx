"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/motion/count-up";

const STATS = [
  { value: 1200, suffix: "+", label: "طالب" },
  { value: 96, suffix: "%", label: "نسبة الرضا" },
  { value: 24, suffix: "/٧", label: "دعم متاح" },
  { value: 3, suffix: "", label: "كورسات حصرية" },
];

export function StatsSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-card p-8 sm:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -z-0 size-96 -translate-x-1/2 rounded-full bg-radial-red blur-3xl opacity-50"
          />
          <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center"
              >
                <div className="font-display text-4xl font-extrabold leading-none tracking-tight bg-gradient-to-l from-foreground to-[var(--color-red-300)] bg-clip-text text-transparent sm:text-5xl">
                  <CountUp to={s.value} />
                  {s.suffix}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-2">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

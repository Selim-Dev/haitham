"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/motion/fade-in";
import { COPY } from "@/lib/arabic";

export function HowItWorksSection() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="how"
      ref={ref}
      className="relative py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-l from-transparent via-[var(--color-border-strong)] to-transparent"
      />
      <Container>
        <FadeIn>
          <SectionTitle
            eyebrow="كيف تعمل المنصة"
            title={COPY.howItWorks.title}
            subtitle={COPY.howItWorks.subtitle}
          />
        </FadeIn>

        <div className="relative mt-16">
          {/* Animated connector line — desktop only */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-1/2 -z-10 hidden h-12 w-full -translate-y-1/2 lg:block"
          >
            <motion.path
              d="M 970 30 C 800 5, 600 55, 500 30 S 200 5, 30 30"
              fill="none"
              stroke="url(#how-grad)"
              strokeWidth="2"
              strokeDasharray="0 1"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient
                id="how-grad"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(37,150,190,0.0)" />
                <stop offset="20%" stopColor="rgba(37,150,190,0.6)" />
                <stop offset="80%" stopColor="rgba(37,150,190,0.6)" />
                <stop offset="100%" stopColor="rgba(37,150,190,0.0)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COPY.howItWorks.steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative h-full rounded-2xl border border-[var(--color-border)] bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-elevated"
              >
                <div className="mb-4 flex items-center justify-between">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 14,
                      delay: i * 0.08 + 0.15,
                    }}
                    className="font-display text-3xl font-black text-primary/30 transition-colors group-hover:text-primary/70"
                  >
                    {step.num}
                  </motion.span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-2">
                    خطوة {step.num}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { OwnerHeroCard } from "./owner-hero-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AnimatedBlobs } from "@/components/motion/animated-blobs";
import { WordReveal } from "@/components/motion/word-reveal";
import { COPY } from "@/lib/arabic";

export function HeroSection() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle parallax on the owner image as you scroll past the hero.
  const ownerY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20"
    >
      {/* Background layers */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute inset-0 -z-20 bg-redpill-grad"
      />
      <AnimatedBlobs />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(229,9,20,0.18),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            style={{ y: textY }}
            className="flex flex-col items-start gap-6 text-start"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--color-red-300)]"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              {COPY.hero.eyebrow}
            </motion.span>

            <h1 className="font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">
                <WordReveal text={COPY.hero.headlinePre} />
              </span>
              <span className="relative mt-2 inline-block">
                <WordReveal
                  text={COPY.hero.headlineHighlight}
                  className="bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] bg-clip-text text-transparent"
                />
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "right" }}
                  className="absolute inset-x-0 -bottom-2 h-[2px] bg-gradient-to-l from-transparent via-primary to-transparent"
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
            >
              {COPY.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="xl" variant="primary" className="group">
                <Link href="/courses">
                  {COPY.hero.ctaPrimary}
                  <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="secondary">
                <Link href="/register">
                  <PlayCircle className="size-5" />
                  {COPY.hero.ctaSecondary}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-2"
            >
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                وصول مدى الحياة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                دفع آمن وبسيط
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                دعم عربي مباشر
              </span>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: ownerY }} className="relative">
            <OwnerHeroCard />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

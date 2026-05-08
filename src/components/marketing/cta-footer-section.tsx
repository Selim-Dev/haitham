"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { COPY } from "@/lib/arabic";

export function CtaFooterSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#1a0408] via-[#0b0b0f] to-[#0b0b0f] p-10 sm:p-16">
            {/* Slowly drifting red halo */}
            <motion.div
              aria-hidden="true"
              className="absolute -top-40 left-1/2 -translate-x-1/2 size-[640px] rounded-full bg-radial-red blur-3xl"
              animate={{
                opacity: [0.5, 0.85, 0.5],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Animated gradient sweep over the border */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(115deg, transparent 30%, rgba(229,9,20,0.18) 50%, transparent 70%)",
                backgroundSize: "300% 300%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--color-red-300)]"
              >
                <Sparkles className="size-3" />
                ابدأ اليوم
              </motion.span>
              <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {COPY.ctaFooter.title}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {COPY.ctaFooter.body}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl" variant="primary" className="group">
                  <Link href="/courses">
                    {COPY.ctaFooter.cta}
                    <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="ghost">
                  <Link href="/register">{COPY.nav.register}</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, BadgeCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/motion/fade-in";
import { COPY } from "@/lib/arabic";

export function InstructorSection() {
  return (
    <section
      id="instructor"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 start-1/3 -z-10 size-[520px] -translate-x-1/2 rounded-full bg-radial-red opacity-40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 end-0 -z-10 size-[420px] rounded-full bg-radial-red opacity-25 blur-3xl"
      />

      <Container>
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--color-red-300)]">
            <Sparkles className="size-3.5" />
            {COPY.instructor.eyebrow}
          </span>
          <h2 className="mt-5 font-display text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {COPY.instructor.question.split("ليه").map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <span className="bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-300)] bg-clip-text text-transparent">
                    ليه
                  </span>
                  {part}
                </span>
              ),
            )}
          </h2>
        </FadeIn>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <FadeIn className="relative mx-auto w-full max-w-sm">
            <motion.div
              aria-hidden="true"
              className="absolute -inset-8 -z-10 bg-radial-red opacity-70 blur-3xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong relative aspect-[4/5] overflow-hidden rounded-[2rem] p-1.5 shadow-[var(--shadow-red-glow-lg)]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] cinematic-vignette">
                <Image
                  src="/owner-hero.jpg"
                  alt={COPY.instructor.name}
                  fill
                  sizes="(max-width: 768px) 80vw, 380px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-[var(--color-red-300)]" />
                    <span className="text-[11px] font-semibold tracking-wide text-foreground/90">
                      {COPY.instructor.role}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
                    {COPY.instructor.name}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, x: -8 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-4 start-4 hidden items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-card/95 px-3.5 py-2 text-xs font-bold text-foreground shadow-[var(--shadow-soft)] backdrop-blur sm:flex"
            >
              <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[var(--color-red-300)]">
                <BadgeCheck className="size-3.5" />
              </span>
              <span>+١٠ سنين خبرة</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col gap-6">
            <div>
              <p className="font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                {COPY.instructor.name}
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--color-red-300)]">
                {COPY.instructor.role}
              </p>
              <p className="mt-3 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                {COPY.instructor.bio}
              </p>
            </div>

            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-soft)] sm:p-7"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-[var(--color-red-300)] via-primary to-transparent"
              />
              <Quote
                aria-hidden="true"
                className="absolute end-5 top-5 size-10 rotate-180 text-primary/20"
              />
              <blockquote className="relative">
                <p className="font-display text-lg font-bold leading-[1.7] text-foreground sm:text-xl">
                  {`"${COPY.instructor.quote}"`}
                </p>
                <figcaption className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-2">
                  <span className="h-px w-8 bg-[var(--color-red-300)]/50" />
                  {COPY.instructor.name}
                </figcaption>
              </blockquote>
            </motion.figure>

            <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-5">
              {COPY.instructor.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.2 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 sm:p-5"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red-300)]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <p className="font-display text-2xl font-extrabold leading-none tracking-tight bg-gradient-to-l from-foreground via-foreground to-[var(--color-red-300)] bg-clip-text text-transparent sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-2 sm:text-xs">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

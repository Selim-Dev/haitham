import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { OwnerHeroCard } from "./owner-hero-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AnimatedBlobs } from "@/components/motion/animated-blobs";
import { WordReveal } from "@/components/motion/word-reveal";
import { COPY } from "@/lib/arabic";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-14 pt-8 sm:pb-24 sm:pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-redpill-grad"
      />
      <AnimatedBlobs />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(75,188,99,0.18),transparent_60%)]"
      />

      <Container>
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5 text-start sm:gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[11px] font-bold tracking-wide text-[var(--color-red-300)] sm:px-3.5 sm:py-1.5 sm:text-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              {COPY.hero.eyebrow}
            </span>

            <h1 className="font-display text-balance text-[2.85rem] font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-6xl sm:leading-[1.06] lg:text-7xl xl:text-8xl">
              <span className="block">
                <WordReveal text={COPY.hero.headlinePre1} />
              </span>
              <span className="mt-2 block sm:mt-3">
                <WordReveal text={COPY.hero.headlinePre2} />
              </span>
              <span className="relative mt-2 inline-block sm:mt-3">
                <WordReveal
                  text={COPY.hero.headlineHighlight}
                  className="bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] bg-clip-text text-transparent"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1.5 h-[2px] bg-gradient-to-l from-transparent via-primary to-transparent sm:-bottom-2"
                />
              </span>
            </h1>

            <p className="max-w-xl text-pretty text-base leading-[1.7] text-muted sm:text-lg sm:leading-relaxed">
              {COPY.hero.subtitle}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
                asChild
                size="xl"
                variant="primary"
                className="group w-full sm:w-auto"
              >
                <Link href="/courses">
                  {COPY.hero.ctaPrimary}
                  <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Link href="/register">
                  <PlayCircle className="size-5" />
                  {COPY.hero.ctaSecondary}
                </Link>
              </Button>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted sm:gap-x-6 sm:text-xs sm:text-muted-2">
              <span className="flex items-center gap-2 sm:gap-1.5">
                <span className="size-2 rounded-full bg-[var(--color-success)] sm:size-1.5" />
                وصول مدى الحياة
              </span>
              <span className="flex items-center gap-2 sm:gap-1.5">
                <span className="size-2 rounded-full bg-[var(--color-success)] sm:size-1.5" />
                دفع آمن وبسيط
              </span>
              <span className="flex items-center gap-2 sm:gap-1.5">
                <span className="size-2 rounded-full bg-[var(--color-success)] sm:size-1.5" />
                دعم عربي مباشر
              </span>
            </div>
          </div>

          <div className="relative">
            <OwnerHeroCard />
          </div>
        </div>
      </Container>
    </section>
  );
}

import * as React from "react";
import Image from "next/image";
import {
  Flame,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Star,
  Quote,
  Gift,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { FeedbackGallery } from "@/components/feedbacks/feedback-gallery";
import { Reveal } from "@/components/offer/reveal";
import { OfferFaq } from "@/components/offer/offer-faq";
import { OfferFooter } from "@/components/offer/offer-footer";
import { ScrollProgressBar } from "@/components/offer/scroll-progress-bar";
import { StickyBuyBar } from "@/components/offer/sticky-buy-bar";
import { OFFER, type OfferPricing } from "@/lib/offer-content";
import { cn } from "@/lib/utils";

const BOOK_COVER = "/booksImages/game-of-tests.webp";
const AUTHOR_PHOTO = "/booksImages/ahmedhaitham-efham.webp";

// Amber "limited offer" pill, light theme.
const PILL_AMBER =
  "inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800";

// Book-specific testimonials shipped alongside the offer art.
const OFFER_FEEDBACKS = Array.from({ length: 8 }, (_, i) => ({
  src: `/booksImages/bookfeedback${i + 1}.jpg`,
  alt: `رسالة عميل عن كتاب لعبة الاختبارات رقم ${i + 1}`,
}));

/** High-contrast CTA → checkout anchor, with the "grab the bonuses" caption. */
function OfferCta({ label }: { label: string }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-2.5">
      <a
        href={OFFER.checkoutHref}
        className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#3aa551] to-[#1f5d2e] px-8 py-4 font-display text-base font-bold text-white shadow-[0_14px_34px_-12px_rgba(31,93,46,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d8541]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
      >
        {label}
        <ArrowLeft className="size-4" />
      </a>
      <p className="text-xs font-medium text-neutral-500">{OFFER.subCaption}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center font-display text-3xl font-extrabold leading-tight tracking-tight text-balance text-neutral-900 sm:text-4xl">
      {children}
    </h2>
  );
}

export function BundleOffer({
  pricing,
  checkout,
}: {
  pricing: OfferPricing;
  checkout: React.ReactNode;
}) {
  const dir = pricing.ltr ? "ltr" : undefined;

  return (
    <>
      <ScrollProgressBar />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50/70 to-white">
        <div
          aria-hidden
          className="absolute -end-24 -top-24 -z-10 size-[28rem] rounded-full bg-[#4bbc63]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -start-24 top-1/3 -z-10 size-[24rem] rounded-full bg-amber-200/30 blur-3xl"
        />

        <Container className="relative py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="order-2 lg:order-1">
              <span className={cn(PILL_AMBER, "mb-4")}>
                <Flame className="size-3.5" />
                {OFFER.hero.badge}
              </span>

              <h1 className="font-display text-3xl font-extrabold leading-[1.3] tracking-tight text-balance text-neutral-900 sm:text-4xl lg:text-[2.75rem]">
                {OFFER.hero.headlinePre}{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-l from-[#2d8541] via-[#3aa551] to-[#1f5d2e] bg-clip-text text-transparent">
                    {OFFER.hero.headlineHighlight}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-gradient-to-l from-[#3aa551]/0 via-[#3aa551] to-[#3aa551]/0"
                  />
                </span>{" "}
                {OFFER.hero.headlinePost}
              </h1>

              <p className="mt-4 font-display text-lg font-bold text-[#2d8541]">
                {OFFER.hero.secret}
              </p>
              <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                {OFFER.hero.lead}
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border-s-4 border-[#4bbc63] bg-green-50 p-5">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-[#2d8541]" />
                <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                  <strong className="font-bold text-[#2d8541]">
                    {OFFER.productName}
                  </strong>{" "}
                  {OFFER.hero.callout}
                </p>
              </div>

              <OfferCta label="احصل على الباقة الكاملة الآن" />
            </Reveal>

            {/* Book cover with subtle 3D tilt */}
            <Reveal className="order-1 lg:order-2" delay={120}>
              <div className="group relative mx-auto w-full max-w-[300px] [perspective:1200px]">
                <div
                  aria-hidden
                  className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#4bbc63]/20 blur-2xl"
                />
                <span
                  className={cn(
                    PILL_AMBER,
                    "absolute -top-3 start-2 z-10 shadow-md",
                  )}
                >
                  {OFFER.hero.coverBadge}
                </span>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] [transform:rotateY(-7deg)] group-hover:[transform:rotateY(0deg)_scale(1.03)] motion-reduce:[transform:none]">
                  <Image
                    src={BOOK_COVER}
                    alt={OFFER.productName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 300px, 340px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-white/30 via-transparent to-black/20"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─── ABOUT AUTHOR ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-5xl">
          <Reveal>
            <SectionHeading>{OFFER.author.heading}</SectionHeading>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
            <Reveal className="mx-auto w-full max-w-[280px]">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-3 -z-10 rounded-3xl bg-amber-200/40 blur-2xl"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-lg">
                  <Image
                    src={AUTHOR_PHOTO}
                    alt={OFFER.author.name}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h3 className="font-display text-2xl font-extrabold text-neutral-900">
                {OFFER.author.name}
                <span className="text-neutral-500"> — {OFFER.author.role}</span>
              </h3>
              <p className="mt-4 border-s-4 border-[#4bbc63] ps-4 text-base leading-relaxed text-neutral-600">
                <strong className="text-neutral-900">{OFFER.author.bioLead}</strong>{" "}
                {OFFER.author.bioRest}
              </p>
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="font-display text-base font-bold leading-relaxed text-neutral-800">
                  {OFFER.author.quote}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 grid gap-4 sm:grid-cols-3">
            {OFFER.author.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-green-50 to-white p-6 text-center shadow-sm"
              >
                <p className="font-display text-3xl font-black text-[#2d8541] sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-600">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>

          <OfferCta label={OFFER.author.cta} />
        </Container>
      </section>

      {/* ─── PROBLEM ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-neutral-200 bg-neutral-50 py-16 sm:py-24">
        <div
          aria-hidden
          className="absolute -start-20 top-10 -z-10 size-[26rem] rounded-full bg-red-100/50 blur-3xl"
        />
        <Container className="max-w-6xl">
          <Reveal className="text-center">
            <p className="font-display text-2xl font-bold text-[#2d8541]">
              {OFFER.problem.headingTop}
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight text-balance text-neutral-900 sm:text-5xl">
              {OFFER.problem.headingBottom}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {OFFER.problem.leadPre}{" "}
              <span className="font-bold text-red-600">
                {OFFER.problem.leadHighlight}
              </span>{" "}
              {OFFER.problem.leadPost}
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              {OFFER.problem.cards.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <article className="rounded-2xl border border-neutral-200 border-s-4 border-s-red-400 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-s-red-500 hover:shadow-md">
                    <h3 className="flex items-start gap-2 font-display text-lg font-extrabold text-neutral-900">
                      <span aria-hidden className="text-red-500">
                        ✕
                      </span>
                      {c.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {c.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="flex justify-center">
              <div className="group relative w-full max-w-[300px]">
                <div
                  aria-hidden
                  className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#4bbc63]/20 blur-2xl"
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-green-200 bg-neutral-100 shadow-lg">
                  <Image
                    src={BOOK_COVER}
                    alt={OFFER.productName}
                    fill
                    sizes="(max-width: 1024px) 300px, 340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span
                  className={cn(
                    PILL_AMBER,
                    "absolute -bottom-3 end-3 shadow-md",
                  )}
                >
                  📚 ٣ كتب + بونصات
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="rounded-3xl border-2 border-green-200 bg-white p-8 text-center shadow-sm">
              <p className="flex items-center justify-center gap-2 font-display text-xl font-extrabold text-[#2d8541]">
                <AlertTriangle className="size-5" />
                {OFFER.problem.warningTitle}
              </p>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
                {OFFER.problem.warningBodyPre}{" "}
                <span className="font-bold text-red-600 underline decoration-red-400 decoration-2 underline-offset-4">
                  {OFFER.problem.warningBodyHighlight}
                </span>
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── CHAPTERS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-6xl">
          <Reveal>
            <SectionHeading>{OFFER.chapters.heading}</SectionHeading>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {OFFER.chapters.items.map((ch, i) => (
              <Reveal key={ch.title} delay={(i % 2) * 80}>
                <article className="h-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4bbc63]/40 hover:shadow-lg sm:p-7">
                  <h3 className="flex items-center gap-3 border-b border-neutral-200 pb-4 font-display text-lg font-extrabold text-neutral-900">
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-green-200 bg-green-50 text-2xl"
                    >
                      {ch.icon}
                    </span>
                    {ch.title}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {ch.points.map((p) => (
                      <li key={p.lead} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#2d8541]" />
                        <span className="text-sm leading-relaxed text-neutral-600">
                          <strong className="text-neutral-900">{p.lead}</strong>{" "}
                          {p.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
              <div
                aria-hidden
                className="absolute -end-12 -top-12 size-40 rounded-full bg-amber-200/40 blur-3xl"
              />
              <h3 className="font-display text-xl font-extrabold text-amber-800">
                {OFFER.chapters.bonusTitle}
              </h3>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {OFFER.chapters.bonusItems.map((b) => (
                  <p
                    key={b.lead}
                    className="flex items-center gap-2 text-sm text-neutral-700 sm:text-base"
                  >
                    <Gift className="size-4 text-amber-600" />
                    <strong className="text-neutral-900">{b.lead}</strong> {b.rest}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── BUNDLE CONTENTS ──────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 sm:py-24">
        <Container className="max-w-6xl">
          <Reveal>
            <SectionHeading>{OFFER.bundle.heading}</SectionHeading>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {OFFER.bundle.items.map((b, i) => (
              <Reveal key={b.title} delay={i * 80}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4bbc63]/40 hover:shadow-lg">
                  {b.badge && (
                    <span className="absolute end-4 top-4 z-10 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                      {b.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white p-6">
                    <div className="relative aspect-[3/4] w-full max-w-[170px] overflow-hidden rounded-xl border border-neutral-200 shadow-md transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
                      <Image
                        src={b.img}
                        alt={b.title}
                        fill
                        sizes="170px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-2 text-center">
                    <h3 className="font-display text-lg font-extrabold text-neutral-900">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {b.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <OfferCta label={OFFER.bundle.cta} />
        </Container>
      </section>

      {/* ─── PACKAGE SUMMARY + PRICE ──────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading>{OFFER.packageSummary.heading}</SectionHeading>
          </Reveal>

          <Reveal className="mt-10 flex flex-col gap-4">
            {OFFER.packageSummary.items.map((p, i) => (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-[#2d8541]" />
                <div>
                  <p className="font-display font-bold text-neutral-900">
                    {p.title}{" "}
                    {pricing.packagePrices?.[i] && (
                      <span className="text-sm font-bold text-amber-700">
                        ({pricing.packagePrices[i]})
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="relative mt-10">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-3xl bg-[#4bbc63]/15 blur-2xl"
            />
            <div className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center shadow-[0_24px_60px_-28px_rgba(45,133,65,0.45)]">
              {pricing.originalLabel && (
                <p className="text-sm text-neutral-500 line-through" dir={dir}>
                  السعر الأصلي: {pricing.originalLabel}
                </p>
              )}
              <p className="mt-1 font-display text-lg font-bold text-neutral-700">
                ⚡ سعر الباقة الكاملة
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <span
                  dir={dir}
                  className="font-display text-5xl font-black text-[#1f5d2e]"
                >
                  {pricing.amountLabel}
                </span>
                {pricing.saveLabel && (
                  <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-bold text-green-800">
                    {pricing.saveLabel}
                  </span>
                )}
              </div>
              <p className="mt-5 font-display text-sm font-bold text-amber-700">
                {OFFER.packageSummary.endsSoon}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── GUARANTEE ────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 sm:py-24">
        <Container className="max-w-2xl">
          <Reveal>
            <div className="rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-50 text-[#2d8541]">
                <ShieldCheck className="size-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-neutral-900">
                {OFFER.guarantee.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                {OFFER.guarantee.body1}
              </p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-neutral-900 sm:text-base">
                {OFFER.guarantee.body2}
              </p>
              <div className="mt-6 rounded-2xl bg-green-50 p-4">
                <p className="font-display text-base font-bold text-[#2d8541]">
                  {OFFER.guarantee.pledge}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── CHECKOUT ─────────────────────────────────────────── */}
      <section id="checkout" className="scroll-mt-8 py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-center">
              <p className="text-sm font-semibold text-neutral-700">
                {OFFER.checkout.trustStripPre}{" "}
                <span className="font-bold text-amber-800">
                  {OFFER.checkout.trustStripHighlight}
                </span>
              </p>
            </div>

            <h2 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              {OFFER.productName}
            </h2>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-500" />
              <div className="text-sm leading-relaxed">
                <p className="font-bold text-red-900">{pricing.urgencyTitle}</p>
                <p className="mt-1">{pricing.urgencySub}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <span
                dir={dir}
                className="font-display text-5xl font-black text-[#1f5d2e]"
              >
                {pricing.amountLabel}
              </span>
              {pricing.originalLabel && (
                <span
                  dir={dir}
                  className="pb-1 text-lg text-neutral-500 line-through"
                >
                  {pricing.originalLabel}
                </span>
              )}
              {pricing.saveLabel && (
                <span className="mb-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  {pricing.saveLabel}
                </span>
              )}
            </div>

            <p className="mt-5 rounded-2xl border-s-4 border-[#4bbc63] bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-600">
              {OFFER.checkout.description}
            </p>
          </Reveal>

          {/* Checkout box */}
          <Reveal delay={80} className="mt-6">
            <div className="rounded-3xl border-2 border-green-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(45,133,65,0.4)] sm:p-8">
              <div className="mb-6 text-center">
                <h3 className="font-display text-xl font-extrabold text-neutral-900">
                  {OFFER.checkout.boxTitle}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  {OFFER.checkout.boxSubtitle}
                </p>
              </div>

              {checkout}

              <div className="mt-6 border-t border-neutral-200 pt-5 text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  {pricing.trustBadges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
                    >
                      <CheckCircle2 className="size-3.5 text-[#2d8541]" />
                      {b}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  {OFFER.checkout.secureNote}
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-center text-xs font-medium text-neutral-500">
              {OFFER.subCaption}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────────── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-24">
        <Container className="max-w-6xl">
          <Reveal className="text-center">
            <SectionHeading>{OFFER.reviews.heading}</SectionHeading>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
              {OFFER.reviews.subtitle}
            </p>
          </Reveal>

          <div className="mt-12">
            <FeedbackGallery feedbacks={OFFER_FEEDBACKS} tone="light" />
          </div>

          <OfferCta label={OFFER.reviews.cta} />
        </Container>
      </section>

      {/* ─── MOTIVATIONAL BANNER ──────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-green-200 bg-gradient-to-l from-green-50 via-green-100 to-green-50 py-16 sm:py-20">
        <Container className="max-w-4xl">
          <Reveal className="flex flex-col items-center text-center">
            <Quote className="size-10 text-[#4bbc63]" />
            <p className="mt-4 font-display text-xl font-bold leading-relaxed text-balance text-neutral-800 sm:text-2xl">
              {OFFER.motivational}
            </p>
            <div className="mt-6 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-current" />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal className="text-center">
            <SectionHeading>{OFFER.faq.heading}</SectionHeading>
            <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600">
              {OFFER.faq.subtitle}
            </p>
          </Reveal>
          <OfferFaq items={OFFER.faq.items} />

          <OfferCta label="ابدأ رحلتك دلوقتي 🚀" />
        </Container>
      </section>

      <OfferFooter />

      <StickyBuyBar amountLabel={pricing.amountLabel} ltr={pricing.ltr} />
    </>
  );
}

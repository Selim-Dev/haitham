"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/motion/fade-in";
import { COPY } from "@/lib/arabic";
import { cn, toArabicNumerals } from "@/lib/utils";

const FEEDBACKS = Array.from({ length: 12 }, (_, i) => ({
  src: `/feedbacks/feedback${i + 1}.jpg`,
  alt: `رسالة طالب رقم ${i + 1}`,
}));

export function FeedbacksSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpenIndex(null), []);
  const next = React.useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i + 1) % FEEDBACKS.length,
      ),
    [],
  );
  const prev = React.useCallback(
    () =>
      setOpenIndex((i) =>
        i === null
          ? null
          : (i - 1 + FEEDBACKS.length) % FEEDBACKS.length,
      ),
    [],
  );

  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") prev();
      else if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  return (
    <section className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[60%] max-w-5xl -translate-y-1/2 rounded-full bg-radial-red opacity-25 blur-3xl"
      />
      <Container>
        <FadeIn>
          <SectionTitle
            eyebrow={
              <>
                <Quote className="size-3.5" />
                {COPY.feedbacks.eyebrow}
              </>
            }
            title={COPY.feedbacks.title}
            subtitle={COPY.feedbacks.subtitle}
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-4 text-center text-xs font-medium text-muted-2">
            {COPY.feedbacks.note} ·{" "}
            <span className="text-[var(--color-red-300)]">
              {toArabicNumerals(FEEDBACKS.length)} {COPY.feedbacks.counter}
            </span>
          </p>
        </FadeIn>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
          {FEEDBACKS.map((f, i) => (
            <FeedbackCard
              key={f.src}
              src={f.src}
              alt={f.alt}
              index={i}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            src={FEEDBACKS[openIndex].src}
            alt={FEEDBACKS[openIndex].alt}
            index={openIndex}
            total={FEEDBACKS.length}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FeedbackCard({
  src,
  alt,
  index,
  onOpen,
}: {
  src: string;
  alt: string;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: (index % 6) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      aria-label={`عرض ${alt}`}
      className={cn(
        "group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card shadow-[0_4px_18px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_rgba(75,188,99,0.45)]",
      )}
    >
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt}
          width={520}
          height={780}
          className="block h-auto w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur-md">
            <ZoomIn className="size-3" />
            عرض كامل
          </span>
          <span className="rounded-full bg-[var(--color-red-300)]/90 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
            #{toArabicNumerals(index + 1)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Lightbox({
  src,
  alt,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[80] grid place-items-center"
    >
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-background/90 backdrop-blur-xl"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[min(92vw,560px)] flex-col items-center px-2">
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
        >
          <Image
            src={src}
            alt={alt}
            width={1080}
            height={1620}
            className="block h-auto w-full"
            sizes="(max-width: 640px) 92vw, 560px"
            priority
          />
        </motion.div>

        <div className="mt-4 flex w-full items-center justify-between text-xs text-muted">
          <span className="rounded-full bg-card/80 px-3 py-1 font-semibold backdrop-blur">
            {toArabicNumerals(index + 1)} / {toArabicNumerals(total)}
          </span>
          <span className="hidden sm:inline">
            استخدم الأسهم للتنقل · Esc للإغلاق
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="إغلاق"
        className="absolute end-4 top-4 grid size-11 place-items-center rounded-full border border-[var(--color-border-strong)] bg-card/90 text-foreground backdrop-blur-md transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <X className="size-5" />
      </button>

      <button
        type="button"
        onClick={onPrev}
        aria-label="السابق"
        className="absolute end-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-border-strong)] bg-card/90 text-foreground backdrop-blur-md transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:size-12"
      >
        <ChevronRight className="size-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="التالي"
        className="absolute start-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-border-strong)] bg-card/90 text-foreground backdrop-blur-md transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:size-12"
      >
        <ChevronLeft className="size-5" />
      </button>
    </motion.div>
  );
}

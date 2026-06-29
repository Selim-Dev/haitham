"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn, toArabicNumerals } from "@/lib/utils";

// Single source of truth for the testimonial images. Used on the homepage
// feedbacks section AND on /sessions — keep this list in sync with what's
// actually in /public/feedbacks/.
export const FEEDBACKS = Array.from({ length: 12 }, (_, i) => ({
  src: `/feedbacks/feedback${i + 1}.jpg`,
  alt: `رسالة طالب رقم ${i + 1}`,
}));

// Renders the masonry grid + click-to-zoom lightbox. The caller is
// responsible for the section heading / wrapping container so the gallery
// can drop into any layout (homepage testimonials, sessions page, etc).
export function FeedbackGallery({
  feedbacks = FEEDBACKS,
  tone = "dark",
}: {
  feedbacks?: readonly { src: string; alt: string }[];
  // "light" is used by the white offer landing pages; default keeps the dark
  // frames used on the homepage / sessions page.
  tone?: "dark" | "light";
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpenIndex(null), []);
  const next = React.useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i + 1) % feedbacks.length,
      ),
    [feedbacks.length],
  );
  const prev = React.useCallback(
    () =>
      setOpenIndex((i) =>
        i === null
          ? null
          : (i - 1 + feedbacks.length) % feedbacks.length,
      ),
    [feedbacks.length],
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
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
        {feedbacks.map((f, i) => (
          <FeedbackCard
            key={f.src}
            src={f.src}
            alt={f.alt}
            index={i}
            tone={tone}
            onOpen={() => setOpenIndex(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          src={feedbacks[openIndex].src}
          alt={feedbacks[openIndex].alt}
          index={openIndex}
          total={feedbacks.length}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </>
  );
}

function FeedbackCard({
  src,
  alt,
  index,
  tone,
  onOpen,
}: {
  src: string;
  alt: string;
  index: number;
  tone: "dark" | "light";
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`عرض ${alt}`}
      className={cn(
        "group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border shadow-[0_4px_18px_-12px_rgba(0,0,0,0.5)] transition-colors duration-200",
        tone === "light"
          ? "border-neutral-200 bg-white hover:border-[#4bbc63]/50"
          : "border-[var(--color-border)] bg-card hover:border-primary/40",
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur-md">
            <ZoomIn className="size-3" />
            عرض كامل
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md",
              tone === "light" ? "bg-[#1f5d2e]/90" : "bg-[var(--color-red-300)]/90",
            )}
          >
            #{toArabicNumerals(index + 1)}
          </span>
        </div>
      </div>
    </button>
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[80] grid place-items-center motion-safe:enter-fade"
    >
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-background/90 backdrop-blur-xl"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[min(92vw,560px)] flex-col items-center px-2">
        <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
          <Image
            src={src}
            alt={alt}
            width={1080}
            height={1620}
            className="block h-auto w-full"
            sizes="(max-width: 640px) 92vw, 560px"
            priority
          />
        </div>

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
    </div>
  );
}

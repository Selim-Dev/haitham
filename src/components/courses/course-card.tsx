import Image from "next/image";
import Link from "next/link";
import { Clock, Layers, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COURSE_LEVEL_AR, type CourseLevel } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatPrice, toArabicNumerals } from "@/lib/utils";
import { pickPriceForCountry } from "@/lib/pricing";

export type CourseCardData = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailUrl?: string;
  category: string;
  level: CourseLevel;
  lessonsCount: number;
  durationLabel?: string;
  price: number;
  currency: string;
  priceUsd?: number;
  featured?: boolean;
};

export function CourseCard({
  course,
  viewerCountry,
}: {
  course: CourseCardData;
  viewerCountry?: string;
}) {
  const priced = pickPriceForCountry(course, viewerCountry);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-elevated hover:shadow-[var(--shadow-red-glow)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-elevated">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#082434] via-[#0b0b0f] to-[#0b0b0f] text-primary/30">
            <span className="font-display text-6xl font-black">AH</span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent"
        />
        <div className="absolute right-3 top-3 flex gap-2">
          <Badge variant="glass">{course.category}</Badge>
          {course.featured && <Badge variant="primary">مميز</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground line-clamp-2">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {course.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Signal className="size-3.5" />
            {COURSE_LEVEL_AR[course.level]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {toArabicNumerals(course.lessonsCount)} درس
          </span>
          {course.durationLabel && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {course.durationLabel}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <span
            className="font-display text-xl font-extrabold text-foreground"
            dir={priced.isInternational ? "ltr" : undefined}
          >
            {formatPrice(priced.amount, priced.currency)}
          </span>
          <span className="text-sm font-semibold text-[var(--color-red-300)] transition-colors group-hover:text-primary">
            {COPY.courses.card.details}
            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

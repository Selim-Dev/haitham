"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Lock,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/arabic";
import { cn, formatDuration, toArabicNumerals } from "@/lib/utils";

export type CurriculumLesson = {
  id: string;
  title: string;
  description?: string;
  order: number;
  durationSeconds: number;
  isPreview: boolean;
};

export function CourseCurriculum({
  lessons,
  hasAccess,
}: {
  lessons: CurriculumLesson[];
  hasAccess: boolean;
}) {
  const [open, setOpen] = useState(true);

  const totalSeconds = lessons.reduce((s, l) => s + l.durationSeconds, 0);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5"
        aria-expanded={open}
      >
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {COPY.courseDetail.curriculum}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {toArabicNumerals(lessons.length)} درس · {formatDuration(totalSeconds)}
          </p>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5 text-muted transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-[var(--color-border)]">
          <ol className="divide-y divide-[var(--color-border)]">
            {lessons.map((lesson, i) => {
              // Enrolled users get the full dashboard player; non-enrolled
              // visitors can still open preview lessons via the public route.
              // Everything else stays locked.
              const href = hasAccess
                ? `/dashboard/lessons/${lesson.id}`
                : lesson.isPreview
                  ? `/lessons/${lesson.id}`
                  : null;
              const playable = href !== null;

              const body = (
                <>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-xs font-bold text-muted">
                    {toArabicNumerals(i + 1)}
                  </span>
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border bg-card",
                      playable
                        ? "border-primary/30 text-[var(--color-red-300)]"
                        : "border-[var(--color-border)] text-muted",
                    )}
                  >
                    {playable ? (
                      <PlayCircle className="size-4" />
                    ) : (
                      <Lock className="size-3.5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {lesson.title}
                    </p>
                    {lesson.description && (
                      <p className="mt-0.5 truncate text-xs text-muted-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {lesson.isPreview && (
                      <Badge variant="primary">
                        {COPY.courseDetail.preview}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-2">
                      {formatDuration(lesson.durationSeconds)}
                    </span>
                  </div>
                </>
              );

              return (
                <li key={lesson.id}>
                  {href ? (
                    <Link
                      href={href}
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-elevated"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      className="flex items-center gap-4 px-6 py-4 opacity-80"
                      title="اشترك في الكورس للوصول لهذا الدرس"
                    >
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

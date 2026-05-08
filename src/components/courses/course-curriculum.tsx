"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <ol className="divide-y divide-[var(--color-border)]">
              {lessons.map((lesson, i) => {
                const playable = hasAccess || lesson.isPreview;
                return (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-xs font-bold text-muted">
                      {toArabicNumerals(i + 1)}
                    </span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-card text-muted">
                      {playable ? (
                        <PlayCircle className="size-4 text-[var(--color-red-300)]" />
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
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

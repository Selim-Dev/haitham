import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, ChevronLeft, Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ProtectedVideoPlayer } from "@/components/video/protected-video-player";
import { Logo } from "@/components/layout/logo";
import { connectDB } from "@/lib/db";
import { LessonModel } from "@/models/Lesson";
import { CourseModel } from "@/models/Course";
import { EnrollmentModel } from "@/models/Enrollment";
import { getCurrentUser } from "@/lib/auth";
import { COPY } from "@/lib/arabic";
import { cn, formatDuration, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/dashboard/lessons/${lessonId}`);

  await connectDB();
  const lesson = await LessonModel.findById(lessonId).lean();
  if (!lesson || !lesson.isPublished) notFound();

  const course = await CourseModel.findById(lesson.courseId).lean();
  if (!course) notFound();

  const lessons = await LessonModel.find({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const idx = lessons.findIndex((l) => String(l._id) === String(lesson._id));
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  // Access check on the page itself for early redirect — the API will re-check too.
  const enrollment = await EnrollmentModel.findOne({
    userId: user.id,
    courseId: lesson.courseId,
    status: "ACTIVE",
  }).lean();

  if (!enrollment && !lesson.isPreview) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-[var(--color-border)] bg-background/80 backdrop-blur-xl">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <Logo size="md" />
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard">العودة للوحة التعلم</Link>
              </Button>
            </div>
          </Container>
        </header>
        <Container className="flex flex-1 items-center justify-center py-16">
          <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-10 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-[var(--color-red-300)]">
              <Lock className="size-6" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-foreground">
              {COPY.dashboard.accessDeniedLesson}
            </h1>
            <Button asChild variant="primary" className="mt-6">
              <Link href={`/courses/${course.slug}`}>تفاصيل الكورس</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-background/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Logo size="md" />
            <Button asChild variant="secondary" size="sm">
              <Link href={`/courses/${course.slug}`}>صفحة الكورس</Link>
            </Button>
          </div>
        </Container>
      </header>

      <Container className="flex flex-col gap-6 py-6 lg:flex-row lg:gap-8 lg:py-10">
        <main className="min-w-0 flex-1 flex flex-col gap-6">
          <div>
            <Link
              href={`/courses/${course.slug}`}
              className="text-sm text-muted hover:text-foreground"
            >
              {course.title}
            </Link>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
          </div>

          <ProtectedVideoPlayer lessonId={String(lesson._id)} />

          <p className="rounded-xl border border-[var(--color-border)] bg-card p-3 text-xs leading-relaxed text-muted">
            {COPY.dashboard.videoProtected}
          </p>

          {lesson.description && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
              <h2 className="font-display text-base font-bold text-foreground">
                وصف الدرس
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                {lesson.description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            {prev ? (
              <Button asChild variant="ghost" size="md">
                <Link href={`/dashboard/lessons/${String(prev._id)}`}>
                  <ChevronRight className="size-4" />
                  {COPY.common.previous}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next && (
              <Button asChild variant="primary" size="md">
                <Link href={`/dashboard/lessons/${String(next._id)}`}>
                  {COPY.common.next}
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </main>

        <aside className="lg:w-80 shrink-0">
          <div className="rounded-2xl border border-[var(--color-border)] bg-card">
            <div className="border-b border-[var(--color-border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-2">
                محتوى الكورس
              </p>
              <p className="mt-1 line-clamp-1 font-display text-base font-bold text-foreground">
                {course.title}
              </p>
              <p className="mt-1 text-xs text-muted">
                {toArabicNumerals(lessons.length)} درس
              </p>
            </div>
            <ol className="max-h-[60vh] overflow-y-auto py-2">
              {lessons.map((l, i) => {
                const active = String(l._id) === String(lesson._id);
                return (
                  <li key={String(l._id)}>
                    <Link
                      href={`/dashboard/lessons/${String(l._id)}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted hover:bg-elevated hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-elevated text-muted",
                        )}
                      >
                        {toArabicNumerals(i + 1)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {l.title}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-2">
                        {l.isPreview && (
                          <Badge variant="primary" className="px-2 py-0.5 text-[10px]">
                            تجريبي
                          </Badge>
                        )}
                        {l.durationSeconds > 0 && (
                          <span>{formatDuration(l.durationSeconds)}</span>
                        )}
                        {active && (
                          <PlayCircle className="size-4 text-[var(--color-red-300)]" />
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </Container>
    </div>
  );
}

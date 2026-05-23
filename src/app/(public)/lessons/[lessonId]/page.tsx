import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Lock, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ProtectedVideoPlayer } from "@/components/video/protected-video-player";
import { connectDB } from "@/lib/db";
import { LessonModel } from "@/models/Lesson";
import { CourseModel } from "@/models/Course";
import { EnrollmentModel } from "@/models/Enrollment";
import { getCurrentUser } from "@/lib/auth";
import { cn, formatDuration, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Public preview-lesson route. The dashboard lesson page lives under
// /dashboard/* which is auth-gated by the middleware + dashboard layout, so
// preview lessons are unreachable to logged-out visitors there. This route
// sits in the (public) layout — no middleware match, no auth shell — and
// only serves lessons where isPreview === true. Enrolled users are
// forwarded to the dashboard lesson page so their watch-progress + sidebar
// experience is preserved.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  await connectDB();
  const lesson = await LessonModel.findById(lessonId).lean();
  if (!lesson || !lesson.isPublished || !lesson.isPreview) {
    return { title: "درس غير متاح" };
  }
  return {
    title: `${lesson.title} — درس تجريبي`,
    description: lesson.description,
  };
}

export default async function PublicLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  await connectDB();
  const lesson = await LessonModel.findById(lessonId).lean();
  if (!lesson || !lesson.isPublished) notFound();

  const course = await CourseModel.findById(lesson.courseId).lean();
  if (!course) notFound();

  // Non-preview lessons never serve here. Send users back to the course
  // detail page where the enroll CTA lives.
  if (!lesson.isPreview) {
    redirect(`/courses/${course.slug}`);
  }

  // If the visitor is logged in and enrolled, route them into the full
  // dashboard experience — they don't need the "preview" framing.
  const user = await getCurrentUser();
  if (user) {
    const enrollment = await EnrollmentModel.findOne({
      userId: user.id,
      courseId: lesson.courseId,
      status: "ACTIVE",
    }).lean();
    if (enrollment) {
      redirect(`/dashboard/lessons/${lessonId}`);
    }
  }

  const lessons = await LessonModel.find({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return (
    <Container className="flex flex-col gap-6 py-8 lg:flex-row lg:gap-8 lg:py-12">
      <main className="min-w-0 flex-1 flex flex-col gap-6">
        <div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm text-muted hover:text-foreground"
          >
            {course.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
            <Badge variant="primary">
              <Sparkles className="size-3" />
              درس تجريبي
            </Badge>
          </div>
        </div>

        <ProtectedVideoPlayer lessonId={String(lesson._id)} />

        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            عجبك الدرس؟ افتح الكورس بالكامل
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            هذا درس تجريبي مجاني. للوصول لباقي الدروس
            ({toArabicNumerals(lessons.length - 1)} درس إضافي)، اشترك في الكورس
            الآن.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="primary" size="md">
              <Link href={`/courses/${course.slug}`}>
                تفاصيل الكورس والاشتراك
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="secondary" size="md">
                <Link href={`/login?next=/courses/${course.slug}`}>
                  تسجيل الدخول
                </Link>
              </Button>
            )}
          </div>
        </div>

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
              const isPreview = l.isPreview;
              const content = (
                <>
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
                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-2">
                    {isPreview ? (
                      <Badge variant="primary" className="px-2 py-0.5 text-[10px]">
                        تجريبي
                      </Badge>
                    ) : (
                      <Lock className="size-3.5" />
                    )}
                    {l.durationSeconds > 0 && (
                      <span>{formatDuration(l.durationSeconds)}</span>
                    )}
                    {active && (
                      <PlayCircle className="size-4 text-[var(--color-red-300)]" />
                    )}
                  </span>
                </>
              );
              return (
                <li key={String(l._id)}>
                  {isPreview ? (
                    <Link
                      href={`/lessons/${String(l._id)}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted hover:bg-elevated hover:text-foreground",
                      )}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      className="flex cursor-not-allowed items-center gap-3 px-3 py-2.5 text-sm text-muted-2 opacity-60"
                      title="اشترك للوصول لهذا الدرس"
                    >
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </Container>
  );
}

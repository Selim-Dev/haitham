import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Layers, Signal, Clock, Infinity as InfinityIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { CourseCurriculum } from "@/components/courses/course-curriculum";
import { CourseCta } from "@/components/courses/course-cta";
import { getCourseBySlug } from "@/services/course.service";
import { getCurrentUser } from "@/lib/auth";
import { getAccessStateForCourse } from "@/services/enrollment.service";
import { COURSE_LEVEL_AR } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import {
  formatDuration,
  formatPrice,
  toArabicNumerals,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "كورس غير موجود" };
  return {
    title: course.title,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }

  const accessState = await getAccessStateForCourse(user?.id ?? null, course.id);
  const totalDuration = course.lessons.reduce(
    (s, l) => s + l.durationSeconds,
    0,
  );

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant="glass">
                <Signal className="size-3" />
                {COURSE_LEVEL_AR[course.level]}
              </Badge>
              {course.featured && <Badge variant="primary">مميز</Badge>}
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {course.shortDescription}
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-elevated">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a0408] via-[#0b0b0f] to-[#0b0b0f] text-primary/30">
                <span className="font-display text-8xl font-black">AH</span>
              </div>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
            />
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              {COPY.courseDetail.description}
            </h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {course.description}
            </div>
          </div>

          <CourseCurriculum
            lessons={course.lessons}
            hasAccess={accessState === "ENROLLED"}
          />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-end justify-between">
              <span className="font-display text-3xl font-extrabold text-foreground">
                {formatPrice(course.price, course.currency)}
              </span>
              <Badge variant="success">
                <InfinityIcon className="size-3" />
                {COPY.courseDetail.lifetimeAccess}
              </Badge>
            </div>

            <CourseCta
              state={accessState}
              courseId={course.id}
              courseSlug={course.slug}
              externalCourseUrl={course.externalCourseUrl}
              externalAccessNote={course.externalAccessNote}
            />

            <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <Layers className="size-4 text-[var(--color-red-300)]" />
                <span>
                  {toArabicNumerals(course.lessons.length)}{" "}
                  {COPY.courses.card.lessons.split(" ")[1]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Clock className="size-4 text-[var(--color-red-300)]" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Signal className="size-4 text-[var(--color-red-300)]" />
                <span>{COURSE_LEVEL_AR[course.level]}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <InfinityIcon className="size-4 text-[var(--color-red-300)]" />
                <span>مدى الحياة</span>
              </div>
            </div>

            <p className="rounded-lg border border-[var(--color-border)] bg-surface p-3 text-xs leading-relaxed text-muted">
              {COPY.security.accessNote}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

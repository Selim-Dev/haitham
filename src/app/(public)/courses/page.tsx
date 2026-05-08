import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listPublishedCourses,
  getDistinctCategories,
} from "@/services/course.service";
import { courseListQuerySchema } from "@/validators/course.validator";
import { COPY } from "@/lib/arabic";
import { toArabicNumerals } from "@/lib/utils";

export const metadata: Metadata = { title: COPY.courses.pageTitle };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function flattenSearchParams(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v)) out[k] = v[0] ?? "";
    else if (v !== undefined) out[k] = v;
  }
  return out;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = flattenSearchParams(raw);
  const parsed = courseListQuerySchema.safeParse(params);
  const query = parsed.success ? parsed.data : { sort: "newest" as const, page: 1, limit: 12 };

  const [{ items, total }, categories] = await Promise.all([
    listPublishedCourses(query),
    getDistinctCategories(),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="font-display text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {COPY.courses.pageTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          اختر الكورس الذي يلبي مستواك واهتمامك. كل الكورسات تأتي بوصول مدى
          الحياة بعد الموافقة على الدفع.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <CourseFilters categories={categories} />
      </Suspense>

      <div className="mt-6 text-sm text-muted-2">
        {toArabicNumerals(total)} {total === 1 ? "كورس" : "كورسات"}
      </div>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={COPY.courses.empty} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { listMyEnrollments } from "@/services/enrollment.service";
import type { CourseLevel } from "@/lib/constants";
import { COPY } from "@/lib/arabic";

export const metadata: Metadata = { title: COPY.dashboard.myCourses };
export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/my-courses");

  const enrollments = await listMyEnrollments(user.id).catch(() => []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.dashboard.myCourses}
        </h1>
        <p className="mt-2 text-sm text-muted">
          كل الكورسات التي تملك وصولًا لها مدى الحياة.
        </p>
      </header>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="size-6" />}
          title={COPY.dashboard.noEnrollments}
          action={
            <Button asChild variant="primary">
              <Link href="/courses">تصفح الكورسات</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <CourseCard
              key={e.enrollmentId}
              course={{
                id: e.course.id,
                slug: e.course.slug,
                title: e.course.title,
                shortDescription: e.course.shortDescription,
                thumbnailUrl: e.course.thumbnailUrl,
                category: e.course.category,
                level: e.course.level as CourseLevel,
                lessonsCount: e.course.lessonsCount,
                durationLabel: e.course.durationLabel,
                price: e.course.price,
                currency: e.course.currency,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

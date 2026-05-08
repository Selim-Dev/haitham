import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminCourses } from "@/services/admin-course.service";
import { COURSE_LEVEL_AR, type CourseLevel } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatPrice, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await listAdminCourses().catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.admin.courses}
          </h1>
          <p className="mt-2 text-sm text-muted">
            إنشاء، تعديل، نشر، وحذف الكورسات.
          </p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/courses/new">
            <Plus className="size-4" />
            {COPY.admin.addCourse}
          </Link>
        </Button>
      </header>

      {courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" />}
          title="لا توجد كورسات"
          description="ابدأ بإنشاء كورسك الأول."
          action={
            <Button asChild variant="primary">
              <Link href="/admin/courses/new">
                <Plus className="size-4" />
                {COPY.admin.addCourse}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <table className="w-full">
            <thead className="bg-elevated text-xs uppercase tracking-wider text-muted-2">
              <tr>
                <th className="p-4 text-start font-semibold">الكورس</th>
                <th className="hidden p-4 text-start font-semibold sm:table-cell">
                  التصنيف
                </th>
                <th className="hidden p-4 text-start font-semibold md:table-cell">
                  المستوى
                </th>
                <th className="hidden p-4 text-start font-semibold md:table-cell">
                  السعر
                </th>
                <th className="p-4 text-start font-semibold">الحالة</th>
                <th className="p-4 text-end font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-elevated/60">
                  <td className="p-4">
                    <div className="font-semibold text-foreground">
                      {c.title}
                    </div>
                    <div dir="ltr" className="text-xs text-muted-2">
                      {c.slug} · {toArabicNumerals(c.lessonsCount)} درس
                    </div>
                  </td>
                  <td className="hidden p-4 text-muted sm:table-cell">
                    {c.category}
                  </td>
                  <td className="hidden p-4 text-muted md:table-cell">
                    {COURSE_LEVEL_AR[c.level as CourseLevel]}
                  </td>
                  <td className="hidden p-4 text-foreground md:table-cell">
                    {formatPrice(c.price, c.currency)}
                  </td>
                  <td className="p-4">
                    {c.isPublished ? (
                      <Badge variant="success">{COPY.admin.course.published}</Badge>
                    ) : (
                      <Badge variant="outline">{COPY.admin.course.draft}</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/courses/${c.id}/lessons`}>
                          {COPY.admin.course.manageLessons}
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/courses/${c.id}/edit`}>
                          {COPY.admin.course.edit}
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

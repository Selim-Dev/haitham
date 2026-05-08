import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CourseForm } from "@/components/admin/course-form";
import { getAdminCourse } from "@/services/admin-course.service";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getAdminCourse(id);
  if (!course) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/courses" className="hover:text-foreground">
          {COPY.admin.courses}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">تعديل: {course.title}</span>
      </div>
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          تعديل الكورس
        </h1>
      </header>
      <CourseForm
        mode="edit"
        courseId={course.id}
        initial={{
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          price: course.price,
          currency: course.currency,
          thumbnailUrl: course.thumbnailUrl,
          category: course.category,
          level: course.level as never,
          durationLabel: course.durationLabel,
          isPublished: course.isPublished,
          featured: course.featured,
          externalCourseUrl: course.externalCourseUrl,
          externalAccessNote: course.externalAccessNote,
        }}
      />
    </div>
  );
}

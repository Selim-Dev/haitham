import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { LessonManager } from "@/components/admin/lesson-manager";
import {
  getAdminCourse,
  listLessonsAdmin,
} from "@/services/admin-course.service";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getAdminCourse(id);
  if (!course) notFound();
  const lessons = await listLessonsAdmin(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/courses" className="hover:text-foreground">
          {COPY.admin.courses}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground line-clamp-1">{course.title}</span>
      </div>
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.lessons}
        </h1>
        <p className="mt-2 text-sm text-muted">{course.title}</p>
      </header>

      <LessonManager
        courseId={course.id}
        initialLessons={lessons.map((l) => ({
          id: l.id,
          courseId: l.courseId,
          title: l.title,
          description: l.description,
          order: l.order,
          videoProvider: l.videoProvider as never,
          videoAssetId: l.videoAssetId,
          durationSeconds: l.durationSeconds,
          isPreview: l.isPreview,
          isPublished: l.isPublished,
        }))}
      />
    </div>
  );
}

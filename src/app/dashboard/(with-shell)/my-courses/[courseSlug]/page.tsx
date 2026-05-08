import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { connectDB } from "@/lib/db";
import { CourseModel } from "@/models/Course";
import { LessonModel } from "@/models/Lesson";
import { EnrollmentModel } from "@/models/Enrollment";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Entry point when a student clicks "ابدأ التعلم" on a course they own.
 * Verifies enrollment, finds the first published lesson, and forwards to it.
 * If the course has no lessons yet, shows a friendly empty state.
 */
export default async function StartCoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/dashboard/my-courses/${courseSlug}`);
  }

  await connectDB();
  const course = await CourseModel.findOne({ slug: courseSlug }).lean();
  if (!course) notFound();

  const enrollment = await EnrollmentModel.findOne({
    userId: user.id,
    courseId: course._id,
    status: "ACTIVE",
  }).lean();
  if (!enrollment) {
    // Not enrolled — bounce them to the public course page where they can subscribe.
    redirect(`/courses/${courseSlug}`);
  }

  const firstLesson = await LessonModel.findOne({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  if (firstLesson) {
    redirect(`/dashboard/lessons/${String(firstLesson._id)}`);
  }

  // Enrolled but no lessons published yet.
  return (
    <div className="py-8">
      <EmptyState
        icon={<BookOpen className="size-6" />}
        title="الكورس قيد الإعداد"
        description="لم يتم نشر الدروس بعد. سيتم إعلامك حين يصبح المحتوى جاهزًا."
        action={
          <Button asChild variant="primary">
            <Link href="/dashboard/my-courses">العودة لكورساتي</Link>
          </Button>
        }
      />
    </div>
  );
}

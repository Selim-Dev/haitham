import { connectDB } from "@/lib/db";
import { LessonModel, type ILesson } from "@/models/Lesson";
import { CourseModel } from "@/models/Course";
import { EnrollmentModel } from "@/models/Enrollment";
import { WatchProgressModel } from "@/models/WatchProgress";
import { getVideoProvider, type PlaybackData } from "@/services/video/video.service";
import type { SessionUser } from "@/lib/auth";
import type { VideoProviderName } from "@/lib/constants";

export async function getLessonPlayback(
  lessonId: string,
  user: SessionUser | null,
): Promise<{
  lesson: {
    id: string;
    title: string;
    description?: string;
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    isPreview: boolean;
    durationSeconds: number;
  };
  playback: PlaybackData;
  progressSeconds: number;
}> {
  await connectDB();

  const lesson = await LessonModel.findById(lessonId).lean<ILesson>();
  if (!lesson || !lesson.isPublished) {
    throw Object.assign(new Error("الدرس غير متاح"), { status: 404 });
  }

  const course = await CourseModel.findById(lesson.courseId).lean();
  if (!course) {
    throw Object.assign(new Error("الكورس غير متاح"), { status: 404 });
  }

  // Access control: preview is open; otherwise must have ACTIVE enrollment.
  if (!lesson.isPreview) {
    if (!user) {
      throw Object.assign(new Error("يجب تسجيل الدخول"), { status: 401 });
    }
    const enrollment = await EnrollmentModel.findOne({
      userId: user.id,
      courseId: lesson.courseId,
      status: "ACTIVE",
    }).lean();
    if (!enrollment) {
      throw Object.assign(
        new Error("لا تملك صلاحية مشاهدة هذا الدرس"),
        { status: 403 },
      );
    }
  }

  const provider = getVideoProvider(lesson.videoProvider as VideoProviderName);
  const playback = await provider.getPlaybackData({
    videoAssetId: lesson.videoAssetId,
    user: {
      id: user?.id ?? "preview",
      name: user?.name ?? "Preview",
      email: user?.email ?? "preview@anonymous",
      phone: user?.phone,
    },
  });

  let progressSeconds = 0;
  if (user) {
    const wp = await WatchProgressModel.findOne({
      userId: user.id,
      lessonId: lesson._id,
    }).lean();
    progressSeconds = wp?.progressSeconds ?? 0;
  }

  return {
    lesson: {
      id: String(lesson._id),
      title: lesson.title,
      description: lesson.description,
      courseId: String(lesson.courseId),
      courseSlug: course.slug,
      courseTitle: course.title,
      isPreview: lesson.isPreview,
      durationSeconds: lesson.durationSeconds,
    },
    playback,
    progressSeconds,
  };
}

export async function listLessonsForCourse(courseId: string) {
  await connectDB();
  return LessonModel.find({ courseId, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
}

export async function upsertWatchProgress(
  userId: string,
  lessonId: string,
  progressSeconds: number,
  completed: boolean,
) {
  await connectDB();
  await WatchProgressModel.findOneAndUpdate(
    { userId, lessonId },
    {
      $set: {
        progressSeconds: Math.max(0, Math.floor(progressSeconds)),
        completed,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
}

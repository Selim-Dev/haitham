import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CourseModel } from "@/models/Course";
import { LessonModel } from "@/models/Lesson";
import { AuditLogModel } from "@/models/AuditLog";
import type { CourseInput } from "@/validators/course.validator";
import type { LessonInput } from "@/validators/lesson.validator";
import { slugify } from "@/lib/utils";

async function audit(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(input.actorId),
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
  });
}

export async function listAdminCourses() {
  await connectDB();
  const docs = await CourseModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((c) => ({
    id: String(c._id),
    title: c.title,
    slug: c.slug,
    category: c.category,
    level: c.level,
    price: c.price,
    currency: c.currency,
    isPublished: c.isPublished,
    featured: c.featured,
    lessonsCount: c.lessonsCount,
    createdAt: c.createdAt,
  }));
}

export async function getAdminCourse(id: string) {
  await connectDB();
  const course = await CourseModel.findById(id).lean();
  if (!course) return null;
  return {
    id: String(course._id),
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    price: course.price,
    currency: course.currency,
    thumbnailUrl: course.thumbnailUrl,
    category: course.category,
    level: course.level,
    durationLabel: course.durationLabel,
    isPublished: course.isPublished,
    featured: course.featured,
    lessonsCount: course.lessonsCount,
  };
}

export async function createAdminCourse(input: CourseInput, actorId: string) {
  await connectDB();
  const slug = (input.slug?.trim() || slugify(input.title)) as string;
  const exists = await CourseModel.findOne({ slug }).lean();
  if (exists) {
    throw Object.assign(new Error("الـ slug مستخدم بالفعل"), { status: 409 });
  }
  const created = await CourseModel.create({
    ...input,
    slug,
    createdBy: new mongoose.Types.ObjectId(actorId),
    lessonsCount: 0,
  });
  await audit({
    actorId,
    action: "COURSE_CREATED",
    entityType: "Course",
    entityId: String(created._id),
    metadata: { title: created.title, slug: created.slug },
  });
  return { id: String(created._id), slug: created.slug };
}

export async function updateAdminCourse(
  id: string,
  input: CourseInput,
  actorId: string,
) {
  await connectDB();
  const slug = (input.slug?.trim() || slugify(input.title)) as string;
  const conflict = await CourseModel.findOne({ slug, _id: { $ne: id } }).lean();
  if (conflict) {
    throw Object.assign(new Error("الـ slug مستخدم بالفعل"), { status: 409 });
  }
  const updated = await CourseModel.findByIdAndUpdate(
    id,
    { $set: { ...input, slug } },
    { new: true },
  ).lean();
  if (!updated) {
    throw Object.assign(new Error("الكورس غير موجود"), { status: 404 });
  }
  await audit({
    actorId,
    action: "COURSE_UPDATED",
    entityType: "Course",
    entityId: String(updated._id),
  });
  return { id: String(updated._id), slug: updated.slug };
}

export async function deleteAdminCourse(id: string, actorId: string) {
  await connectDB();
  const deleted = await CourseModel.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw Object.assign(new Error("الكورس غير موجود"), { status: 404 });
  }
  await LessonModel.deleteMany({ courseId: deleted._id });
  await audit({
    actorId,
    action: "COURSE_DELETED",
    entityType: "Course",
    entityId: String(deleted._id),
    metadata: { title: deleted.title },
  });
  return { id: String(deleted._id) };
}

// ----- Lessons -----

export async function listLessonsAdmin(courseId: string) {
  await connectDB();
  const lessons = await LessonModel.find({ courseId })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return lessons.map((l) => ({
    id: String(l._id),
    courseId: String(l.courseId),
    title: l.title,
    description: l.description,
    order: l.order,
    videoProvider: l.videoProvider,
    videoAssetId: l.videoAssetId,
    durationSeconds: l.durationSeconds,
    isPreview: l.isPreview,
    isPublished: l.isPublished,
  }));
}

async function refreshLessonsCount(courseId: string) {
  const count = await LessonModel.countDocuments({ courseId, isPublished: true });
  await CourseModel.findByIdAndUpdate(courseId, { lessonsCount: count });
}

export async function createAdminLesson(input: LessonInput, actorId: string) {
  await connectDB();
  const created = await LessonModel.create(input);
  await refreshLessonsCount(input.courseId);
  await audit({
    actorId,
    action: "LESSON_CREATED",
    entityType: "Lesson",
    entityId: String(created._id),
    metadata: { courseId: input.courseId, title: input.title },
  });
  return { id: String(created._id) };
}

export async function updateAdminLesson(
  id: string,
  input: Partial<LessonInput>,
  actorId: string,
) {
  await connectDB();
  const updated = await LessonModel.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true },
  ).lean();
  if (!updated) {
    throw Object.assign(new Error("الدرس غير موجود"), { status: 404 });
  }
  await refreshLessonsCount(String(updated.courseId));
  await audit({
    actorId,
    action: "LESSON_UPDATED",
    entityType: "Lesson",
    entityId: String(updated._id),
  });
  return { id: String(updated._id) };
}

export async function deleteAdminLesson(id: string, actorId: string) {
  await connectDB();
  const deleted = await LessonModel.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw Object.assign(new Error("الدرس غير موجود"), { status: 404 });
  }
  await refreshLessonsCount(String(deleted.courseId));
  await audit({
    actorId,
    action: "LESSON_DELETED",
    entityType: "Lesson",
    entityId: String(deleted._id),
  });
  return { id: String(deleted._id) };
}

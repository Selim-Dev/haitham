import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { EnrollmentModel } from "@/models/Enrollment";
import { CourseModel } from "@/models/Course";
import { AuditLogModel } from "@/models/AuditLog";

export async function listAdminUsers() {
  await connectDB();
  const users = await UserModel.find({}).sort({ createdAt: -1 }).lean();
  if (users.length === 0) return [];
  const counts = await EnrollmentModel.aggregate<{
    _id: mongoose.Types.ObjectId;
    count: number;
  }>([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c.count]));
  return users.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isBlocked: u.isBlocked,
    createdAt: u.createdAt,
    activeEnrollments: map.get(String(u._id)) ?? 0,
  }));
}

export async function setUserBlocked(
  userId: string,
  blocked: boolean,
  actorId: string,
) {
  await connectDB();
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { isBlocked: blocked } },
    { new: true },
  ).lean();
  if (!user) {
    throw Object.assign(new Error("المستخدم غير موجود"), { status: 404 });
  }
  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: blocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
    entityType: "User",
    entityId: String(user._id),
  });
  return { id: String(user._id), isBlocked: user.isBlocked };
}

export async function listAdminEnrollments() {
  await connectDB();
  const enrollments = await EnrollmentModel.find({})
    .sort({ createdAt: -1 })
    .lean();
  if (enrollments.length === 0) return [];

  const userIds = [...new Set(enrollments.map((e) => String(e.userId)))];
  const courseIds = [...new Set(enrollments.map((e) => String(e.courseId)))];
  const [users, courses] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }).lean(),
    CourseModel.find({ _id: { $in: courseIds } }).lean(),
  ]);
  const uMap = new Map(users.map((u) => [String(u._id), u]));
  const cMap = new Map(courses.map((c) => [String(c._id), c]));

  return enrollments.map((e) => ({
    id: String(e._id),
    status: e.status,
    accessType: e.accessType,
    createdAt: e.createdAt,
    user: uMap.get(String(e.userId))
      ? {
          id: String(e.userId),
          name: uMap.get(String(e.userId))!.name,
          email: uMap.get(String(e.userId))!.email,
        }
      : null,
    course: cMap.get(String(e.courseId))
      ? {
          id: String(e.courseId),
          title: cMap.get(String(e.courseId))!.title,
          slug: cMap.get(String(e.courseId))!.slug,
        }
      : null,
  }));
}

export async function revokeEnrollment(
  enrollmentId: string,
  actorId: string,
) {
  await connectDB();
  const updated = await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    { $set: { status: "REVOKED" } },
    { new: true },
  ).lean();
  if (!updated) {
    throw Object.assign(new Error("الاشتراك غير موجود"), { status: 404 });
  }
  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "ENROLLMENT_REVOKED",
    entityType: "Enrollment",
    entityId: String(updated._id),
  });
  return { id: String(updated._id) };
}

import { connectDB } from "@/lib/db";
import { EnrollmentModel } from "@/models/Enrollment";
import { PaymentProofModel } from "@/models/PaymentProof";
import { CourseModel } from "@/models/Course";

export type AccessState =
  | "GUEST"
  | "NONE"
  | "PENDING"
  | "REJECTED"
  | "ENROLLED";

export async function getAccessStateForCourse(
  userId: string | null,
  courseId: string,
): Promise<AccessState> {
  if (!userId) return "GUEST";
  await connectDB();

  const enrollment = await EnrollmentModel.findOne({
    userId,
    courseId,
    status: "ACTIVE",
  }).lean();
  if (enrollment) return "ENROLLED";

  const proofs = await PaymentProofModel.find({ userId, courseId })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
  const last = proofs[0];
  if (!last) return "NONE";
  if (last.status === "PENDING") return "PENDING";
  if (last.status === "REJECTED") return "REJECTED";
  return "NONE";
}

export async function listMyEnrollments(userId: string) {
  await connectDB();
  const enrollments = await EnrollmentModel.find({
    userId,
    status: "ACTIVE",
  })
    .sort({ createdAt: -1 })
    .lean();

  if (enrollments.length === 0) return [];

  const courseIds = enrollments.map((e) => e.courseId);
  const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean();
  const map = new Map(courses.map((c) => [String(c._id), c]));

  return enrollments
    .map((e) => {
      const course = map.get(String(e.courseId));
      if (!course) return null;
      return {
        enrollmentId: String(e._id),
        course: {
          id: String(course._id),
          slug: course.slug,
          title: course.title,
          shortDescription: course.shortDescription,
          thumbnailUrl: course.thumbnailUrl,
          category: course.category,
          level: course.level,
          lessonsCount: course.lessonsCount,
          durationLabel: course.durationLabel,
          price: course.price,
          currency: course.currency,
        },
        enrolledAt: e.createdAt,
      };
    })
    .filter(<T>(x: T | null): x is T => x !== null);
}

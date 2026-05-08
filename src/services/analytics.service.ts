import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { CourseModel } from "@/models/Course";
import { PaymentProofModel } from "@/models/PaymentProof";
import { EnrollmentModel } from "@/models/Enrollment";

export type AdminDashboardStats = {
  totalUsers: number;
  totalCourses: number;
  pendingPayments: number;
  activeEnrollments: number;
};

export async function getAdminStats(): Promise<AdminDashboardStats> {
  try {
    await connectDB();
  } catch {
    return {
      totalUsers: 0,
      totalCourses: 0,
      pendingPayments: 0,
      activeEnrollments: 0,
    };
  }

  const [totalUsers, totalCourses, pendingPayments, activeEnrollments] =
    await Promise.all([
      UserModel.countDocuments({}),
      CourseModel.countDocuments({}),
      PaymentProofModel.countDocuments({ status: "PENDING" }),
      EnrollmentModel.countDocuments({ status: "ACTIVE" }),
    ]);

  return { totalUsers, totalCourses, pendingPayments, activeEnrollments };
}

export async function getRecentPaymentProofs(limit: number = 6) {
  try {
    await connectDB();
  } catch {
    return [];
  }
  const proofs = await PaymentProofModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  if (proofs.length === 0) return [];

  const userIds = [...new Set(proofs.map((p) => String(p.userId)))];
  const courseIds = [...new Set(proofs.map((p) => String(p.courseId)))];
  const [users, courses] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }).lean(),
    CourseModel.find({ _id: { $in: courseIds } }).lean(),
  ]);
  const uMap = new Map(users.map((u) => [String(u._id), u]));
  const cMap = new Map(courses.map((c) => [String(c._id), c]));

  return proofs.map((p) => ({
    id: String(p._id),
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    createdAt: p.createdAt,
    user: uMap.get(String(p.userId))
      ? {
          id: String(p.userId),
          name: uMap.get(String(p.userId))!.name,
          email: uMap.get(String(p.userId))!.email,
        }
      : null,
    course: cMap.get(String(p.courseId))
      ? {
          id: String(p.courseId),
          title: cMap.get(String(p.courseId))!.title,
        }
      : null,
  }));
}

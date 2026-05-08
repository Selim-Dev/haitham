import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { PaymentProofModel } from "@/models/PaymentProof";
import { EnrollmentModel } from "@/models/Enrollment";
import { CourseModel } from "@/models/Course";
import { UserModel } from "@/models/User";
import { AuditLogModel } from "@/models/AuditLog";
import type { PaymentStatus } from "@/lib/constants";

export async function listAdminPaymentProofs(filter: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}) {
  await connectDB();
  const q: Record<string, unknown> = {};
  if (filter.status) q.status = filter.status;
  const limit = filter.limit ?? 20;
  const page = filter.page ?? 1;
  const skip = (page - 1) * limit;

  const [proofs, total] = await Promise.all([
    PaymentProofModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    PaymentProofModel.countDocuments(q),
  ]);

  if (proofs.length === 0) return { items: [], total };

  const userIds = [...new Set(proofs.map((p) => String(p.userId)))];
  const courseIds = [...new Set(proofs.map((p) => String(p.courseId)))];
  const [users, courses] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }).lean(),
    CourseModel.find({ _id: { $in: courseIds } }).lean(),
  ]);
  const uMap = new Map(users.map((u) => [String(u._id), u]));
  const cMap = new Map(courses.map((c) => [String(c._id), c]));

  return {
    items: proofs.map((p) => ({
      id: String(p._id),
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      transactionReference: p.transactionReference,
      receiptUrl: p.receiptUrl,
      createdAt: p.createdAt,
      reviewedAt: p.reviewedAt,
      adminNote: p.adminNote,
      user: uMap.get(String(p.userId))
        ? {
            id: String(p.userId),
            name: uMap.get(String(p.userId))!.name,
            email: uMap.get(String(p.userId))!.email,
            phone: uMap.get(String(p.userId))!.phone,
          }
        : null,
      course: cMap.get(String(p.courseId))
        ? {
            id: String(p.courseId),
            title: cMap.get(String(p.courseId))!.title,
            slug: cMap.get(String(p.courseId))!.slug,
            thumbnailUrl: cMap.get(String(p.courseId))!.thumbnailUrl,
          }
        : null,
    })),
    total,
  };
}

export async function getAdminPaymentProof(id: string) {
  await connectDB();
  const proof = await PaymentProofModel.findById(id).lean();
  if (!proof) return null;
  const [user, course] = await Promise.all([
    UserModel.findById(proof.userId).lean(),
    CourseModel.findById(proof.courseId).lean(),
  ]);
  return {
    id: String(proof._id),
    amount: proof.amount,
    currency: proof.currency,
    status: proof.status,
    transactionReference: proof.transactionReference,
    userNote: proof.userNote,
    receiptUrl: proof.receiptUrl,
    createdAt: proof.createdAt,
    reviewedAt: proof.reviewedAt,
    adminNote: proof.adminNote,
    user: user
      ? {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      : null,
    course: course
      ? {
          id: String(course._id),
          title: course.title,
          slug: course.slug,
          price: course.price,
          currency: course.currency,
          thumbnailUrl: course.thumbnailUrl,
        }
      : null,
  };
}

export async function approvePaymentProof(input: {
  proofId: string;
  adminId: string;
  adminNote?: string;
}) {
  await connectDB();

  // Try to use a transaction (requires replica set / Atlas). Fall back to non-tx
  // when transactions aren't supported (single-node dev MongoDB).
  const useTransaction = mongoose.connection.readyState === 1;
  let session: mongoose.ClientSession | null = null;

  if (useTransaction) {
    try {
      session = await mongoose.startSession();
    } catch {
      session = null;
    }
  }

  const run = async () => {
    const proof = await PaymentProofModel.findById(input.proofId).session(
      session ?? null,
    );
    if (!proof) {
      throw Object.assign(new Error("الإيصال غير موجود"), { status: 404 });
    }
    if (proof.status === "APPROVED") {
      return { id: String(proof._id), alreadyApproved: true };
    }

    proof.status = "APPROVED";
    proof.reviewedBy = new mongoose.Types.ObjectId(input.adminId);
    proof.reviewedAt = new Date();
    if (input.adminNote) proof.adminNote = input.adminNote;
    await proof.save({ session: session ?? undefined });

    await EnrollmentModel.findOneAndUpdate(
      { userId: proof.userId, courseId: proof.courseId },
      {
        $set: {
          paymentProofId: proof._id,
          status: "ACTIVE",
          accessType: "LIFETIME",
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session ?? undefined,
      },
    );

    await AuditLogModel.create(
      [
        {
          actorId: new mongoose.Types.ObjectId(input.adminId),
          action: "PAYMENT_APPROVED",
          entityType: "PaymentProof",
          entityId: String(proof._id),
          metadata: {
            courseId: String(proof.courseId),
            userId: String(proof.userId),
            amount: proof.amount,
          },
        },
      ],
      session ? { session } : undefined,
    );

    return { id: String(proof._id), alreadyApproved: false };
  };

  if (session) {
    try {
      let result: { id: string; alreadyApproved: boolean } | null = null;
      await session.withTransaction(async () => {
        result = await run();
      });
      return result!;
    } catch (err) {
      // If the deployment doesn't support transactions, retry without.
      const code = (err as { code?: number }).code;
      if (code === 20 /* IllegalOperation: standalone */) {
        return run();
      }
      throw err;
    } finally {
      await session.endSession();
    }
  }

  return run();
}

export async function rejectPaymentProof(input: {
  proofId: string;
  adminId: string;
  adminNote?: string;
}) {
  await connectDB();
  const proof = await PaymentProofModel.findById(input.proofId);
  if (!proof) {
    throw Object.assign(new Error("الإيصال غير موجود"), { status: 404 });
  }
  proof.status = "REJECTED";
  proof.reviewedBy = new mongoose.Types.ObjectId(input.adminId);
  proof.reviewedAt = new Date();
  if (input.adminNote) proof.adminNote = input.adminNote;
  await proof.save();

  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(input.adminId),
    action: "PAYMENT_REJECTED",
    entityType: "PaymentProof",
    entityId: String(proof._id),
    metadata: { adminNote: input.adminNote },
  });

  return { id: String(proof._id) };
}

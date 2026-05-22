import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { ApplicationQuestionModel } from "@/models/ApplicationQuestion";
import { AuditLogModel } from "@/models/AuditLog";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/services/email.service";
import type { SubmitApplicationInput } from "@/validators/application.validator";
import type { ApprovalStatus } from "@/lib/constants";

export type AdminApplicationListItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  approvalStatus: ApprovalStatus;
  applicationSubmittedAt?: Date;
  reviewedAt?: Date;
  createdAt: Date;
  registrationCountry?: string;
  registrationCountryName?: string;
};

export type AdminApplicationDetail = AdminApplicationListItem & {
  answers: Array<{ questionId: string; question: string; answer: string }>;
  adminNote?: string;
  reviewedBy?: { id: string; name: string } | null;
  registrationIp?: string;
  registrationCountry?: string;
  registrationCountryName?: string;
  registrationCity?: string;
  registrationRegion?: string;
};

export async function submitApplication(
  userId: string,
  input: SubmitApplicationInput,
) {
  await connectDB();

  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("المستخدم غير موجود"), { status: 404 });
  }
  if (user.role === "ADMIN") {
    throw Object.assign(new Error("لا حاجة للاستمارة"), { status: 400 });
  }
  if (
    user.approvalStatus === "APPROVED" ||
    user.approvalStatus === "PENDING_REVIEW"
  ) {
    throw Object.assign(new Error("تم إرسال طلبك بالفعل"), { status: 409 });
  }

  const questions = await ApplicationQuestionModel.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const questionMap = new Map(questions.map((q) => [String(q._id), q]));
  const answersByQuestion = new Map(
    input.answers.map((a) => [a.questionId, a.answer.trim()]),
  );

  const requiredMissing = questions.find(
    (q) => q.required && !answersByQuestion.get(String(q._id)),
  );
  if (requiredMissing) {
    throw Object.assign(
      new Error(`الإجابة على "${requiredMissing.label}" مطلوبة`),
      { status: 400 },
    );
  }

  const persisted = input.answers
    .filter((a) => questionMap.has(a.questionId) && a.answer.trim())
    .map((a) => {
      const q = questionMap.get(a.questionId)!;
      return {
        questionId: q._id,
        question: q.label,
        answer: a.answer.trim(),
      };
    });

  user.applicationAnswers = persisted;
  user.applicationSubmittedAt = new Date();
  user.approvalStatus = "PENDING_REVIEW";
  await user.save();

  await AuditLogModel.create({
    actorId: user._id,
    action: "APPLICATION_SUBMITTED",
    entityType: "User",
    entityId: String(user._id),
    metadata: { answersCount: persisted.length },
  });

  return {
    id: String(user._id),
    approvalStatus: user.approvalStatus,
  };
}

export async function listApplications(filter?: {
  status?: ApprovalStatus;
}): Promise<AdminApplicationListItem[]> {
  await connectDB();
  const query: Record<string, unknown> = { role: "STUDENT" };
  if (filter?.status) query.approvalStatus = filter.status;

  const users = await UserModel.find(query)
    .sort({ applicationSubmittedAt: -1, createdAt: -1 })
    .lean();

  return users.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    approvalStatus: u.approvalStatus,
    applicationSubmittedAt: u.applicationSubmittedAt,
    reviewedAt: u.reviewedAt,
    createdAt: u.createdAt,
    registrationCountry: u.registrationCountry,
    registrationCountryName: u.registrationCountryName,
  }));
}

export async function getApplicationDetail(
  userId: string,
): Promise<AdminApplicationDetail | null> {
  await connectDB();
  const user = await UserModel.findById(userId).lean();
  if (!user || user.role !== "STUDENT") return null;

  let reviewer: { id: string; name: string } | null = null;
  if (user.reviewedBy) {
    const r = await UserModel.findById(user.reviewedBy)
      .select({ name: 1 })
      .lean();
    if (r) reviewer = { id: String(r._id), name: r.name };
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    approvalStatus: user.approvalStatus,
    applicationSubmittedAt: user.applicationSubmittedAt,
    reviewedAt: user.reviewedAt,
    createdAt: user.createdAt,
    answers: (user.applicationAnswers ?? []).map((a) => ({
      questionId: String(a.questionId),
      question: a.question,
      answer: a.answer,
    })),
    adminNote: user.adminNote,
    reviewedBy: reviewer,
    registrationIp: user.registrationIp,
    registrationCountry: user.registrationCountry,
    registrationCountryName: user.registrationCountryName,
    registrationCity: user.registrationCity,
    registrationRegion: user.registrationRegion,
  };
}

export async function approveApplication(
  userId: string,
  actorId: string,
  adminNote?: string,
) {
  await connectDB();
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("المستخدم غير موجود"), { status: 404 });
  }
  if (user.role !== "STUDENT") {
    throw Object.assign(new Error("هذا المستخدم ليس طالبًا"), { status: 400 });
  }

  user.approvalStatus = "APPROVED";
  user.reviewedBy = new mongoose.Types.ObjectId(actorId);
  user.reviewedAt = new Date();
  if (adminNote !== undefined) user.adminNote = adminNote || undefined;
  await user.save();

  const email = await sendApprovalEmail({ name: user.name, email: user.email });
  if (email.ok) {
    user.approvalEmailSentAt = new Date();
    await user.save();
  }

  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "APPLICATION_APPROVED",
    entityType: "User",
    entityId: String(user._id),
    metadata: {
      emailSent: email.ok,
      emailError: email.error,
    },
  });

  return {
    id: String(user._id),
    approvalStatus: user.approvalStatus,
    emailSent: email.ok,
    emailError: email.error,
  };
}

export async function rejectApplication(
  userId: string,
  actorId: string,
  adminNote?: string,
) {
  await connectDB();
  const user = await UserModel.findById(userId);
  if (!user) {
    throw Object.assign(new Error("المستخدم غير موجود"), { status: 404 });
  }
  if (user.role !== "STUDENT") {
    throw Object.assign(new Error("هذا المستخدم ليس طالبًا"), { status: 400 });
  }

  user.approvalStatus = "REJECTED";
  user.reviewedBy = new mongoose.Types.ObjectId(actorId);
  user.reviewedAt = new Date();
  if (adminNote !== undefined) user.adminNote = adminNote || undefined;
  await user.save();

  const email = await sendRejectionEmail({
    name: user.name,
    email: user.email,
  });
  if (email.ok) {
    user.rejectionEmailSentAt = new Date();
    await user.save();
  }

  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "APPLICATION_REJECTED",
    entityType: "User",
    entityId: String(user._id),
    metadata: {
      adminNote,
      emailSent: email.ok,
      emailError: email.error,
    },
  });

  return {
    id: String(user._id),
    approvalStatus: user.approvalStatus,
    emailSent: email.ok,
    emailError: email.error,
  };
}

export async function getMyApplicationStatus(userId: string): Promise<{
  approvalStatus: ApprovalStatus;
  applicationSubmittedAt?: Date;
  reviewedAt?: Date;
  adminNote?: string;
} | null> {
  await connectDB();
  const user = await UserModel.findById(userId)
    .select({
      approvalStatus: 1,
      applicationSubmittedAt: 1,
      reviewedAt: 1,
      adminNote: 1,
    })
    .lean();
  if (!user) return null;
  return {
    approvalStatus: user.approvalStatus,
    applicationSubmittedAt: user.applicationSubmittedAt,
    reviewedAt: user.reviewedAt,
    adminNote: user.adminNote,
  };
}

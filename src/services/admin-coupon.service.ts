import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CouponModel, type ICoupon } from "@/models/Coupon";
import { CourseModel } from "@/models/Course";
import { AuditLogModel } from "@/models/AuditLog";
import type { CouponInput } from "@/validators/coupon.validator";

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

export type CouponStatus = "ACTIVE" | "EXPIRED" | "EXHAUSTED" | "DISABLED";

function deriveStatus(c: Pick<ICoupon, "isActive" | "expiresAt" | "usedCount" | "maxUses">): CouponStatus {
  if (!c.isActive) return "DISABLED";
  if (c.expiresAt.getTime() <= Date.now()) return "EXPIRED";
  if (c.usedCount >= c.maxUses) return "EXHAUSTED";
  return "ACTIVE";
}

export type AdminCouponListItem = {
  id: string;
  code: string;
  type: ICoupon["type"];
  percentageValue?: number;
  fixedValueEgp?: number;
  fixedValueUsd?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  appliesToAllCourses: boolean;
  courseIds: string[];
  isActive: boolean;
  status: CouponStatus;
  createdAt: Date;
};

export async function listAdminCoupons(): Promise<AdminCouponListItem[]> {
  await connectDB();
  const docs = await CouponModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((c) => ({
    id: String(c._id),
    code: c.code,
    type: c.type,
    percentageValue: c.percentageValue,
    fixedValueEgp: c.fixedValueEgp,
    fixedValueUsd: c.fixedValueUsd,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt,
    appliesToAllCourses: c.appliesToAllCourses,
    courseIds: (c.courseIds ?? []).map((id) => String(id)),
    isActive: c.isActive,
    status: deriveStatus(c),
    createdAt: c.createdAt,
  }));
}

export type AdminCouponDetail = AdminCouponListItem & { createdBy?: string };

export async function getAdminCoupon(id: string): Promise<AdminCouponDetail | null> {
  await connectDB();
  const c = await CouponModel.findById(id).lean();
  if (!c) return null;
  return {
    id: String(c._id),
    code: c.code,
    type: c.type,
    percentageValue: c.percentageValue,
    fixedValueEgp: c.fixedValueEgp,
    fixedValueUsd: c.fixedValueUsd,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt,
    appliesToAllCourses: c.appliesToAllCourses,
    courseIds: (c.courseIds ?? []).map((id) => String(id)),
    isActive: c.isActive,
    status: deriveStatus(c),
    createdAt: c.createdAt,
    createdBy: c.createdBy ? String(c.createdBy) : undefined,
  };
}

function buildPayload(input: CouponInput) {
  return {
    code: input.code,
    type: input.type,
    percentageValue:
      input.type === "PERCENTAGE" ? input.percentageValue : undefined,
    fixedValueEgp: input.type === "FIXED" ? input.fixedValueEgp : undefined,
    fixedValueUsd: input.type === "FIXED" ? input.fixedValueUsd : undefined,
    maxUses: input.maxUses,
    expiresAt: input.expiresAt,
    appliesToAllCourses: input.appliesToAllCourses,
    // When applying to all, blank the courseIds for clarity.
    courseIds: input.appliesToAllCourses
      ? []
      : input.courseIds.map((id) => new mongoose.Types.ObjectId(id)),
    isActive: input.isActive,
  };
}

export async function createAdminCoupon(input: CouponInput, actorId: string) {
  await connectDB();
  const exists = await CouponModel.findOne({ code: input.code }).lean();
  if (exists) {
    throw Object.assign(new Error("هذا الكود مستخدم بالفعل"), { status: 409 });
  }
  const created = await CouponModel.create({
    ...buildPayload(input),
    createdBy: new mongoose.Types.ObjectId(actorId),
  });
  await audit({
    actorId,
    action: "COUPON_CREATED",
    entityType: "Coupon",
    entityId: String(created._id),
    metadata: { code: created.code, type: created.type },
  });
  return { id: String(created._id) };
}

export async function updateAdminCoupon(
  id: string,
  input: CouponInput,
  actorId: string,
) {
  await connectDB();
  const conflict = await CouponModel.findOne({
    code: input.code,
    _id: { $ne: id },
  }).lean();
  if (conflict) {
    throw Object.assign(new Error("هذا الكود مستخدم بالفعل"), { status: 409 });
  }
  const updated = await CouponModel.findByIdAndUpdate(
    id,
    { $set: buildPayload(input) },
    { returnDocument: "after" },
  ).lean();
  if (!updated) {
    throw Object.assign(new Error("الكوبون غير موجود"), { status: 404 });
  }
  await audit({
    actorId,
    action: "COUPON_UPDATED",
    entityType: "Coupon",
    entityId: String(updated._id),
    metadata: { code: updated.code },
  });
  return { id: String(updated._id) };
}

export async function deleteAdminCoupon(id: string, actorId: string) {
  await connectDB();
  const deleted = await CouponModel.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw Object.assign(new Error("الكوبون غير موجود"), { status: 404 });
  }
  await audit({
    actorId,
    action: "COUPON_DELETED",
    entityType: "Coupon",
    entityId: String(deleted._id),
    metadata: { code: deleted.code },
  });
  return { id: String(deleted._id) };
}

// Helper for the admin form: list of published courses to render in the
// course-scope checkbox group.
export async function listCoursesForCouponPicker() {
  await connectDB();
  const courses = await CourseModel.find({})
    .sort({ createdAt: -1 })
    .select({ _id: 1, title: 1, slug: 1, isPublished: 1 })
    .lean();
  return courses.map((c) => ({
    id: String(c._id),
    title: c.title,
    slug: c.slug,
    isPublished: c.isPublished,
  }));
}

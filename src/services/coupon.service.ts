import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { CouponModel, type ICoupon, type CouponType } from "@/models/Coupon";
import { CourseModel } from "@/models/Course";
import type { CouponInvalidReason } from "@/models/PaymentProof";

// Localised messages for each invalid reason — used by the validation
// endpoint and rendered verbatim in the admin review panel.
export const COUPON_INVALID_MESSAGES_AR: Record<CouponInvalidReason, string> = {
  NOT_FOUND: "كود الكوبون غير موجود",
  INACTIVE: "هذا الكوبون غير مفعّل حاليًا",
  EXPIRED: "هذا الكوبون منتهي الصلاحية",
  EXHAUSTED: "تم استخدام هذا الكوبون بالكامل",
  NOT_FOR_COURSE: "هذا الكوبون غير متاح لهذا الكورس",
};

export type ValidateCouponInput = {
  code: string;
  courseId: string;
  /** Currency the student would pay in — drives which fixed value is used. */
  currency: "EGP" | "USD";
  /** The course's price in `currency`. Service multiplies/subtracts from this. */
  baseAmount: number;
};

export type ValidateCouponResult =
  | {
      valid: true;
      coupon: {
        id: string;
        code: string;
        type: CouponType;
        value: number;
        expiresAt: Date;
      };
      applied: {
        discountAmount: number;
        expectedAmount: number;
      };
    }
  | {
      valid: false;
      reason: CouponInvalidReason;
      message: string;
      // When the code was found but otherwise unusable, return basic info so
      // the snapshot stored on the proof can still reference it.
      coupon?: { id: string; type: CouponType; value: number };
    };

function computeDiscount(
  coupon: ICoupon,
  currency: "EGP" | "USD",
  baseAmount: number,
): { discountAmount: number; value: number } {
  if (coupon.type === "PERCENTAGE") {
    const pct = coupon.percentageValue ?? 0;
    const raw = (baseAmount * pct) / 100;
    return {
      discountAmount: round2(Math.min(raw, baseAmount)),
      value: pct,
    };
  }
  // FIXED
  const fixed =
    currency === "USD"
      ? (coupon.fixedValueUsd ?? 0)
      : (coupon.fixedValueEgp ?? 0);
  return {
    discountAmount: round2(Math.min(fixed, baseAmount)),
    value: fixed,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function validateCoupon(
  input: ValidateCouponInput,
): Promise<ValidateCouponResult> {
  await connectDB();
  const code = input.code.trim().toUpperCase();
  if (!code) {
    return {
      valid: false,
      reason: "NOT_FOUND",
      message: COUPON_INVALID_MESSAGES_AR.NOT_FOUND,
    };
  }
  const coupon = await CouponModel.findOne({ code }).exec();
  if (!coupon) {
    return {
      valid: false,
      reason: "NOT_FOUND",
      message: COUPON_INVALID_MESSAGES_AR.NOT_FOUND,
    };
  }
  const couponInfo = {
    id: String(coupon._id),
    type: coupon.type,
    value:
      coupon.type === "PERCENTAGE"
        ? (coupon.percentageValue ?? 0)
        : input.currency === "USD"
          ? (coupon.fixedValueUsd ?? 0)
          : (coupon.fixedValueEgp ?? 0),
  };

  if (!coupon.isActive) {
    return {
      valid: false,
      reason: "INACTIVE",
      message: COUPON_INVALID_MESSAGES_AR.INACTIVE,
      coupon: couponInfo,
    };
  }
  if (coupon.expiresAt.getTime() <= Date.now()) {
    return {
      valid: false,
      reason: "EXPIRED",
      message: COUPON_INVALID_MESSAGES_AR.EXPIRED,
      coupon: couponInfo,
    };
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return {
      valid: false,
      reason: "EXHAUSTED",
      message: COUPON_INVALID_MESSAGES_AR.EXHAUSTED,
      coupon: couponInfo,
    };
  }
  if (!coupon.appliesToAllCourses) {
    const matches = coupon.courseIds.some(
      (id) => String(id) === String(input.courseId),
    );
    if (!matches) {
      return {
        valid: false,
        reason: "NOT_FOR_COURSE",
        message: COUPON_INVALID_MESSAGES_AR.NOT_FOR_COURSE,
        coupon: couponInfo,
      };
    }
  }

  const { discountAmount, value } = computeDiscount(
    coupon,
    input.currency,
    input.baseAmount,
  );
  const expectedAmount = round2(Math.max(0, input.baseAmount - discountAmount));

  return {
    valid: true,
    coupon: {
      id: String(coupon._id),
      code: coupon.code,
      type: coupon.type,
      value,
      expiresAt: coupon.expiresAt,
    },
    applied: { discountAmount, expectedAmount },
  };
}

// Look up the course's price in the requested currency (for the public
// validate endpoint).
export async function getCourseBaseAmount(
  courseId: string,
  currency: "EGP" | "USD",
): Promise<number | null> {
  await connectDB();
  const course = await CourseModel.findById(courseId).lean();
  if (!course) return null;
  if (currency === "USD") {
    if (typeof course.priceUsd !== "number" || course.priceUsd <= 0) return null;
    return course.priceUsd;
  }
  return course.price;
}

// Atomically increment usedCount, rejecting if doing so would exceed maxUses.
// Called by the payment-approval flow after admin approves a proof whose
// snapshot captured the coupon as valid.
export async function consumeCoupon(
  couponId: string,
  session?: mongoose.ClientSession,
): Promise<void> {
  await connectDB();
  const updated = await CouponModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(couponId),
      // Guard so we only consume when there's actually a slot left. If the
      // coupon was exhausted between submission and approval, this finds no
      // doc and we throw 409 — admin decides what to do.
      $expr: { $lt: ["$usedCount", "$maxUses"] },
    },
    { $inc: { usedCount: 1 } },
    { new: true, session: session ?? undefined },
  );
  if (!updated) {
    throw Object.assign(
      new Error("لم نتمكن من احتساب الكوبون — قد يكون استُهلك بالكامل بين الإرسال والمراجعة."),
      { status: 409 },
    );
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { couponValidateInputSchema } from "@/validators/coupon.validator";
import {
  validateCoupon,
  getCourseBaseAmount,
} from "@/services/coupon.service";
import { lookupGeo } from "@/services/geoip.service";
import { pickPriceForCountry } from "@/lib/pricing";
import { CourseModel } from "@/models/Course";
import { connectDB } from "@/lib/db";

export const runtime = "nodejs";

// POST /api/coupons/validate
//
// Probes whether a coupon code is currently usable for the given course.
// Returns 200 with `{ valid: true | false, ... }` either way so the form
// can treat invalid as data (rendered as a red helper) rather than a
// network error.
export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => ({}));
    const parsed = couponValidateInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          reason: "BAD_REQUEST",
          message: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Determine the student's effective currency the same way the
    // payment-proofs/new page does.
    const geo = await lookupGeo(req.headers).catch(
      () => null as { country?: string } | null,
    );
    await connectDB();
    const course = await CourseModel.findById(parsed.data.courseId).lean();
    if (!course) {
      return NextResponse.json(
        { valid: false, reason: "NOT_FOUND", message: "الكورس غير موجود" },
        { status: 404 },
      );
    }
    const picked = pickPriceForCountry(course, geo?.country);
    const currency: "EGP" | "USD" = picked.isInternational ? "USD" : "EGP";

    const baseAmount = await getCourseBaseAmount(parsed.data.courseId, currency);
    if (baseAmount === null) {
      return NextResponse.json(
        {
          valid: false,
          reason: "NOT_FOUND",
          message: "السعر غير متاح لهذا الكورس بهذه العملة",
        },
        { status: 400 },
      );
    }

    const result = await validateCoupon({
      code: parsed.data.code,
      courseId: parsed.data.courseId,
      currency,
      baseAmount,
    });

    return NextResponse.json(
      result.valid
        ? {
            valid: true,
            coupon: result.coupon,
            applied: result.applied,
            currency,
            baseAmount,
          }
        : {
            valid: false,
            reason: result.reason,
            message: result.message,
          },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

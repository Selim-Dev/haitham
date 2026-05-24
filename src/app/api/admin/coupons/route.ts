import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { couponInputSchema } from "@/validators/coupon.validator";
import {
  listAdminCoupons,
  createAdminCoupon,
} from "@/services/admin-coupon.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await listAdminCoupons();
    return NextResponse.json({ coupons });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const parsed = couponInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await createAdminCoupon(parsed.data, admin.id);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

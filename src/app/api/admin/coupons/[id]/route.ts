import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { couponInputSchema } from "@/validators/coupon.validator";
import {
  getAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from "@/services/admin-coupon.service";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const coupon = await getAdminCoupon(id);
    if (!coupon) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ coupon });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
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
    const result = await updateAdminCoupon(id, parsed.data, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const result = await deleteAdminCoupon(id, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

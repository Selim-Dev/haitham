import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminPaymentReviewSchema } from "@/validators/payment.validator";
import { approvePaymentProof } from "@/services/admin-payment.service";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const parsed = adminPaymentReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }
    const result = await approvePaymentProof({
      proofId: id,
      adminId: admin.id,
      adminNote: parsed.data.adminNote || undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminPaymentProof } from "@/services/admin-payment.service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const proof = await getAdminPaymentProof(id);
    if (!proof) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ proof });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

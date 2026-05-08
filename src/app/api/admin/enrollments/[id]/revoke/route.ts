import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { revokeEnrollment } from "@/services/admin-user.service";

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const result = await revokeEnrollment(id, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

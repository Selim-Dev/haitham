import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { courseInputSchema } from "@/validators/course.validator";
import {
  deleteAdminCourse,
  getAdminCourse,
  updateAdminCourse,
} from "@/services/admin-course.service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const course = await getAdminCourse(id);
    if (!course) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json({ course });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = courseInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await updateAdminCourse(id, parsed.data, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const result = await deleteAdminCourse(id, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

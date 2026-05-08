import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { lessonInputSchema } from "@/validators/lesson.validator";
import {
  deleteAdminLesson,
  updateAdminLesson,
} from "@/services/admin-course.service";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = lessonInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await updateAdminLesson(id, parsed.data, admin.id);
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
    const result = await deleteAdminLesson(id, admin.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

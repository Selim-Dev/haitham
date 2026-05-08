import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { lessonInputSchema } from "@/validators/lesson.validator";
import { createAdminLesson } from "@/services/admin-course.service";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = lessonInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await createAdminLesson(parsed.data, admin.id);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

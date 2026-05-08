import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { courseInputSchema } from "@/validators/course.validator";
import {
  createAdminCourse,
  listAdminCourses,
} from "@/services/admin-course.service";

export async function GET() {
  try {
    await requireAdmin();
    const courses = await listAdminCourses();
    return NextResponse.json({ courses });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
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
    const result = await createAdminCourse(parsed.data, admin.id);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

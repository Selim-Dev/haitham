import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/services/course.service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
  }
  return NextResponse.json({ course });
}

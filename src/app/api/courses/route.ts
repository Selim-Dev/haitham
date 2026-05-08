import { NextResponse } from "next/server";
import { courseListQuerySchema } from "@/validators/course.validator";
import { listPublishedCourses } from "@/services/course.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parsed = courseListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }
  const result = await listPublishedCourses(parsed.data);
  return NextResponse.json(result);
}

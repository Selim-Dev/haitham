import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLessonPlayback } from "@/services/lesson.service";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await ctx.params;
    const user = await getCurrentUser();
    const data = await getLessonPlayback(lessonId, user);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

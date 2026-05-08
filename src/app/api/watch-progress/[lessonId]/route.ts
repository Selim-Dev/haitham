import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { upsertWatchProgress } from "@/services/lesson.service";

const schema = z.object({
  progressSeconds: z.coerce.number().nonnegative(),
  completed: z.boolean().optional().default(false),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ lessonId: string }> },
) {
  try {
    const user = await requireAuth();
    const { lessonId } = await ctx.params;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }
    await upsertWatchProgress(
      user.id,
      lessonId,
      parsed.data.progressSeconds,
      parsed.data.completed,
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

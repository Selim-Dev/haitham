import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { submitApplicationSchema } from "@/validators/application.validator";
import { submitApplication } from "@/services/application.service";

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    const body = await req.json();
    const parsed = submitApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await submitApplication(me.id, parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

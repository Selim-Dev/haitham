import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { applicationQuestionSchema } from "@/validators/application.validator";
import {
  createQuestion,
  listAllQuestions,
} from "@/services/application-question.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const questions = await listAllQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = applicationQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const question = await createQuestion(parsed.data, admin.id);
    return NextResponse.json({ ok: true, question }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

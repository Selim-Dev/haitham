import { NextResponse } from "next/server";
import { listActiveQuestions } from "@/services/application-question.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const questions = await listActiveQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

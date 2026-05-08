import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listMyEnrollments } from "@/services/enrollment.service";

export async function GET() {
  try {
    const user = await requireAuth();
    const enrollments = await listMyEnrollments(user.id);
    return NextResponse.json({ enrollments });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

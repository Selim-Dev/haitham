import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminEnrollments } from "@/services/admin-user.service";

export async function GET() {
  try {
    await requireAdmin();
    const enrollments = await listAdminEnrollments();
    return NextResponse.json({ enrollments });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

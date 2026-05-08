import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminUsers } from "@/services/admin-user.service";

export async function GET() {
  try {
    await requireAdmin();
    const users = await listAdminUsers();
    return NextResponse.json({ users });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

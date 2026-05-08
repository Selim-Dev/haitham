import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminCreateUserSchema } from "@/validators/auth.validator";
import {
  createAdminUser,
  listAdminUsers,
} from "@/services/admin-user.service";

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

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = adminCreateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const result = await createAdminUser(parsed.data, admin.id);
    return NextResponse.json({ ok: true, user: result }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

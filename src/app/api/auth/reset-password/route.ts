import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/validators/auth.validator";
import { resetPassword } from "@/services/auth.service";

// Consumes a reset token and rotates the password. Does NOT set a session
// cookie — the user is sent back to /login to sign in fresh with the new
// password, which also confirms the rotation took effect.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await resetPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { loginSchema } from "@/validators/auth.validator";
import { loginUser } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const user = await loginUser(parsed.data.email, parsed.data.password);
    await setSessionCookie(user);
    return NextResponse.json({ user });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

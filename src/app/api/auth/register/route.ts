import { NextResponse } from "next/server";
import { registerSchema } from "@/validators/auth.validator";
import { registerStudent } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth";
import { lookupGeo } from "@/services/geoip.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { name, email, phone, password } = parsed.data;
    const geo = await lookupGeo(req.headers).catch(() => ({}));
    const user = await registerStudent({
      name,
      email,
      phone: phone || undefined,
      password,
      geo,
    });
    await setSessionCookie(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

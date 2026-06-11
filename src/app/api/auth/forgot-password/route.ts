import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/validators/auth.validator";
import { requestPasswordReset } from "@/services/auth.service";
import { sendPasswordResetEmail } from "@/services/email.service";

// Always returns 200 `{ ok: true }` for any well-formed email. Whether the
// email maps to a real user is never leaked to the caller — that's the
// no-enumeration guarantee. The only non-200 path here is request-shape
// validation (400) so the client can show field errors.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await requestPasswordReset(parsed.data.email);
    if (result) {
      // Email is best-effort — the service swallows transport errors and
      // returns { ok: false }. We log but don't surface failure to the
      // caller, otherwise email outages become a stealth enumeration
      // oracle (success-vs-error reveals whether the user existed).
      const send = await sendPasswordResetEmail({
        name: result.name,
        email: result.email,
        rawToken: result.rawToken,
      });
      if (!send.ok) {
        console.error(
          "[forgot-password] email send failed for",
          result.email,
          send.error,
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password] unexpected error", err);
    // Still return 200 — the contract from the client's perspective is
    // "we accepted your request". A 500 here would let an attacker tell
    // which inputs blow up internally.
    return NextResponse.json({ ok: true });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  paymentProofInputSchema,
  paypalProofInputSchema,
} from "@/validators/payment.validator";
import {
  createPaymentProof,
  createPaypalPaymentProof,
  listMyPaymentProofs,
} from "@/services/payment.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const proofs = await listMyPaymentProofs(user.id);
    return NextResponse.json({ proofs });
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
    const user = await requireAuth();

    const form = await req.formData();
    const paymentMethod = (
      String(form.get("paymentMethod") ?? "WALLET") || "WALLET"
    ).toUpperCase();

    if (paymentMethod === "PAYPAL") {
      const fields = {
        courseId: String(form.get("courseId") ?? ""),
        transactionReference: String(form.get("transactionReference") ?? ""),
        userNote: form.get("userNote") ?? undefined,
      };
      const parsed = paypalProofInputSchema.safeParse(fields);
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "بيانات غير صحيحة",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }
      const result = await createPaypalPaymentProof({
        userId: user.id,
        courseId: parsed.data.courseId,
        transactionReference: parsed.data.transactionReference,
        userNote: parsed.data.userNote || undefined,
      });
      return NextResponse.json({ ok: true, ...result }, { status: 201 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "ملف الإيصال مطلوب" },
        { status: 400 },
      );
    }

    const fields = {
      courseId: String(form.get("courseId") ?? ""),
      amount: form.get("amount"),
      currency: String(form.get("currency") ?? "EGP"),
      paymentMethod,
      transactionReference: form.get("transactionReference") ?? undefined,
      userNote: form.get("userNote") ?? undefined,
    };

    const parsed = paymentProofInputSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await createPaymentProof({
      userId: user.id,
      courseId: parsed.data.courseId,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      paymentMethod: parsed.data.paymentMethod,
      transactionReference: parsed.data.transactionReference || undefined,
      userNote: parsed.data.userNote || undefined,
      file: {
        buffer,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.status ?? 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  paymentProofInputSchema,
  internationalProofInputSchema,
} from "@/validators/payment.validator";
import {
  createPaymentProof,
  createInternationalPaymentProof,
  listMyPaymentProofs,
} from "@/services/payment.service";
import { isInternationalMethod } from "@/lib/constants";

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

    if (isInternationalMethod(paymentMethod)) {
      // International submissions now mirror the domestic flow: a receipt
      // screenshot / PDF is required, and the transaction reference is
      // optional (some students paying via STC Pay or Barq won't have a
      // meaningful reference to copy).
      const intlFile = form.get("file");
      if (!(intlFile instanceof File)) {
        return NextResponse.json(
          { error: "صورة إثبات الدفع مطلوبة" },
          { status: 400 },
        );
      }
      const fields = {
        courseId: String(form.get("courseId") ?? ""),
        paymentMethod,
        transactionReference: String(form.get("transactionReference") ?? ""),
        userNote: form.get("userNote") ?? undefined,
      };
      const parsed = internationalProofInputSchema.safeParse(fields);
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "بيانات غير صحيحة",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      }
      const intlBuffer = Buffer.from(await intlFile.arrayBuffer());
      const result = await createInternationalPaymentProof({
        userId: user.id,
        courseId: parsed.data.courseId,
        paymentMethod: parsed.data.paymentMethod,
        transactionReference: parsed.data.transactionReference || undefined,
        userNote: parsed.data.userNote || undefined,
        file: {
          buffer: intlBuffer,
          filename: intlFile.name,
          mimeType: intlFile.type,
          size: intlFile.size,
        },
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

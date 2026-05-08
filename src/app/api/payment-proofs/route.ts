import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { paymentProofInputSchema } from "@/validators/payment.validator";
import { createPaymentProof, listMyPaymentProofs } from "@/services/payment.service";

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

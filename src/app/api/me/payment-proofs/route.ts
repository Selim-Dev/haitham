import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listMyPaymentProofs } from "@/services/payment.service";

export async function GET() {
  try {
    const user = await requireAuth();
    const proofs = await listMyPaymentProofs(user.id);
    return NextResponse.json({ proofs });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

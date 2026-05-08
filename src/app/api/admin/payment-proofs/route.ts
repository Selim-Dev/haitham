import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminPaymentProofs } from "@/services/admin-payment.service";
import type { PaymentStatus } from "@/lib/constants";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") as PaymentStatus | null;
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const result = await listAdminPaymentProofs({
      status: status ?? undefined,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { listMyPaymentProofs } from "@/services/payment.service";
import { PAYMENT_STATUS_AR, type PaymentStatus } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: COPY.dashboard.paymentProofs };
export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<PaymentStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function PaymentProofsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/payment-proofs");

  const proofs = await listMyPaymentProofs(user.id).catch(() => []);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.dashboard.paymentProofs}
          </h1>
          <p className="mt-2 text-sm text-muted">
            تتبّع حالة كل إيصال أرسلته للمراجعة.
          </p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/courses">تصفح الكورسات</Link>
        </Button>
      </header>

      {proofs.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-6" />}
          title="لا توجد إيصالات بعد"
          description="بعد اختيار كورس ورفع إيصال الدفع، سيظهر هنا."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <ul className="divide-y divide-[var(--color-border)]">
            {proofs.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-4 p-4 sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated text-[var(--color-red-300)]">
                    <Receipt className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {p.course?.title ?? "كورس"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-2">
                      <span>{formatPrice(p.amount, p.currency)}</span>
                      <span>·</span>
                      <span>{formatDate(p.createdAt)}</span>
                      {p.transactionReference && (
                        <>
                          <span>·</span>
                          <span dir="ltr">{p.transactionReference}</span>
                        </>
                      )}
                    </div>
                    {p.adminNote && (
                      <p className="mt-1 text-xs text-muted">
                        ملاحظة الإدارة: {p.adminNote}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={STATUS_VARIANT[p.status]}
                    className="px-3 py-1"
                  >
                    {PAYMENT_STATUS_AR[p.status]}
                  </Badge>
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={p.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      عرض
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

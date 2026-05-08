import Link from "next/link";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminPaymentProofs } from "@/services/admin-payment.service";
import { PAYMENT_STATUS_AR, type PaymentStatus } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { cn, formatDate, formatPrice, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "الكل", value: "ALL" },
  { label: PAYMENT_STATUS_AR.PENDING, value: "PENDING" },
  { label: PAYMENT_STATUS_AR.APPROVED, value: "APPROVED" },
  { label: PAYMENT_STATUS_AR.REJECTED, value: "REJECTED" },
];

const STATUS_VARIANT: Record<PaymentStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (
    sp.status === "PENDING" || sp.status === "APPROVED" || sp.status === "REJECTED"
      ? sp.status
      : undefined
  ) as PaymentStatus | undefined;

  const { items, total } = await listAdminPaymentProofs({ status, limit: 50 });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.payments}
        </h1>
        <p className="mt-2 text-sm text-muted">
          راجع إيصالات الدفع، اعتمد المعتمد منها، أو ارفض غير المطابق.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const active =
            (t.value === "ALL" && !status) || t.value === status;
          const href = t.value === "ALL" ? "/admin/payments" : `/admin/payments?status=${t.value}`;
          return (
            <Link
              key={t.value}
              href={href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-[var(--color-border-strong)] bg-card text-muted hover:text-foreground hover:border-primary/40",
              )}
            >
              {t.label}
            </Link>
          );
        })}
        <span className="ms-auto text-xs text-muted-2">
          {toArabicNumerals(total)} {total === 1 ? "إيصال" : "إيصالات"}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-6" />}
          title="لا توجد مدفوعات في هذه الحالة"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <ul className="divide-y divide-[var(--color-border)]">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/payments/${p.id}`}
                  className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-elevated"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated text-[var(--color-red-300)]">
                    <Receipt className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {p.user?.name ?? "—"}{" "}
                      <span className="text-xs font-normal text-muted-2">
                        — {p.course?.title ?? "—"}
                      </span>
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-2">
                      <span>{formatDate(p.createdAt)}</span>
                      <span dir="ltr">{p.user?.email}</span>
                      {p.transactionReference && (
                        <span dir="ltr">{p.transactionReference}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-foreground">
                      {formatPrice(p.amount, p.currency)}
                    </span>
                    <Badge
                      variant={STATUS_VARIANT[p.status as PaymentStatus]}
                    >
                      {PAYMENT_STATUS_AR[p.status as PaymentStatus]}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

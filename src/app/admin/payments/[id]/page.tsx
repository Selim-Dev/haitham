import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ChevronRight,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentReviewActions } from "@/components/admin/payment-review-actions";
import { getAdminPaymentProof } from "@/services/admin-payment.service";
import {
  PAYMENT_STATUS_AR,
  PAYMENT_METHOD_AR,
  type PaymentStatus,
  type PaymentMethod,
} from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<PaymentStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function AdminPaymentReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proof = await getAdminPaymentProof(id);
  if (!proof) notFound();

  const method = (proof.paymentMethod as PaymentMethod) ?? "WALLET";
  const isPaypal = method === "PAYPAL";
  const isImage =
    !!proof.receiptUrl && !proof.receiptUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/payments" className="hover:text-foreground">
          {COPY.admin.payments}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{COPY.admin.review.title}</span>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            {COPY.admin.review.title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            تاريخ الإرسال: {formatDate(proof.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPaypal ? "primary" : "outline"} className="px-3 py-1.5">
            {isPaypal && <Globe2 className="size-3.5" />}
            {PAYMENT_METHOD_AR[method]}
          </Badge>
          <Badge
            variant={STATUS_VARIANT[proof.status as PaymentStatus]}
            className="px-3 py-1.5"
          >
            {PAYMENT_STATUS_AR[proof.status as PaymentStatus]}
          </Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="flex flex-col gap-5">
          {isPaypal ? (
            <div className="rounded-2xl border border-[#0070ba]/30 bg-gradient-to-br from-card via-card to-elevated p-6">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0070ba] to-[#003087] text-white shadow-md">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-bold text-foreground">
                    دفعة عبر PayPal
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    تحقق من الرقم التالي على لوحة PayPal قبل الموافقة.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <a
                    href="https://www.paypal.com/activity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    افتح لوحة PayPal
                  </a>
                </Button>
              </div>

              <div className="mt-5 rounded-xl border border-[var(--color-border-strong)] bg-surface p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-2">
                  PayPal Transaction ID
                </p>
                <p
                  dir="ltr"
                  className="mt-2 break-all font-mono text-xl font-extrabold text-foreground tabular-nums"
                >
                  {proof.transactionReference || "— غير مذكور —"}
                </p>
              </div>

              <dl className="mt-4 grid gap-2 text-sm">
                <Row
                  label="المبلغ"
                  value={formatPrice(proof.amount, proof.currency)}
                  dir="ltr"
                />
              </dl>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-border)] bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-foreground">
                  إيصال الدفع
                </h2>
                {proof.receiptUrl && (
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={proof.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      فتح في تبويب جديد
                    </a>
                  </Button>
                )}
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-elevated">
                {proof.receiptUrl ? (
                  isImage ? (
                    <Image
                      src={proof.receiptUrl}
                      alt="إيصال الدفع"
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <iframe
                      src={proof.receiptUrl}
                      className="absolute inset-0 size-full"
                      title="إيصال الدفع"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-sm text-muted-2">
                    لا يوجد ملف مرفق
                  </div>
                )}
              </div>
            </div>
          )}

          {proof.userNote && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
              <h3 className="text-sm font-bold text-foreground">ملاحظة الطالب</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                {proof.userNote}
              </p>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
            <h3 className="font-display text-base font-bold text-foreground">
              {COPY.admin.review.userData}
            </h3>
            {proof.user ? (
              <dl className="mt-3 grid gap-2 text-sm">
                <Row label="الاسم" value={proof.user.name} />
                <Row label={COPY.auth.email} value={proof.user.email} dir="ltr" />
                {proof.user.phone && (
                  <Row label={COPY.auth.phone} value={proof.user.phone} dir="ltr" />
                )}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted">المستخدم غير موجود</p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
            <h3 className="font-display text-base font-bold text-foreground">
              {COPY.admin.review.courseData}
            </h3>
            {proof.course ? (
              <dl className="mt-3 grid gap-2 text-sm">
                <Row label="الكورس" value={proof.course.title} />
                <Row
                  label="السعر الأصلي"
                  value={formatPrice(proof.course.price, proof.course.currency)}
                />
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted">الكورس غير موجود</p>
            )}
          </div>

          <div className="rounded-2xl border border-primary/30 bg-card p-5">
            <h3 className="font-display text-base font-bold text-foreground">
              تفاصيل الدفع
            </h3>
            <dl className="mt-3 grid gap-2 text-sm">
              <Row
                label="طريقة الدفع"
                value={PAYMENT_METHOD_AR[method]}
              />
              <Row
                label={COPY.admin.review.amount}
                value={formatPrice(proof.amount, proof.currency)}
                dir={proof.currency === "USD" ? "ltr" : undefined}
              />
              {proof.transactionReference && (
                <Row
                  label={
                    isPaypal ? "PayPal Txn ID" : COPY.admin.review.reference
                  }
                  value={proof.transactionReference}
                  dir="ltr"
                />
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-5">
            <PaymentReviewActions
              proofId={proof.id}
              status={proof.status as PaymentStatus}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-1.5 last:border-0">
      <dt className="text-xs font-medium text-muted-2">{label}</dt>
      <dd
        className="truncate text-sm font-semibold text-foreground"
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}

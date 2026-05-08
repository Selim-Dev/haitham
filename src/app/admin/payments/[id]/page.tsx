import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentReviewActions } from "@/components/admin/payment-review-actions";
import { getAdminPaymentProof } from "@/services/admin-payment.service";
import { PAYMENT_STATUS_AR, type PaymentStatus } from "@/lib/constants";
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

  const isImage = !proof.receiptUrl.toLowerCase().endsWith(".pdf");

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
        <Badge
          variant={STATUS_VARIANT[proof.status as PaymentStatus]}
          className="px-3 py-1.5"
        >
          {PAYMENT_STATUS_AR[proof.status as PaymentStatus]}
        </Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                إيصال الدفع
              </h2>
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
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-elevated">
              {isImage ? (
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
              )}
            </div>
          </div>

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
                label={COPY.admin.review.amount}
                value={formatPrice(proof.amount, proof.currency)}
              />
              {proof.transactionReference && (
                <Row
                  label={COPY.admin.review.reference}
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

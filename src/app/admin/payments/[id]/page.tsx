import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ChevronRight,
  Globe2,
  ShieldCheck,
  CreditCard,
  Layers,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentReviewActions } from "@/components/admin/payment-review-actions";
import { getAdminPaymentProof } from "@/services/admin-payment.service";
import {
  PAYMENT_STATUS_AR,
  PAYMENT_METHOD_AR,
  isInternationalMethod,
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

type InternationalDescriptor = {
  title: string;
  subtitle: string;
  refLabel: string;
  verifyUrl: string;
  verifyLabel: string;
  badgeIcon: React.ReactNode;
  iconWrap: string;
  borderTint: string;
  panelIcon: React.ReactNode;
  txUrl?: (ref: string) => string;
};

function getInternationalDescriptor(
  method: PaymentMethod,
): InternationalDescriptor | null {
  if (method === "PAYPAL") {
    return {
      title: "دفعة بالبطاقة (PayPal)",
      subtitle: "تحقق من الـ Transaction ID على لوحة PayPal قبل الموافقة.",
      refLabel: "PayPal Transaction ID",
      verifyUrl: "https://www.paypal.com/activity",
      verifyLabel: "افتح لوحة PayPal",
      badgeIcon: <CreditCard className="size-3.5" />,
      iconWrap: "from-[#0070ba] to-[#003087]",
      borderTint: "border-[#0070ba]/30",
      panelIcon: <ShieldCheck className="size-5" />,
    };
  }
  if (method === "CRYPTO_SOLANA") {
    return {
      title: "دفعة عبر Solana",
      subtitle: "تحقق من الـ Transaction Hash على Solscan قبل الموافقة.",
      refLabel: "Solana Transaction Hash",
      verifyUrl: "https://solscan.io",
      verifyLabel: "افتح Solscan",
      badgeIcon: <Layers className="size-3.5" />,
      iconWrap: "from-[#9945ff] to-[#14f195]",
      borderTint: "border-[#9945ff]/30",
      panelIcon: <Layers className="size-5" />,
      txUrl: (ref) => `https://solscan.io/tx/${encodeURIComponent(ref)}`,
    };
  }
  if (method === "CRYPTO_BINANCE") {
    return {
      title: "دفعة عبر Binance",
      subtitle: "افتح تطبيق Binance وتحقق من سجل التحويلات الوارد بهذا الـ ID.",
      refLabel: "Binance Transaction ID",
      verifyUrl: "https://www.binance.com/en/my/wallet/account/main/deposit/history",
      verifyLabel: "سجل التحويلات في Binance",
      badgeIcon: <Wallet className="size-3.5" />,
      iconWrap: "from-[#f0b90b] to-[#7a5b00]",
      borderTint: "border-[#f0b90b]/30",
      panelIcon: <Wallet className="size-5" />,
    };
  }
  return null;
}

export default async function AdminPaymentReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proof = await getAdminPaymentProof(id);
  if (!proof) notFound();

  const method = (proof.paymentMethod as PaymentMethod) ?? "WALLET";
  const intl = isInternationalMethod(method)
    ? getInternationalDescriptor(method)
    : null;
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
          <Badge
            variant={intl ? "primary" : "outline"}
            className="px-3 py-1.5"
          >
            {intl ? intl.badgeIcon : <Globe2 className="size-3.5 opacity-0" />}
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
          {intl ? (
            <div
              className={`rounded-2xl border ${intl.borderTint} bg-gradient-to-br from-card via-card to-elevated p-6`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <div
                  className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${intl.iconWrap} text-white shadow-md`}
                >
                  {intl.panelIcon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-bold text-foreground">
                    {intl.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted">{intl.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {intl.txUrl && proof.transactionReference && (
                    <Button asChild variant="primary" size="sm">
                      <a
                        href={intl.txUrl(proof.transactionReference)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                        افتح المعاملة
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="ghost" size="sm">
                    <a
                      href={intl.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      {intl.verifyLabel}
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[var(--color-border-strong)] bg-surface p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-2">
                  {intl.refLabel}
                </p>
                <p
                  dir="ltr"
                  className="mt-2 break-all font-mono text-lg font-extrabold text-foreground sm:text-xl"
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
              <Row label="طريقة الدفع" value={PAYMENT_METHOD_AR[method]} />
              <Row
                label={COPY.admin.review.amount}
                value={formatPrice(proof.amount, proof.currency)}
                dir={proof.currency === "USD" ? "ltr" : undefined}
              />
              {proof.transactionReference && (
                <Row
                  label={intl ? intl.refLabel : COPY.admin.review.reference}
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

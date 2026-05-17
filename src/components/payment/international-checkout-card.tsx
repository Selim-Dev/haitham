"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  CreditCard,
  Bitcoin,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Loader2,
  Copy,
  Check,
  Globe2,
  Wallet,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { COPY } from "@/lib/arabic";
import { cn, formatPrice } from "@/lib/utils";
import type { InternationalMethod } from "@/lib/constants";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAAfzHP3KHRLtrIMQaGopoG8HlWvPsrNIqsbGxHg-SGFELurasC0ECt330vOGg-5Y3VxJ9Q0U7fcUGuYbo";

const SOLANA_ADDRESS = "HrR61SUqaJ6YpeLfacD2cUJ8vibfKUNbSTTZK8GjNjfS";
const BINANCE_ID = "514823860";

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (opts: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}

type Course = {
  id: string;
  title: string;
  priceUsd?: number;
  paypalHostedButtonId?: string;
};

type MethodOption = {
  value: InternationalMethod;
  label: string;
  hint: string;
  refLabel: string;
  refPlaceholder: string;
};

const METHOD_OPTIONS: MethodOption[] = [
  {
    value: "PAYPAL",
    label: "دفعت بالبطاقة (PayPal)",
    hint: "PayPal يعطيك Transaction ID فور إتمام الدفع.",
    refLabel: "PayPal Transaction ID",
    refPlaceholder: "مثال: 1AB23456CD789012E",
  },
  {
    value: "CRYPTO_SOLANA",
    label: "دفعت عبر Solana",
    hint: "الـ Transaction Hash يظهر في محفظتك بعد التحويل.",
    refLabel: "Solana Transaction Hash",
    refPlaceholder: "مثال: 5VZh...zXc1",
  },
  {
    value: "CRYPTO_BINANCE",
    label: "دفعت عبر Binance",
    hint: "Transaction ID من سجل التحويلات داخل تطبيق Binance.",
    refLabel: "Binance Transaction ID",
    refPlaceholder: "مثال: 1234567890",
  },
];

export function InternationalCheckoutCard({ course }: { course: Course }) {
  const router = useRouter();
  const [sdkReady, setSdkReady] = React.useState(false);
  const [buttonRendered, setButtonRendered] = React.useState(false);
  const [method, setMethod] = React.useState<InternationalMethod>("PAYPAL");
  const [reference, setReference] = React.useState("");
  const [note, setNote] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const buttonId = course.paypalHostedButtonId?.trim();
  const hasPriceUsd = typeof course.priceUsd === "number" && course.priceUsd > 0;
  const hasPaypal = Boolean(buttonId && hasPriceUsd);

  React.useEffect(() => {
    if (!sdkReady || !hasPaypal || buttonRendered) return;
    if (!window.paypal?.HostedButtons || !buttonId) return;

    try {
      window.paypal
        .HostedButtons({ hostedButtonId: buttonId })
        .render(`#paypal-container-${buttonId}`);
      setButtonRendered(true);
    } catch (err) {
      console.error("[paypal] hosted button render failed", err);
    }
  }, [sdkReady, hasPaypal, buttonRendered, buttonId]);

  const activeOption = METHOD_OPTIONS.find((o) => o.value === method)!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = reference.trim();
    if (ref.length < 4) {
      setErrors({ reference: "أدخل رقم العملية كما يظهر في التحويل" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.set("courseId", course.id);
      fd.set("paymentMethod", method);
      fd.set("transactionReference", ref);
      if (note.trim()) fd.set("userNote", note.trim());

      const res = await fetch("/api/payment-proofs", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      setDone(true);
      toast.success("تم استلام إثبات الدفع. سنراجعه قريبًا.");
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--color-success)]/30 bg-card p-8 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)]">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-foreground">
          تم استلام دفعتك
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          سنراجع العملية ونفعّل اشتراكك في أقرب وقت. سيصلك إشعار حال
          الموافقة.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push("/dashboard/payment-proofs")}
            variant="primary"
            size="md"
          >
            <Receipt className="size-4" />
            عرض إيصالاتي
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="md"
          >
            لوحة التعلم
          </Button>
        </div>
      </div>
    );
  }

  if (!hasPriceUsd) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              البيع الدولي لهذا الكورس غير مفعّل
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              لم يقم المسؤول بضبط السعر الدولي لهذا الكورس بعد. تواصل مع
              الإدارة لإكمال الاشتراك.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {hasPaypal && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onLoad={() => setSdkReady(true)}
          onReady={() => setSdkReady(true)}
        />
      )}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--color-red-300)]">
            <Globe2 className="size-3.5" />
            الدفع للمشتركين خارج مصر
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            اختر طريقة الدفع
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            ادفع{" "}
            <span dir="ltr" className="font-bold text-foreground">
              {formatPrice(course.priceUsd!, "USD")}
            </span>{" "}
            بالطريقة المناسبة لك، ثم أرسل رقم العملية لتفعيل اشتراكك مدى
            الحياة.
          </p>
        </div>
        <div className="hidden text-end sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-2">
            خطوة 1 من 2
          </p>
          <p className="mt-1 text-xs font-medium text-muted">
            ادفع · ثم أرسل رقم العملية
          </p>
        </div>
      </header>

      <CardPaymentSection
        priceUsd={course.priceUsd!}
        buttonId={buttonId}
        sdkReady={sdkReady}
      />

      <CryptoSection priceUsd={course.priceUsd!} />

      <section
        aria-labelledby="confirm-title"
        className="rounded-3xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <header className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-2">
            خطوة 2 من 2
          </p>
          <h2
            id="confirm-title"
            className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            أكّد الدفع — أرسل لنا رقم العملية
          </h2>
          <p className="mt-1 text-sm text-muted">
            اختر الطريقة التي دفعت بها، وألصق رقم العملية لتراجعها الإدارة
            وتفعّل اشتراكك.
          </p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <Label>طريقة الدفع المستخدمة</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {METHOD_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-start transition-colors",
                    method === opt.value
                      ? "border-primary/60 bg-primary/10"
                      : "border-[var(--color-border-strong)] bg-elevated/40 hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={method === opt.value}
                    onChange={() => setMethod(opt.value)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-bold text-foreground">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-2">
                      {opt.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="reference">{activeOption.refLabel}</Label>
            <Input
              id="reference"
              dir="ltr"
              autoComplete="off"
              placeholder={activeOption.refPlaceholder}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              maxLength={200}
              className="font-mono"
            />
            <FieldError message={errors.reference} />
          </div>

          <div>
            <Label htmlFor="note">
              ملاحظات إضافية{" "}
              <span className="font-normal text-muted-2">(اختياري)</span>
            </Label>
            <Textarea
              id="note"
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل تساعد في المراجعة (الوقت، اسم المحفظة...)"
            />
          </div>

          <Button type="submit" size="lg" loading={submitting}>
            أرسل للتفعيل
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-2">
            بإتمام الدفع فأنت توافق على{" "}
            <Link
              href="/terms"
              className="font-semibold text-[var(--color-red-300)] underline-offset-2 hover:underline"
            >
              {COPY.nav.terms}
            </Link>{" "}
            و
            <Link
              href="/refund"
              className="font-semibold text-[var(--color-red-300)] underline-offset-2 hover:underline"
            >
              {COPY.nav.refund}
            </Link>
            .
          </p>
        </form>
      </section>
    </>
  );
}

function CardPaymentSection({
  priceUsd,
  buttonId,
  sdkReady,
}: {
  priceUsd: number;
  buttonId?: string;
  sdkReady: boolean;
}) {
  return (
    <section
      aria-labelledby="card-pay-title"
      className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-primary/12 blur-3xl"
      />
      <header className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-[var(--color-deep-red)] text-white shadow-md">
            <CreditCard className="size-5" />
          </div>
          <div>
            <span className="inline-grid size-6 place-items-center rounded-md border border-[var(--color-border-strong)] bg-elevated text-[11px] font-extrabold text-foreground">
              A
            </span>
            <h3
              id="card-pay-title"
              className="mt-2 font-display text-base font-extrabold text-foreground sm:text-lg"
            >
              ادفع بالبطاقة مباشرة
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              فيزا أو ماستركارد — معالجة آمنة عبر PayPal. لا نخزن بيانات
              بطاقتك.
            </p>
          </div>
        </div>
        <span
          dir="ltr"
          className="rounded-full border border-[var(--color-border-strong)] bg-elevated px-2.5 py-1 text-[10px] font-bold text-muted-2"
        >
          {formatPrice(priceUsd, "USD")}
        </span>
      </header>

      <div className="relative mt-5">
        {!buttonId ? (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p className="text-xs leading-relaxed">
              زر الدفع بالبطاقة غير مُعد لهذا الكورس بعد. استخدم الدفع
              بالعملة الرقمية أدناه، أو تواصل مع الإدارة.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card/80 p-5">
            <div className="relative min-h-[52px]">
              {!sdkReady && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-4 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin" />
                  جاري تحميل زر الدفع...
                </div>
              )}
              <div id={`paypal-container-${buttonId}`} className="w-full" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-2">
              <ShieldCheck className="size-3.5 text-[var(--color-red-300)]" />
              بعد إتمام الدفع، انسخ Transaction ID من صفحة التأكيد أو بريد
              PayPal والصقه أسفل الصفحة.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CryptoSection({ priceUsd }: { priceUsd: number }) {
  return (
    <section
      aria-labelledby="crypto-pay-title"
      className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-12 -bottom-24 size-72 rounded-full bg-[#f0b90b]/8 blur-3xl"
      />

      <header className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#9945ff] to-[#14f195] text-white shadow-md">
            <Bitcoin className="size-5" />
          </div>
          <div>
            <span className="inline-grid size-6 place-items-center rounded-md border border-[var(--color-border-strong)] bg-elevated text-[11px] font-extrabold text-foreground">
              B
            </span>
            <h3
              id="crypto-pay-title"
              className="mt-2 font-display text-base font-extrabold text-foreground sm:text-lg"
            >
              ادفع بالعملة الرقمية
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              حوّل ما يعادل{" "}
              <span dir="ltr" className="font-bold text-foreground">
                {formatPrice(priceUsd, "USD")}
              </span>{" "}
              إلى إحدى الخيارين أدناه، ثم ألصق رقم العملية في النموذج.
            </p>
          </div>
        </div>
      </header>

      <div className="relative mt-5 grid gap-3 lg:grid-cols-2">
        <CryptoAddressCard
          icon={<Layers className="size-4" />}
          accent="from-[#9945ff] to-[#14f195]"
          network="Solana Network"
          address={SOLANA_ADDRESS}
          hint="USDC أو USDT على شبكة Solana — تأكد من اختيار شبكة Solana في محفظتك قبل الإرسال."
        />
        <CryptoAddressCard
          icon={<Wallet className="size-4" />}
          accent="from-[#f0b90b] to-[#7a5b00]"
          network="Binance ID"
          address={BINANCE_ID}
          hint="استخدم Binance Pay داخل تطبيق Binance وحوّل إلى هذا الـ ID مباشرة."
        />
      </div>

      <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold">قبل ما تحوّل</p>
          <p className="mt-1 text-amber-100/90">
            تأكد من المبلغ والعنوان أو الـ ID قبل الإرسال — التحويلات
            بالعملة الرقمية لا يمكن استرجاعها. احتفظ بـ Transaction Hash
            من محفظتك لإرساله أسفل الصفحة.
          </p>
        </div>
      </div>
    </section>
  );
}

function CryptoAddressCard({
  icon,
  accent,
  network,
  address,
  hint,
}: {
  icon: React.ReactNode;
  accent: string;
  network: string;
  address: string;
  hint: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("تم نسخ العنوان");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذر النسخ — انسخ العنوان يدويًا");
    }
  }

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-card/80 p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgba(75,188,99,0.4)]",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accent,
        )}
      />

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg bg-gradient-to-br text-white",
            accent,
          )}
        >
          {icon}
        </span>
        <h4 className="font-display text-sm font-extrabold text-foreground">
          {network}
        </h4>
      </div>

      <button
        type="button"
        onClick={copy}
        aria-label={`نسخ ${network}: ${address}`}
        className={cn(
          "mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-3 text-start transition-colors",
          "hover:border-primary/50 hover:bg-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        )}
      >
        <span
          dir="ltr"
          className="min-w-0 flex-1 break-all font-mono text-xs font-bold tracking-tight text-foreground sm:text-sm"
        >
          {address}
        </span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
            copied
              ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
              : "bg-primary/10 text-[var(--color-red-300)]",
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              نسخ
            </>
          )}
        </span>
      </button>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-2">{hint}</p>
    </article>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ShieldCheck,
  Globe2,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { COPY } from "@/lib/arabic";
import { formatPrice } from "@/lib/utils";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAAfzHP3KHRLtrIMQaGopoG8HlWvPsrNIqsbGxHg-SGFELurasC0ECt330vOGg-5Y3VxJ9Q0U7fcUGuYbo";

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

export function PaypalCheckoutCard({ course }: { course: Course }) {
  const router = useRouter();
  const [sdkReady, setSdkReady] = React.useState(false);
  const [buttonRendered, setButtonRendered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [reference, setReference] = React.useState("");
  const [note, setNote] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const buttonId = course.paypalHostedButtonId?.trim();
  const hasPriceUsd = typeof course.priceUsd === "number" && course.priceUsd > 0;
  const isConfigured = Boolean(buttonId && hasPriceUsd);

  React.useEffect(() => {
    if (!sdkReady || !isConfigured || buttonRendered) return;
    if (!window.paypal?.HostedButtons || !buttonId) return;
    if (!containerRef.current) return;

    try {
      window.paypal
        .HostedButtons({ hostedButtonId: buttonId })
        .render(`#paypal-container-${buttonId}`);
      setButtonRendered(true);
    } catch (err) {
      console.error("[paypal] hosted button render failed", err);
    }
  }, [sdkReady, isConfigured, buttonRendered, buttonId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = reference.trim();
    if (ref.length < 4) {
      setErrors({ reference: "أدخل رقم العملية كما يظهر في PayPal" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.set("courseId", course.id);
      fd.set("paymentMethod", "PAYPAL");
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
          سنراجع عملية PayPal ونفعّل اشتراكك في أقرب وقت. سيصلك إشعار حال
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

  if (!isConfigured) {
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
              لم يقم المسؤول بضبط سعر PayPal أو زر الدفع لهذا الكورس بعد.
              تواصل مع الإدارة لإكمال الاشتراك.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => setSdkReady(true)}
        onReady={() => setSdkReady(true)}
      />

      <section
        aria-labelledby="paypal-title"
        className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-[#0070ba]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-12 -bottom-24 size-72 rounded-full bg-[#003087]/10 blur-3xl"
        />

        <header className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0070ba]/30 bg-[#0070ba]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[#5aa8ff]">
              <Globe2 className="size-3.5" />
              الدفع الدولي عبر PayPal
            </span>
            <h2
              id="paypal-title"
              className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              ادفع بأمان عبر PayPal
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              ادفع{" "}
              <span
                dir="ltr"
                className="font-bold text-foreground"
              >
                {formatPrice(course.priceUsd!, "USD")}
              </span>{" "}
              بضغطة واحدة، ثم الصق رقم العملية أدناه لتفعيل اشتراكك.
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

        <div className="relative mt-6 rounded-2xl border border-[var(--color-border-strong)] bg-card/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#0070ba] to-[#003087] text-white shadow-md">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-extrabold text-foreground">
                  PayPal Checkout
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  معالجة آمنة عبر PayPal — لا نخزن بيانات بطاقتك.
                </p>
              </div>
            </div>
            <span
              dir="ltr"
              className="rounded-full border border-[var(--color-border-strong)] bg-elevated px-2.5 py-1 text-[10px] font-bold text-muted-2"
            >
              {formatPrice(course.priceUsd!, "USD")}
            </span>
          </div>

          <div className="relative mt-5 min-h-[52px]">
            {!sdkReady && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-4 text-sm text-muted">
                <Loader2 className="size-4 animate-spin" />
                جاري تحميل PayPal...
              </div>
            )}
            <div
              ref={containerRef}
              id={`paypal-container-${buttonId}`}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="paypal-confirm-title"
        className="mt-6 rounded-3xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <header className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-2">
            خطوة 2 من 2
          </p>
          <h2
            id="paypal-confirm-title"
            className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            أكّد الدفع — الصق رقم العملية من PayPal
          </h2>
          <p className="mt-1 text-sm text-muted">
            بعد إتمام الدفع، انسخ <span dir="ltr">Transaction ID</span> من
            صفحة التأكيد أو بريد PayPal والصقه هنا.
          </p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <Label htmlFor="reference">PayPal Transaction ID</Label>
            <Input
              id="reference"
              dir="ltr"
              autoComplete="off"
              placeholder="مثال: 1AB23456CD789012E"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              maxLength={120}
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
              placeholder="أي تفاصيل تساعد في المراجعة"
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

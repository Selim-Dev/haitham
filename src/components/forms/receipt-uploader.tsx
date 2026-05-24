"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Image as ImageIcon, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { CouponField } from "@/components/payment/coupon-field";
import { COPY } from "@/lib/arabic";
import { RECEIPT_UPLOAD } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
};

export function ReceiptUploader({ course }: { course: Course }) {
  const router = useRouter();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<string>(String(course.price));
  const [reference, setReference] = React.useState("");
  const [note, setNote] = React.useState("");
  const [couponCode, setCouponCode] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  function pickFile(f: File | null) {
    setErrors((e) => ({ ...e, file: "" }));
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!RECEIPT_UPLOAD.ALLOWED_MIME_TYPES.includes(f.type as never)) {
      setErrors((e) => ({ ...e, file: "نوع الملف غير مدعوم. JPG, PNG, أو PDF." }));
      return;
    }
    if (f.size > RECEIPT_UPLOAD.MAX_SIZE_BYTES) {
      setErrors((e) => ({ ...e, file: "الحد الأقصى ٥ ميجابايت." }));
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!file) e.file = "ملف الإيصال مطلوب";
    const amt = Number(amount);
    if (!amt || amt <= 0) e.amount = "المبلغ مطلوب ويجب أن يكون أكبر من صفر";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.set("courseId", course.id);
    fd.set("amount", String(amount));
    fd.set("currency", course.currency);
    if (reference) fd.set("transactionReference", reference);
    if (note) fd.set("userNote", note);
    if (couponCode) fd.set("couponCode", couponCode);
    if (file) fd.set("file", file);

    setSubmitting(true);
    try {
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
      toast.success("تم إرسال الإيصال للمراجعة.");
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
          تم الإرسال بنجاح
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {COPY.payment.success}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/dashboard/payment-proofs")} variant="primary" size="md">
            عرض إيصالاتي
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="ghost" size="md">
            لوحة التعلم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[1fr_0.7fr]" noValidate>
      <div className="flex flex-col gap-5">
        {/* File drop zone */}
        <div>
          <Label>{COPY.payment.file}</Label>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) pickFile(f);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-[var(--color-border-strong)] bg-surface hover:border-primary/40",
            )}
          >
            <input
              type="file"
              accept={RECEIPT_UPLOAD.ALLOWED_EXTENSIONS.map((x) => `.${x}`).join(",")}
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            {file ? (
              <div className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-card p-3 text-start">
                {preview ? (
                  <img
                    src={preview}
                    alt="معاينة"
                    className="size-14 rounded-lg object-cover"
                  />
                ) : file.type === "application/pdf" ? (
                  <div className="grid size-14 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]">
                    <FileText className="size-6" />
                  </div>
                ) : (
                  <div className="grid size-14 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]">
                    <ImageIcon className="size-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted">
                    {(file.size / 1024).toFixed(0)} كيلوبايت
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    pickFile(null);
                  }}
                  className="grid size-8 place-items-center rounded-full bg-card text-muted hover:bg-elevated"
                  aria-label="إزالة"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="size-8 text-[var(--color-red-300)]" />
                <p className="text-sm font-semibold text-foreground">
                  اضغط لاختيار الملف أو اسحبه هنا
                </p>
                <p className="text-xs text-muted">{COPY.payment.fileHint}</p>
              </>
            )}
          </label>
          <FieldError message={errors.file} />
        </div>

        <CouponField
          courseId={course.id}
          value={couponCode}
          onChange={setCouponCode}
          onApplied={(applied) => {
            // When the server confirms a discount, sync the amount field
            // so the student sees the expected post-discount total. If they
            // clear the coupon, snap back to the full course price.
            if (applied) {
              setAmount(String(applied.expectedAmount));
            } else {
              setAmount(String(course.price));
            }
          }}
        />

        <div>
          <Label htmlFor="amount">{COPY.payment.amount}</Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            dir="ltr"
            className="text-end"
          />
          <FieldError message={errors.amount} />
        </div>

        <div>
          <Label htmlFor="reference">
            {COPY.payment.reference}{" "}
            <span className="font-normal text-muted-2">(اختياري)</span>
          </Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="مثال: TXN1234567890"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="note">
            {COPY.payment.note}{" "}
            <span className="font-normal text-muted-2">(اختياري)</span>
          </Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="أي تفاصيل إضافية تساعد في مراجعة الإيصال"
          />
        </div>

        <Button type="submit" size="lg" loading={submitting}>
          {COPY.payment.submit}
        </Button>
      </div>

      <aside className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
        <h3 className="font-display text-base font-bold text-foreground">
          ملخص الطلب
        </h3>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-surface p-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-elevated">
            {course.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.thumbnailUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center font-display text-xl font-black text-primary/30">
                AH
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {course.title}
            </p>
            <p className="mt-0.5 text-xs text-muted">سعر الكورس</p>
          </div>
          <span className="font-display text-base font-extrabold text-foreground">
            {formatPrice(course.price, course.currency)}
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-surface p-3 text-xs leading-relaxed text-muted">
          بعد إرسال الإيصال، سيقوم فريق الإدارة بمراجعته خلال أقصر وقت ممكن.
          ستصلك الموافقة في صفحة كورساتي.
        </div>
      </aside>
    </form>
  );
}

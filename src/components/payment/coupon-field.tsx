"use client";

import * as React from "react";
import { TicketPercent, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, toArabicNumerals } from "@/lib/utils";

type ValidResult = {
  valid: true;
  coupon: {
    id: string;
    code: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
  };
  applied: { discountAmount: number; expectedAmount: number };
  currency: "EGP" | "USD";
  baseAmount: number;
};

type InvalidResult = {
  valid: false;
  reason: string;
  message: string;
};

type ApiResult = ValidResult | InvalidResult;

// Shared coupon-code field used by both the domestic receipt-uploader and
// the international checkout card. Owns its own validation state — calls
// POST /api/coupons/validate against the entered code + courseId.
//
// The parent passes the controlled `value` (the raw code string, included
// in the submitted FormData under the name `couponCode`) and listens for
// `onApplied` to update its visible amount field when a valid coupon
// shrinks the price.

export function CouponField({
  value,
  onChange,
  courseId,
  onApplied,
}: {
  value: string;
  onChange: (code: string) => void;
  courseId: string;
  /** Fired with the applied discount when the server confirms the code,
   *  or `null` when the field is cleared / the code becomes invalid. */
  onApplied?: (
    applied: {
      discountAmount: number;
      expectedAmount: number;
      currency: "EGP" | "USD";
    } | null,
  ) => void;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<ApiResult | null>(null);

  async function applyCode() {
    const code = value.trim().toUpperCase();
    if (!code) {
      setResult(null);
      onApplied?.(null);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, courseId }),
      });
      const json = (await res.json()) as ApiResult;
      setResult(json);
      if (json.valid) {
        onApplied?.({
          discountAmount: json.applied.discountAmount,
          expectedAmount: json.applied.expectedAmount,
          currency: json.currency,
        });
      } else {
        onApplied?.(null);
      }
    } catch {
      setResult({
        valid: false,
        reason: "NETWORK",
        message: "تعذّر التحقق من الكوبون. حاول مرة أخرى.",
      });
      onApplied?.(null);
    } finally {
      setSubmitting(false);
    }
  }

  function clear() {
    onChange("");
    setResult(null);
    onApplied?.(null);
  }

  return (
    <div>
      <Label htmlFor="couponCode">
        كود الخصم{" "}
        <span className="font-normal text-muted-2">(اختياري)</span>
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <TicketPercent
            aria-hidden="true"
            className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-2"
          />
          <Input
            id="couponCode"
            dir="ltr"
            placeholder="SUMMER50"
            value={value}
            maxLength={32}
            onChange={(e) => {
              onChange(e.target.value.toUpperCase());
              // Reset result so we don't claim a stale code is still valid.
              if (result) {
                setResult(null);
                onApplied?.(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyCode();
              }
            }}
            className="pe-9 font-mono uppercase"
          />
        </div>
        {result?.valid ? (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={clear}
            className="shrink-0"
          >
            إزالة
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={applyCode}
            disabled={submitting || !value.trim()}
            className="shrink-0"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "تطبيق"
            )}
          </Button>
        )}
      </div>

      {result?.valid && (
        <div
          className={cn(
            "mt-3 flex items-start gap-3 rounded-xl border border-[var(--color-success)]/30",
            "bg-[var(--color-success)]/8 p-3",
          )}
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-bold text-foreground">
              تم تطبيق الكوبون{" "}
              <span dir="ltr" className="font-mono">
                {result.coupon.code}
              </span>
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
              <span className="text-muted">
                خصم{" "}
                <span
                  dir="ltr"
                  className="font-bold text-[var(--color-success)]"
                >
                  {result.coupon.type === "PERCENTAGE"
                    ? `${toArabicNumerals(result.coupon.value)}%`
                    : formatPrice(
                        result.applied.discountAmount,
                        result.currency,
                      )}
                </span>
              </span>
              <span className="text-muted-2">·</span>
              <span className="text-muted">
                السعر بعد الخصم{" "}
                <span dir="ltr" className="font-bold text-foreground">
                  {formatPrice(result.applied.expectedAmount, result.currency)}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {result && !result.valid && (
        <div
          className="mt-3 flex items-start gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/8 p-3"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-[var(--color-danger)]" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-bold text-foreground">{result.message}</p>
            <p className="mt-0.5 text-xs text-muted-2">
              يمكنك المتابعة بدون كوبون أو تجربة كود آخر.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

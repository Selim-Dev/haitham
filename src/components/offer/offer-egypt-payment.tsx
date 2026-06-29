"use client";

import * as React from "react";
import {
  Smartphone,
  Building2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Light-themed Egypt payment display for the offer landing page. Numbers MUST
// stay in sync with src/components/payment/payment-methods-card.tsx (the dark
// dashboard variant) — same recipient accounts, different theme.
type Method = {
  id: "instapay" | "bank";
  letter: "A" | "B";
  title: string;
  subtitle: string;
  number: string;
  icon: React.ReactNode;
  accent: string;
  badge: string;
  notes: string[];
};

const METHODS: Method[] = [
  {
    id: "instapay",
    letter: "A",
    title: "إنستاباي ومحفظة كاش",
    subtitle: "الأسرع — تحويل فوري من أي شبكة",
    number: "01280468426",
    icon: <Smartphone className="size-5" />,
    accent: "from-[#4bbc63] to-[#2d8541]",
    badge: "تحويل فقط",
    notes: ["تحويل فقط من كل الشبكات", "من فضلك لا تتصل بالرقم"],
  },
  {
    id: "bank",
    letter: "B",
    title: "بنك الإسكندرية",
    subtitle: "للحوالات البنكية المباشرة",
    number: "112037549001",
    icon: <Building2 className="size-5" />,
    accent: "from-[#1d4ed8] to-[#0c2a6b]",
    badge: "حوالة بنكية",
    notes: ["تحويل لرقم الحساب أعلاه"],
  },
];

export function OfferEgyptPayment() {
  return (
    <section aria-labelledby="offer-pay-title" className="text-start">
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold tracking-wider text-[#2d8541]">
          <ShieldCheck className="size-3.5" />
          دفع آمن — تحقق يدوي من الإدارة
        </span>
        <h3
          id="offer-pay-title"
          className="font-display text-lg font-extrabold text-neutral-900"
        >
          اختر وسيلة الدفع
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">
          حوّل المبلغ بإحدى الطريقتين، ثم ابعت صورة الإيصال على واتساب من الزر
          بالأسفل وسنفعّل طلبك بأسرع وقت.
        </p>
      </header>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {METHODS.map((m) => (
          <MethodCard key={m.id} method={m} />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold">قبل ما تحوّل</p>
          <p className="mt-1 text-amber-700">
            تأكد من المبلغ والرقم. لا توجد مكالمات لتأكيد الدفع — التواصل يكون عبر
            واتساب فقط.
          </p>
        </div>
      </div>
    </section>
  );
}

function MethodCard({ method }: { method: Method }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(method.number);
      setCopied(true);
      toast.success("تم نسخ الرقم");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذر النسخ — انسخ الرقم يدويًا");
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4bbc63]/50 hover:shadow-md">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l",
          method.accent,
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm",
              method.accent,
            )}
          >
            {method.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md border border-neutral-200 bg-neutral-50 text-[11px] font-extrabold text-neutral-700">
                {method.letter}
              </span>
              <h4 className="font-display text-base font-extrabold text-neutral-900">
                {method.title}
              </h4>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">{method.subtitle}</p>
          </div>
        </div>
        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-bold text-neutral-500">
          {method.badge}
        </span>
      </div>

      <button
        type="button"
        onClick={copy}
        aria-label={`نسخ ${method.title}: ${method.number}`}
        className={cn(
          "mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 transition-colors",
          "hover:border-[#4bbc63]/60 hover:bg-green-50/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4bbc63]/50",
        )}
      >
        <span
          dir="ltr"
          className="font-display text-xl font-black tracking-wider text-neutral-900 tabular-nums"
        >
          {method.number}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
            copied
              ? "bg-green-100 text-green-700"
              : "bg-green-50 text-[#1f5d2e]",
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

      {method.notes.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {method.notes.map((n) => (
            <li
              key={n}
              className="flex items-start gap-2 text-xs leading-relaxed text-neutral-500"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#4bbc63]/70"
              />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

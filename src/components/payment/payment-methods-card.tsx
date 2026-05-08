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
    accent: "from-[#E50914] to-[#7a0a10]",
    badge: "تحويل فقط",
    notes: [
      "تحويل فقط من كل الشبكات",
      "من فضلك لا تتصل بالرقم",
    ],
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

export function PaymentMethodsCard() {
  return (
    <section
      aria-labelledby="payment-methods-title"
      className="relative overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-[var(--color-red-300)]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-12 -bottom-24 size-72 rounded-full bg-[#1d4ed8]/10 blur-3xl"
      />

      <header className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--color-red-300)]">
            <ShieldCheck className="size-3.5" />
            دفع آمن — تحقق يدوي من الإدارة
          </span>
          <h2
            id="payment-methods-title"
            className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
          >
            اختر وسيلة الدفع
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            حوّل المبلغ بإحدى الطريقتين، ثم ارفع الإيصال أسفل الصفحة. سنقوم
            بالمراجعة في أقرب وقت.
          </p>
        </div>
        <div className="hidden text-end sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-2">
            خطوة 1 من 2
          </p>
          <p className="mt-1 text-xs font-medium text-muted">
            ادفع · ثم ارفع الإيصال
          </p>
        </div>
      </header>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-2">
        {METHODS.map((m) => (
          <MethodCard key={m.id} method={m} />
        ))}
      </div>

      <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="text-sm leading-relaxed">
          <p className="font-bold">قبل ما تحول</p>
          <p className="mt-1 text-amber-100/90">
            تأكد من المبلغ والرقم. لا توجد مكالمات لتأكيد الدفع — كل التواصل
            يكون عبر مراجعة الإيصال داخل المنصة.
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
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-card/80 p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgba(229,9,20,0.4)]",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          method.accent,
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md",
              method.accent,
            )}
          >
            {method.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md border border-[var(--color-border-strong)] bg-elevated text-[11px] font-extrabold text-foreground">
                {method.letter}
              </span>
              <h3 className="font-display text-base font-extrabold text-foreground">
                {method.title}
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-muted">{method.subtitle}</p>
          </div>
        </div>
        <span className="rounded-full border border-[var(--color-border-strong)] bg-elevated px-2.5 py-1 text-[10px] font-bold text-muted-2">
          {method.badge}
        </span>
      </div>

      <button
        type="button"
        onClick={copy}
        aria-label={`نسخ ${method.title}: ${method.number}`}
        className={cn(
          "mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-3 transition-colors",
          "hover:border-primary/50 hover:bg-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        )}
      >
        <span
          dir="ltr"
          className="font-display text-xl font-black tracking-wider text-foreground tabular-nums"
        >
          {method.number}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
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

      {method.notes.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {method.notes.map((n) => (
            <li
              key={n}
              className="flex items-start gap-2 text-xs leading-relaxed text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-red-300)]/70"
              />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

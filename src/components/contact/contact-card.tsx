"use client";

import * as React from "react";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ContactCardProps = {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  value: string;
  displayValue?: string;
  href: string;
  cta: string;
  accent: string;
};

export function ContactCard({
  icon,
  label,
  subtitle,
  value,
  displayValue,
  href,
  cta,
  accent,
}: ContactCardProps) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("تم النسخ");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذر النسخ — انسخ يدويًا");
    }
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-gradient-to-br from-card via-card to-elevated p-6 shadow-[var(--shadow-card)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-red-glow)] sm:p-8",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accent,
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-12 -top-16 size-44 rounded-full bg-primary/12 blur-3xl"
      />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md",
            accent,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-extrabold leading-tight text-foreground sm:text-xl">
            {label}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={copy}
        aria-label={`نسخ ${label}: ${value}`}
        className={cn(
          "relative mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-3 text-start transition-colors",
          "hover:border-primary/50 hover:bg-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        )}
      >
        <span
          dir="ltr"
          className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-foreground sm:text-base"
        >
          {displayValue ?? value}
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

      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className={cn(
          "relative mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-bold text-white shadow-md transition-all duration-200",
          "bg-gradient-to-l hover:-translate-y-0.5",
          accent,
          "hover:shadow-[0_12px_28px_-8px_rgba(75,188,99,0.55)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {cta}
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      </a>
    </article>
  );
}

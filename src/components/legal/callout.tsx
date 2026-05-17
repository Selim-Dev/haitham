import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warning" | "danger" | "highlight";

const VARIANT_STYLES: Record<
  Variant,
  { container: string; iconWrap: string; title: string }
> = {
  info: {
    container:
      "border-sky-400/30 bg-sky-400/10 text-sky-100",
    iconWrap: "bg-sky-400/15 text-sky-300",
    title: "text-sky-200",
  },
  success: {
    container:
      "border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-foreground/90",
    iconWrap: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
    title: "text-[var(--color-success)]",
  },
  warning: {
    container: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    iconWrap: "bg-amber-400/15 text-amber-300",
    title: "text-amber-200",
  },
  danger: {
    container:
      "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-foreground/90",
    iconWrap: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
    title: "text-[var(--color-danger)]",
  },
  highlight: {
    container:
      "border-primary/30 bg-primary/10 text-foreground/90",
    iconWrap: "bg-primary/15 text-[var(--color-red-300)]",
    title: "text-[var(--color-red-300)]",
  },
};

export function Callout({
  variant = "info",
  title,
  icon,
  children,
  className,
}: {
  variant?: Variant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 text-sm leading-[1.85]",
        styles.container,
        className,
      )}
    >
      {(title || icon) && (
        <div className="mb-2 flex items-center gap-2">
          {icon && (
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg",
                styles.iconWrap,
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          {title && (
            <h4 className={cn("font-display text-base font-extrabold", styles.title)}>
              {title}
            </h4>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-1 [&_li]:relative [&_li]:ps-5 [&_li:before]:content-[''] [&_li:before]:absolute [&_li:before]:top-[0.7em] [&_li:before]:start-0 [&_li:before]:size-1.5 [&_li:before]:rounded-full [&_li:before]:bg-current [&_li:before]:opacity-70 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}

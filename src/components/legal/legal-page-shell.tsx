import * as React from "react";
import { Container } from "@/components/ui/container";

export function LegalPageShell({
  eyebrow,
  title,
  subtitle,
  updatedAt,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 start-1/2 -z-10 h-48 w-[80%] -translate-x-1/2 rounded-full bg-radial-red opacity-40 blur-3xl"
          />
          <div className="text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-wider text-[var(--color-red-300)]">
              {eyebrow}
            </p>
            <h1 className="font-display text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              <span className="bg-gradient-to-l from-foreground via-foreground to-[var(--color-red-300)] bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-relaxed text-muted sm:text-base">
                {subtitle}
              </p>
            )}
            {updatedAt && (
              <p className="mt-3 text-xs text-muted-2">
                آخر تحديث: {updatedAt}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6">{children}</div>
      </div>
    </Container>
  );
}

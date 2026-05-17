import * as React from "react";

export function LegalSection({
  number,
  title,
  children,
}: {
  number?: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-[var(--color-red-300)] via-primary to-transparent"
      />
      <header className="mb-5 flex items-start gap-3 border-b border-[var(--color-border)] pb-4">
        {number !== undefined && (
          <span className="grid min-h-8 min-w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-[var(--color-red-300)] px-2 text-sm font-extrabold text-white shadow-md">
            {number}
          </span>
        )}
        <h2 className="font-display text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </header>
      <div className="flex flex-col gap-4 text-sm leading-[1.85] text-foreground/85 sm:text-[15px] [&_p]:text-pretty [&_strong]:font-bold [&_strong]:text-foreground [&_h3]:mt-2 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[var(--color-red-300)] sm:[&_h3]:text-lg [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-1 [&_li]:relative [&_li]:ps-5 [&_li:before]:content-[''] [&_li:before]:absolute [&_li:before]:top-[0.7em] [&_li:before]:start-0 [&_li:before]:size-1.5 [&_li:before]:rounded-full [&_li:before]:bg-[var(--color-red-300)]/70 [&_a]:text-[var(--color-red-300)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary">
        {children}
      </div>
    </section>
  );
}

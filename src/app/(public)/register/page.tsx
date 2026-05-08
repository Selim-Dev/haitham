import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { RegisterForm } from "@/components/forms/register-form";
import { COPY } from "@/lib/arabic";

export const metadata: Metadata = { title: COPY.auth.registerTitle };

export default function RegisterPage() {
  return (
    <Container className="min-h-[calc(100vh-4rem)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[var(--color-red-300)]">
            {COPY.auth.stepOne}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.auth.registerTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {COPY.auth.registerSubtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </Container>
  );
}

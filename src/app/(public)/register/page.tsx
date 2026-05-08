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
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.auth.registerTitle}
          </h1>
          <p className="mt-2 text-sm text-muted">
            انضم لأكاديمية أحمد هيثم وابدأ رحلتك.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </Container>
  );
}

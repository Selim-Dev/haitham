import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { COPY } from "@/lib/arabic";

export const metadata: Metadata = { title: COPY.auth.resetTitle };

export default function ResetPasswordPage() {
  return (
    <Container className="min-h-[calc(100vh-4rem)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.auth.resetTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {COPY.auth.resetSubtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          {/* Suspense boundary required because ResetPasswordForm calls
              useSearchParams — otherwise the entire route opts out of
              static rendering with a build warning. */}
          <Suspense
            fallback={
              <div className="text-center text-sm text-muted">
                {COPY.common.loading}
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}

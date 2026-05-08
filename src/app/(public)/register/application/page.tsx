import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ApplicationForm } from "@/components/forms/application-form";
import { listActiveQuestions } from "@/services/application-question.service";
import { getCurrentUser } from "@/lib/auth";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: COPY.application.pageTitle };

export default async function ApplicationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/register/application");
  if (user.role === "ADMIN") redirect("/admin");
  if (
    user.approvalStatus === "PENDING_REVIEW" ||
    user.approvalStatus === "REJECTED"
  ) {
    redirect("/awaiting-approval");
  }
  if (user.approvalStatus === "APPROVED") redirect("/dashboard");

  const questions = await listActiveQuestions();

  return (
    <Container className="min-h-[calc(100vh-4rem)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[var(--color-red-300)]">
            {COPY.auth.stepTwo}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.application.pageTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {COPY.application.pageSubtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <ApplicationForm questions={questions} />
        </div>
      </div>
    </Container>
  );
}

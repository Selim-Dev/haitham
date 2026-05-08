import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Hourglass, Mail, ShieldX, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";
import { getCurrentUser } from "@/lib/auth";
import { getMyApplicationStatus } from "@/services/application.service";
import { COPY } from "@/lib/arabic";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: COPY.application.waitingTitle,
};

export default async function AwaitingApprovalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.approvalStatus === "PENDING_APPLICATION") {
    redirect("/register/application");
  }
  if (user.approvalStatus === "APPROVED") redirect("/dashboard");

  const status = await getMyApplicationStatus(user.id);
  const submittedAt = status?.applicationSubmittedAt;
  const reviewedAt = status?.reviewedAt;
  const isRejected = user.approvalStatus === "REJECTED";

  return (
    <Container className="min-h-[calc(100vh-4rem)] py-16">
      <div className="mx-auto w-full max-w-xl">
        <div
          className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-[var(--shadow-card)] sm:p-12 ${
            isRejected
              ? "border-[var(--color-danger)]/30 bg-card"
              : "border-primary/30 bg-card"
          }`}
        >
          <div
            className={`mx-auto grid size-20 place-items-center rounded-2xl ${
              isRejected
                ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                : "bg-primary/15 text-[var(--color-red-300)]"
            }`}
          >
            {isRejected ? (
              <ShieldX className="size-10" strokeWidth={1.5} />
            ) : (
              <Hourglass className="size-10" strokeWidth={1.5} />
            )}
          </div>

          <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            {isRejected
              ? COPY.application.rejectedTitle
              : COPY.application.waitingTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            {isRejected
              ? COPY.application.rejectedBody
              : COPY.application.waitingBody}
          </p>

          {!isRejected && (
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-elevated/40 p-4 text-start">
              <Row
                icon={<Mail className="size-4 text-[var(--color-red-300)]" />}
                label="بريدك المسجل"
                value={user.email}
                dir="ltr"
              />
              {submittedAt && (
                <Row
                  icon={
                    <ShieldCheck className="size-4 text-[var(--color-success)]" />
                  }
                  label="تاريخ إرسال الاستمارة"
                  value={formatDate(submittedAt)}
                />
              )}
            </div>
          )}

          {isRejected && reviewedAt && (
            <p className="mt-4 text-xs text-muted-2">
              تاريخ المراجعة: {formatDate(reviewedAt)}
            </p>
          )}
          {isRejected && status?.adminNote && (
            <div className="mx-auto mt-4 max-w-md rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-start text-sm text-[var(--color-danger)]">
              <p className="font-bold">ملاحظة الإدارة</p>
              <p className="mt-1 whitespace-pre-line">{status.adminNote}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LogoutButton variant="ghost" size="md" />
            <Button asChild variant="primary" size="md">
              <Link href="/courses">تصفح الكورسات</Link>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-2">
          سيصلك إشعار على بريدك حال اعتماد طلبك. تأكد من تفقد صندوق الوارد
          والمهملات.
        </p>
      </div>
    </Container>
  );
}

function Row({
  icon,
  label,
  value,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-2">
        {icon}
        {label}
      </div>
      <span dir={dir} className="text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

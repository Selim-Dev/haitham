import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicationReviewActions } from "@/components/admin/application-review-actions";
import { getApplicationDetail } from "@/services/application.service";
import {
  APPROVAL_STATUS_AR,
  type ApprovalStatus,
} from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<
  ApprovalStatus,
  "warning" | "success" | "danger" | "outline"
> = {
  PENDING_APPLICATION: "outline",
  PENDING_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getApplicationDetail(id);
  if (!app) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/applications" className="hover:text-foreground">
          {COPY.admin.applications}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">
          {COPY.admin.application.detailTitle}
        </span>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            {COPY.admin.application.detailTitle}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {app.applicationSubmittedAt
              ? `تم الإرسال: ${formatDate(app.applicationSubmittedAt)}`
              : `سُجِّل: ${formatDate(app.createdAt)}`}
          </p>
        </div>
        <Badge
          variant={STATUS_VARIANT[app.approvalStatus]}
          className="px-3 py-1.5"
        >
          {APPROVAL_STATUS_AR[app.approvalStatus]}
        </Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              {COPY.admin.application.answers}
            </h2>
            {app.answers.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                لم يقم الطالب بتعبئة الاستمارة بعد.
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-4">
                {app.answers.map((a, i) => (
                  <li
                    key={`${a.questionId}-${i}`}
                    className="rounded-xl border border-[var(--color-border)] bg-elevated/40 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">
                      السؤال {i + 1}
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {a.question}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {a.answer}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {app.adminNote && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
              <h3 className="text-sm font-bold text-foreground">
                ملاحظة الإدارة
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                {app.adminNote}
              </p>
              {app.reviewedBy && app.reviewedAt && (
                <p className="mt-3 text-xs text-muted-2">
                  بواسطة {app.reviewedBy.name} · {formatDate(app.reviewedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
            <h3 className="font-display text-base font-bold text-foreground">
              {COPY.admin.application.basicData}
            </h3>
            <dl className="mt-3 grid gap-2 text-sm">
              <Row label="الاسم" value={app.name} />
              <Row label={COPY.auth.email} value={app.email} dir="ltr" />
              {app.phone && (
                <Row label={COPY.auth.phone} value={app.phone} dir="ltr" />
              )}
              <Row label="تاريخ التسجيل" value={formatDate(app.createdAt)} />
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-5">
            <ApplicationReviewActions
              userId={app.id}
              status={app.approvalStatus}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-1.5 last:border-0">
      <dt className="text-xs font-medium text-muted-2">{label}</dt>
      <dd
        className="truncate text-sm font-semibold text-foreground"
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}

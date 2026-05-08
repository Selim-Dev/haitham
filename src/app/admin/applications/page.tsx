import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { listApplications } from "@/services/application.service";
import {
  APPROVAL_STATUS_AR,
  type ApprovalStatus,
} from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { cn, formatDate, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS: { label: string; value: ApprovalStatus | "ALL" }[] = [
  { label: "الكل", value: "ALL" },
  { label: APPROVAL_STATUS_AR.PENDING_REVIEW, value: "PENDING_REVIEW" },
  { label: APPROVAL_STATUS_AR.PENDING_APPLICATION, value: "PENDING_APPLICATION" },
  { label: APPROVAL_STATUS_AR.APPROVED, value: "APPROVED" },
  { label: APPROVAL_STATUS_AR.REJECTED, value: "REJECTED" },
];

const STATUS_VARIANT: Record<
  ApprovalStatus,
  "warning" | "success" | "danger" | "outline"
> = {
  PENDING_APPLICATION: "outline",
  PENDING_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

function isApprovalStatus(value: string | undefined): value is ApprovalStatus {
  return (
    value === "PENDING_APPLICATION" ||
    value === "PENDING_REVIEW" ||
    value === "APPROVED" ||
    value === "REJECTED"
  );
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = isApprovalStatus(sp.status) ? sp.status : undefined;
  const items = await listApplications({ status });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.application.listTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {COPY.admin.application.listSubtitle}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const active =
            (t.value === "ALL" && !status) || t.value === status;
          const href =
            t.value === "ALL"
              ? "/admin/applications"
              : `/admin/applications?status=${t.value}`;
          return (
            <Link
              key={t.value}
              href={href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-[var(--color-border-strong)] bg-card text-muted hover:text-foreground hover:border-primary/40",
              )}
            >
              {t.label}
            </Link>
          );
        })}
        <span className="ms-auto text-xs text-muted-2">
          {toArabicNumerals(items.length)}{" "}
          {items.length === 1 ? "طلب" : "طلبات"}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title={
            status
              ? COPY.admin.application.emptyFiltered
              : COPY.admin.application.emptyAll
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <ul className="divide-y divide-[var(--color-border)]">
            {items.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/applications/${u.id}`}
                  className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-elevated"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-elevated text-[var(--color-red-300)]">
                    <ClipboardList className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {u.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-2">
                      <span dir="ltr">{u.email}</span>
                      {u.phone && <span dir="ltr">{u.phone}</span>}
                      <span>
                        {u.applicationSubmittedAt
                          ? `تم الإرسال: ${formatDate(u.applicationSubmittedAt)}`
                          : `سُجِّل: ${formatDate(u.createdAt)}`}
                      </span>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[u.approvalStatus]}>
                    {APPROVAL_STATUS_AR[u.approvalStatus]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import {
  Users,
  BookOpen,
  Receipt,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getAdminStats,
  getRecentPaymentProofs,
} from "@/services/analytics.service";
import { COPY } from "@/lib/arabic";
import { PAYMENT_STATUS_AR, type PaymentStatus } from "@/lib/constants";
import { formatDate, formatPrice, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<PaymentStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function AdminHome() {
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getRecentPaymentProofs(6),
  ]);

  const cards = [
    {
      label: COPY.admin.stats.users,
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: COPY.admin.stats.courses,
      value: stats.totalCourses,
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      label: COPY.admin.stats.pendingPayments,
      value: stats.pendingPayments,
      icon: Receipt,
      href: "/admin/payments",
      tone: "warning" as const,
    },
    {
      label: COPY.admin.stats.activeEnrollments,
      value: stats.activeEnrollments,
      icon: GraduationCap,
      href: "/admin/enrollments",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          نظرة عامة على المنصة ومراجعة العمليات الأخيرة.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group rounded-2xl border border-[var(--color-border)] bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-red-glow)]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={
                    c.tone === "warning"
                      ? "grid size-10 place-items-center rounded-lg bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
                      : "grid size-10 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]"
                  }
                >
                  <Icon className="size-5" />
                </div>
                <ArrowLeft className="size-4 text-muted-2 transition-transform group-hover:-translate-x-1 group-hover:text-foreground" />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-2">
                {c.label}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                {toArabicNumerals(c.value)}
              </p>
            </Link>
          );
        })}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            مدفوعات حديثة
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/payments">
              عرض الكل
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>

        {recent.length === 0 ? (
          <EmptyState title="لا توجد مدفوعات بعد" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
            <ul className="divide-y divide-[var(--color-border)]">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/payments/${p.id}`}
                    className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-elevated"
                  >
                    <div className="grid size-10 place-items-center rounded-lg bg-elevated text-[var(--color-red-300)]">
                      <Receipt className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {p.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-2">
                        {p.course?.title ?? "—"} · {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-foreground">
                        {formatPrice(p.amount, p.currency)}
                      </span>
                      <Badge
                        variant={STATUS_VARIANT[p.status as PaymentStatus]}
                      >
                        {PAYMENT_STATUS_AR[p.status as PaymentStatus]}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, Receipt, Sparkles, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { listMyEnrollments } from "@/services/enrollment.service";
import { listMyPaymentProofs } from "@/services/payment.service";
import { COPY } from "@/lib/arabic";
import { PAYMENT_STATUS_AR } from "@/lib/constants";
import { formatPrice, formatDate, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const [enrollments, proofs] = await Promise.all([
    listMyEnrollments(user.id).catch(() => []),
    listMyPaymentProofs(user.id).catch(() => []),
  ]);

  const pending = proofs.filter((p) => p.status === "PENDING");
  const rejected = proofs.filter((p) => p.status === "REJECTED");

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-l from-[#0b2814] via-[#0b0b0f] to-[#0b0b0f] p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 size-72 rounded-full bg-radial-red blur-3xl opacity-70"
        />
        <div className="relative flex flex-col items-start gap-3">
          <Badge variant="primary">
            <Sparkles className="size-3" />
            {COPY.dashboard.continue}
          </Badge>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
            {COPY.dashboard.welcome}, {user.name}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            تابع كورساتك وتقدّمك من هنا. وصولك مدى الحياة على كل ما اشتركت فيه.
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<GraduationCap className="size-5" />}
          label={COPY.dashboard.myCourses}
          value={toArabicNumerals(enrollments.length)}
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label={COPY.dashboard.pendingPayments}
          value={toArabicNumerals(pending.length)}
          tone={pending.length ? "warning" : "default"}
        />
        <StatCard
          icon={<Receipt className="size-5" />}
          label={COPY.dashboard.paymentProofs}
          value={toArabicNumerals(proofs.length)}
        />
      </section>

      {/* Enrolled courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            {COPY.dashboard.myCourses}
          </h2>
          {enrollments.length > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/my-courses">
                عرض الكل
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          )}
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-6" />}
            title={COPY.dashboard.noEnrollments}
            description="كورساتك المعتمدة ستظهر هنا فور موافقة الإدارة على إيصال الدفع."
            action={
              <Button asChild variant="primary">
                <Link href="/courses">تصفح الكورسات</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.slice(0, 6).map((e) => (
              <CourseCard
                key={e.enrollmentId}
                course={{
                  id: e.course.id,
                  slug: e.course.slug,
                  title: e.course.title,
                  shortDescription: e.course.shortDescription,
                  thumbnailUrl: e.course.thumbnailUrl,
                  category: e.course.category,
                  level: e.course.level as never,
                  lessonsCount: e.course.lessonsCount,
                  durationLabel: e.course.durationLabel,
                  price: e.course.price,
                  currency: e.course.currency,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pending / Rejected proofs */}
      {(pending.length > 0 || rejected.length > 0) && (
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">
            حالة طلبات الدفع
          </h2>
          <div className="flex flex-col gap-3">
            {[...pending, ...rejected].map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-elevated text-[var(--color-red-300)]">
                    <Receipt className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {p.course?.title ?? "كورس"}
                    </p>
                    <p className="text-xs text-muted-2">
                      {formatPrice(p.amount, p.currency)} ·{" "}
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={p.status === "PENDING" ? "warning" : "danger"}
                  className="px-3 py-1"
                >
                  {PAYMENT_STATUS_AR[p.status]}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-card p-5">
      <div className="flex items-center gap-3">
        <div
          className={
            tone === "warning"
              ? "grid size-10 place-items-center rounded-lg bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
              : "grid size-10 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]"
          }
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-2">
            {label}
          </p>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

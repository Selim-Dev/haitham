import Link from "next/link";
import { Plus, TicketPercent, Percent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listAdminCoupons, type CouponStatus } from "@/services/admin-coupon.service";
import { formatDate, formatPrice, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_AR: Record<CouponStatus, string> = {
  ACTIVE: "مفعّل",
  EXPIRED: "منتهي الصلاحية",
  EXHAUSTED: "اكتمل الاستخدام",
  DISABLED: "موقّف",
};

const STATUS_VARIANT: Record<
  CouponStatus,
  "success" | "warning" | "danger" | "outline"
> = {
  ACTIVE: "success",
  EXPIRED: "danger",
  EXHAUSTED: "warning",
  DISABLED: "outline",
};

export default async function AdminCouponsPage() {
  const coupons = await listAdminCoupons();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-[var(--color-red-300)]">
            <TicketPercent className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              الكوبونات
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              أنشئ كوبونات خصم ووزّعها على الطلاب. الكوبون يطبَّق كمعاينة في
              نموذج الدفع، ويسجَّل على إيصال الدفع لمراجعتك.
            </p>
          </div>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/admin/coupons/new">
            <Plus className="size-4" />
            كوبون جديد
          </Link>
        </Button>
      </header>

      {coupons.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-card p-12 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-[var(--color-red-300)]">
            <Tag className="size-6" />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">
            لا توجد كوبونات بعد
          </h2>
          <p className="text-sm text-muted">
            أنشئ كوبونك الأول لمنح الطلاب خصمًا على الكورسات.
          </p>
          <Button asChild variant="primary" size="md">
            <Link href="/admin/coupons/new">
              <Plus className="size-4" />
              كوبون جديد
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-strong)] bg-card shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-strong)] bg-elevated">
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  الكود
                </th>
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  النوع والقيمة
                </th>
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  الاستخدام
                </th>
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  ينتهي في
                </th>
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  الحالة
                </th>
                <th className="px-4 py-3 text-start font-display text-xs font-extrabold text-muted-2 sm:px-6 sm:py-4">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-0.5">
                      <span
                        dir="ltr"
                        className="font-mono text-sm font-extrabold text-foreground"
                      >
                        {c.code}
                      </span>
                      <span className="text-[11px] text-muted-2">
                        {c.appliesToAllCourses
                          ? "كل الكورسات"
                          : `${toArabicNumerals(c.courseIds.length)} كورس`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    {c.type === "PERCENTAGE" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-[var(--color-red-300)]">
                        <Percent className="size-3" />
                        {toArabicNumerals(c.percentageValue ?? 0)}%
                      </span>
                    ) : (
                      <div className="flex flex-col gap-0.5 text-xs text-foreground">
                        <span dir="ltr">{formatPrice(c.fixedValueEgp ?? 0, "EGP")}</span>
                        <span dir="ltr" className="text-muted-2">
                          {formatPrice(c.fixedValueUsd ?? 0, "USD")}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                    <span dir="ltr">
                      {toArabicNumerals(c.usedCount)} / {toArabicNumerals(c.maxUses)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-muted sm:px-6">
                    {formatDate(c.expiresAt)}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Badge variant={STATUS_VARIANT[c.status]}>
                      {STATUS_AR[c.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/coupons/${c.id}/edit`}>تعديل</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CouponForm } from "@/components/admin/coupon-form";
import {
  getAdminCoupon,
  listCoursesForCouponPicker,
} from "@/services/admin-coupon.service";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [coupon, availableCourses] = await Promise.all([
    getAdminCoupon(id),
    listCoursesForCouponPicker(),
  ]);
  if (!coupon) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/coupons" className="hover:text-foreground">
          الكوبونات
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">تعديل: {coupon.code}</span>
      </div>
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          تعديل الكوبون
        </h1>
      </header>
      <CouponForm
        mode="edit"
        couponId={coupon.id}
        availableCourses={availableCourses}
        initial={{
          code: coupon.code,
          type: coupon.type,
          percentageValue: coupon.percentageValue,
          fixedValueEgp: coupon.fixedValueEgp,
          fixedValueUsd: coupon.fixedValueUsd,
          maxUses: coupon.maxUses,
          expiresAt: coupon.expiresAt,
          appliesToAllCourses: coupon.appliesToAllCourses,
          courseIds: coupon.courseIds,
          isActive: coupon.isActive,
        }}
      />
    </div>
  );
}

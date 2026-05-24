import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CouponForm } from "@/components/admin/coupon-form";
import { listCoursesForCouponPicker } from "@/services/admin-coupon.service";

export const dynamic = "force-dynamic";

export default async function NewCouponPage() {
  const availableCourses = await listCoursesForCouponPicker();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/coupons" className="hover:text-foreground">
          الكوبونات
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">كوبون جديد</span>
      </div>
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          كوبون جديد
        </h1>
        <p className="mt-2 text-sm text-muted">
          أنشئ كوبون خصم بنسبة مئوية أو مبلغ ثابت (بالعملتين).
        </p>
      </header>
      <CouponForm mode="create" availableCourses={availableCourses} />
    </div>
  );
}

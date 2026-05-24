"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Percent, DollarSign, Tag, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  couponInputSchema,
  type CouponInput,
  type CouponInputForm,
} from "@/validators/coupon.validator";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

type Mode = "create" | "edit";

type CourseOption = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
};

// The `Partial<CouponInput>` shape narrows `expiresAt` to `Date`, but the
// edit page passes us the raw value off Mongo (could be Date or already
// serialized to string by `.lean()`). Override with the broader union so
// the YYYY-MM-DD normalisation below works without a cast.
type FormDefaults = Omit<Partial<CouponInput>, "expiresAt" | "courseIds"> & {
  expiresAt?: string | Date;
  courseIds?: string[];
};

export function CouponForm({
  mode,
  initial,
  couponId,
  availableCourses,
}: {
  mode: Mode;
  initial?: FormDefaults;
  couponId?: string;
  availableCourses: CourseOption[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = React.useState(false);

  // ISO `2026-06-01T00:00:00.000Z` doesn't fit `<input type=date>`; use a
  // YYYY-MM-DD shape derived from the initial date.
  const initialExpires = (() => {
    const raw = initial?.expiresAt;
    if (raw instanceof Date) return raw.toISOString().slice(0, 10);
    if (typeof raw === "string" && raw.length >= 10) return raw.slice(0, 10);
    return "";
  })();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponInputForm, unknown, CouponInput>({
    resolver: zodResolver(couponInputSchema),
    defaultValues: {
      code: initial?.code ?? "",
      type: initial?.type ?? "PERCENTAGE",
      percentageValue: initial?.percentageValue ?? undefined,
      fixedValueEgp: initial?.fixedValueEgp ?? undefined,
      fixedValueUsd: initial?.fixedValueUsd ?? undefined,
      maxUses: initial?.maxUses ?? 1,
      expiresAt: initialExpires as unknown as Date,
      appliesToAllCourses: initial?.appliesToAllCourses ?? false,
      courseIds: initial?.courseIds ?? [],
      isActive: initial?.isActive ?? true,
    },
  });

  const type = watch("type");
  const appliesToAll = watch("appliesToAllCourses");
  const selectedCourseIds = watch("courseIds") ?? [];

  function toggleCourse(id: string, checked: boolean) {
    const current = selectedCourseIds;
    const next = checked
      ? Array.from(new Set([...current, id]))
      : current.filter((c) => c !== id);
    setValue("courseIds", next, { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(data: CouponInput) {
    const url =
      mode === "create"
        ? "/api/admin/coupons"
        : `/api/admin/coupons/${couponId}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // Re-serialize the date as ISO so it survives the JSON round-trip.
          expiresAt:
            data.expiresAt instanceof Date
              ? data.expiresAt.toISOString()
              : data.expiresAt,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(mode === "create" ? "تم إنشاء الكوبون." : "تم حفظ التعديلات.");
      router.push("/admin/coupons");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    }
  }

  async function onDelete() {
    if (!couponId) return;
    if (!confirm("هل تريد حذف هذا الكوبون نهائيًا؟")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success("تم حذف الكوبون.");
      router.push("/admin/coupons");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="code">كود الكوبون</Label>
          <Input
            id="code"
            dir="ltr"
            placeholder="مثال: SUMMER50"
            className="font-mono uppercase"
            {...register("code")}
          />
          <FieldError message={errors.code?.message} />
          <p className="mt-1.5 text-xs text-muted-2">
            حروف لاتينية كبيرة، أرقام، _ أو - (٣–٣٢ حرفًا). يتم التحويل لحروف كبيرة تلقائيًا.
          </p>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-elevated/40 p-4">
          <Label>نوع الخصم</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                type === "PERCENTAGE"
                  ? "border-primary/60 bg-primary/10"
                  : "border-[var(--color-border-strong)] hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                value="PERCENTAGE"
                {...register("type")}
                className="mt-0.5 accent-primary"
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Percent className="size-3.5" />
                  نسبة مئوية
                </span>
                <span className="mt-0.5 text-[11px] text-muted-2">
                  قيمة واحدة تنطبق على الجنيه والدولار.
                </span>
              </div>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                type === "FIXED"
                  ? "border-primary/60 bg-primary/10"
                  : "border-[var(--color-border-strong)] hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                value="FIXED"
                {...register("type")}
                className="mt-0.5 accent-primary"
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <DollarSign className="size-3.5" />
                  مبلغ ثابت
                </span>
                <span className="mt-0.5 text-[11px] text-muted-2">
                  حدد قيمتين: واحدة بالجنيه وواحدة بالدولار.
                </span>
              </div>
            </label>
          </div>
          <FieldError message={errors.type?.message} />

          {type === "PERCENTAGE" ? (
            <div className="mt-4">
              <Label htmlFor="percentageValue">نسبة الخصم (%)</Label>
              <Input
                id="percentageValue"
                type="number"
                min={1}
                max={100}
                step={1}
                dir="ltr"
                placeholder="25"
                {...register("percentageValue", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined ? undefined : Number(v),
                })}
              />
              <FieldError message={errors.percentageValue?.message} />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fixedValueEgp">قيمة الخصم بالجنيه (EGP)</Label>
                <Input
                  id="fixedValueEgp"
                  type="number"
                  min={0}
                  step="0.01"
                  dir="ltr"
                  placeholder="200"
                  {...register("fixedValueEgp", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined ? undefined : Number(v),
                  })}
                />
                <FieldError message={errors.fixedValueEgp?.message} />
              </div>
              <div>
                <Label htmlFor="fixedValueUsd">قيمة الخصم بالدولار (USD)</Label>
                <Input
                  id="fixedValueUsd"
                  type="number"
                  min={0}
                  step="0.01"
                  dir="ltr"
                  placeholder="10"
                  {...register("fixedValueUsd", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined ? undefined : Number(v),
                  })}
                />
                <FieldError message={errors.fixedValueUsd?.message} />
              </div>
              <p className="text-xs text-muted-2 sm:col-span-2">
                كلاهما مطلوب لأن أسعار الكورسات بعملتين. الخدمة تختار القيمة المناسبة وقت التطبيق.
              </p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="maxUses">الحد الأقصى للاستخدام</Label>
          <Input
            id="maxUses"
            type="number"
            min={1}
            step={1}
            dir="ltr"
            {...register("maxUses", { valueAsNumber: true })}
          />
          <FieldError message={errors.maxUses?.message} />
          <p className="mt-1.5 text-xs text-muted-2">
            عدد مرات الاستخدام الإجمالي عبر جميع الطلاب.
          </p>
        </div>

        <div>
          <Label htmlFor="expiresAt">تاريخ انتهاء الصلاحية</Label>
          <Input
            id="expiresAt"
            type="date"
            dir="ltr"
            {...register("expiresAt")}
          />
          <FieldError message={errors.expiresAt?.message} />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-elevated/40 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("appliesToAllCourses")}
              className="size-4 accent-[var(--color-primary)]"
            />
            <div>
              <span className="block text-sm font-bold text-foreground">
                يطبّق على كل الكورسات
              </span>
              <span className="mt-0.5 block text-[11px] text-muted-2">
                عند تفعيله، لا حاجة لاختيار كورسات محددة.
              </span>
            </div>
          </label>

          {!appliesToAll && (
            <div className="mt-4">
              <Label>الكورسات المتاحة</Label>
              <FieldError message={errors.courseIds?.message as string | undefined} />
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {availableCourses.length === 0 ? (
                  <p className="text-xs text-muted-2">لا توجد كورسات بعد.</p>
                ) : (
                  availableCourses.map((c) => {
                    const checked = selectedCourseIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                          checked
                            ? "border-primary/60 bg-primary/10"
                            : "border-[var(--color-border-strong)] hover:border-primary/40",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => toggleCourse(c.id, e.target.checked)}
                          className="mt-0.5 accent-primary"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {c.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-2">
                            {c.slug} {c.isPublished ? "" : "· غير منشور"}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-card p-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="size-4 accent-[var(--color-primary)]"
            />
            <div>
              <span className="block text-sm font-bold text-foreground">
                مفعّل
              </span>
              <span className="mt-0.5 block text-[11px] text-muted-2">
                إلغاء التفعيل يعطّل الكوبون فورًا دون حذفه.
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button type="submit" size="lg" loading={isSubmitting}>
            <Tag className="size-4" />
            {mode === "create" ? "إنشاء الكوبون" : "حفظ التعديلات"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
          >
            {COPY.common.cancel}
          </Button>
        </div>
        {mode === "edit" && (
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            حذف
          </Button>
        )}
      </div>
    </form>
  );
}

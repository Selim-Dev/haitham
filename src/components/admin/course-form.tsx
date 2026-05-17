"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { ThumbnailUploader } from "@/components/admin/thumbnail-uploader";
import {
  courseInputSchema,
  type CourseInput,
  type CourseInputForm,
} from "@/validators/course.validator";
import { COURSE_LEVELS, COURSE_LEVEL_AR } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { slugify } from "@/lib/utils";

type Mode = "create" | "edit";

export function CourseForm({
  mode,
  initial,
  courseId,
}: {
  mode: Mode;
  initial?: Partial<CourseInput>;
  courseId?: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CourseInputForm, unknown, CourseInput>({
    resolver: zodResolver(courseInputSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      shortDescription: initial?.shortDescription ?? "",
      price: initial?.price ?? 0,
      currency: initial?.currency ?? "EGP",
      priceUsd: initial?.priceUsd ?? "",
      paypalHostedButtonId: initial?.paypalHostedButtonId ?? "",
      thumbnailUrl: initial?.thumbnailUrl ?? "",
      category: initial?.category ?? "",
      level: initial?.level ?? "BEGINNER",
      durationLabel: initial?.durationLabel ?? "",
      isPublished: initial?.isPublished ?? false,
      featured: initial?.featured ?? false,
    },
  });

  const title = watch("title");
  React.useEffect(() => {
    if (mode === "create" && !dirtyFields.slug && title) {
      setValue("slug", slugify(title));
    }
  }, [title, mode, dirtyFields.slug, setValue]);

  const onSubmit = async (data: CourseInput) => {
    const url =
      mode === "create"
        ? "/api/admin/courses"
        : `/api/admin/courses/${courseId}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(mode === "create" ? "تم إنشاء الكورس." : "تم حفظ التعديلات.");
      router.push("/admin/courses");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">عنوان الكورس</Label>
          <Input id="title" {...register("title")} />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <Label htmlFor="slug">المعرّف (slug)</Label>
          <Input id="slug" dir="ltr" {...register("slug")} />
          <FieldError message={errors.slug?.message} />
        </div>

        <div>
          <Label htmlFor="category">{COPY.courses.filterCategory}</Label>
          <Input
            id="category"
            list="categories"
            placeholder="مثال: تطوير الذات"
            {...register("category")}
          />
          <datalist id="categories">
            <option value="تطوير الذات" />
            <option value="مهارات عملية" />
            <option value="عقلية وانضباط" />
            <option value="بيزنس" />
          </datalist>
          <FieldError message={errors.category?.message} />
        </div>

        <div>
          <Label htmlFor="level">{COPY.courses.filterLevel}</Label>
          <select
            id="level"
            {...register("level")}
            className="h-11 w-full rounded-lg border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
          >
            {Object.values(COURSE_LEVELS).map((lv) => (
              <option key={lv} value={lv}>
                {COURSE_LEVEL_AR[lv]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="price">السعر داخل مصر (EGP)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            dir="ltr"
            {...register("price", { valueAsNumber: true })}
          />
          <FieldError message={errors.price?.message} />
        </div>

        <div>
          <Label htmlFor="currency">العملة المحلية</Label>
          <Input id="currency" dir="ltr" {...register("currency")} />
          <p className="mt-1.5 text-xs text-muted-2">
            افتراضيًا EGP. تنطبق على المشتركين داخل مصر.
          </p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="durationLabel">المدة (نص)</Label>
          <Input
            id="durationLabel"
            placeholder="مثال: ٣ ساعات"
            {...register("durationLabel")}
          />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-elevated/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                تسعير دولي / PayPal
              </h3>
              <p className="mt-0.5 text-xs text-muted-2">
                للمشتركين خارج مصر. اتركه فارغًا لإخفاء البيع الدولي لهذا
                الكورس.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="priceUsd">السعر خارج مصر (USD)</Label>
              <Input
                id="priceUsd"
                type="number"
                min="0"
                step="0.01"
                dir="ltr"
                placeholder="29"
                {...register("priceUsd", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined ? "" : Number(v),
                })}
              />
              <FieldError message={errors.priceUsd?.message} />
            </div>

            <div>
              <Label htmlFor="paypalHostedButtonId">
                PayPal Hosted Button ID
              </Label>
              <Input
                id="paypalHostedButtonId"
                dir="ltr"
                placeholder="ZSVCNMW79RTDN"
                className="font-mono uppercase"
                {...register("paypalHostedButtonId")}
              />
              <FieldError message={errors.paypalHostedButtonId?.message} />
              <p className="mt-1.5 text-xs text-muted-2">
                أنشئ زر PayPal Hosted لهذا الكورس على لوحة PayPal، ثم الصق
                الـ ID هنا.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>صورة الغلاف</Label>
          <ThumbnailUploader
            value={watch("thumbnailUrl") ?? ""}
            onChange={(url) =>
              setValue("thumbnailUrl", url, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <FieldError message={errors.thumbnailUrl?.message} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="shortDescription">وصف قصير</Label>
          <Textarea
            id="shortDescription"
            rows={2}
            maxLength={280}
            {...register("shortDescription")}
          />
          <FieldError message={errors.shortDescription?.message} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">الوصف الكامل</Label>
          <Textarea id="description" rows={6} {...register("description")} />
          <FieldError message={errors.description?.message} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-card p-3">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-semibold text-foreground">
            منشور للعامة
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-card p-3">
          <input
            type="checkbox"
            {...register("featured")}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-semibold text-foreground">
            مميز (في الصفحة الرئيسية)
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {mode === "create" ? "إنشاء الكورس" : "حفظ التعديلات"}
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
    </form>
  );
}

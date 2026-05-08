"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  adminCreateUserSchema,
  type AdminCreateUserInput,
  type AdminCreateUserInputForm,
} from "@/validators/auth.validator";
import { COPY } from "@/lib/arabic";

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  let p = "";
  // ensure 1 of each class
  p += upper[Math.floor(Math.random() * upper.length)];
  p += lower[Math.floor(Math.random() * lower.length)];
  p += digits[Math.floor(Math.random() * digits.length)];
  p += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 0; i < 10; i++)
    p += all[Math.floor(Math.random() * all.length)];
  // shuffle
  return p
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export function UserForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateUserInputForm, unknown, AdminCreateUserInput>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: AdminCreateUserInput) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(`تم إنشاء المستخدم: ${json.user?.name ?? data.name}`);
      router.push("/admin/users");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="user-name">{COPY.auth.name}</Label>
          <Input
            id="user-name"
            autoComplete="off"
            placeholder="مثال: أحمد محمد"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="user-email">{COPY.auth.email}</Label>
          <Input
            id="user-email"
            type="email"
            dir="ltr"
            autoComplete="off"
            placeholder="user@example.com"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="user-phone">
            {COPY.auth.phone}{" "}
            <span className="font-normal text-muted-2">(اختياري)</span>
          </Label>
          <Input
            id="user-phone"
            type="tel"
            dir="ltr"
            autoComplete="off"
            placeholder="+20 100 000 0000"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-end justify-between">
            <Label htmlFor="user-password">{COPY.auth.password}</Label>
            <button
              type="button"
              onClick={() => {
                const p = generatePassword();
                setValue("password", p, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                setShowPassword(true);
                toast.success("تم توليد كلمة مرور قوية");
              }}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-red-300)] transition-colors hover:text-primary"
            >
              <Wand2 className="size-3.5" />
              توليد كلمة مرور
            </button>
          </div>
          <div className="relative">
            <Input
              id="user-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="٨ أحرف على الأقل"
              dir="ltr"
              className="pl-11 text-end"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-2 hover:text-foreground"
              aria-label={showPassword ? "إخفاء" : "إظهار"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
          <p className="mt-1.5 text-xs text-muted-2">
            شارك كلمة المرور مع المستخدم بطريقة آمنة. يمكنه تغييرها لاحقًا.
          </p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="user-role">الدور</Label>
          <select
            id="user-role"
            {...register("role")}
            className="h-11 w-full rounded-lg border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
          >
            <option value="STUDENT">طالب (STUDENT)</option>
            <option value="ADMIN">إدارة (ADMIN)</option>
          </select>
          <p className="mt-1.5 text-xs text-muted-2">
            الإدارة لها صلاحية كاملة على لوحة التحكم. الطالب يصل فقط لكورساته.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          إنشاء المستخدم
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

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/validators/auth.validator";
import { COPY } from "@/lib/arabic";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(`أهلًا بك في ${COPY.brand.academy}`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div>
        <Label htmlFor="name">{COPY.auth.name}</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="مثال: أحمد محمد"
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">{COPY.auth.email}</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="phone">
            {COPY.auth.phone}{" "}
            <span className="text-muted-2 font-normal">(اختياري)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder="+20 100 000 0000"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="password">{COPY.auth.password}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="٨ أحرف على الأقل"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">{COPY.auth.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <Button type="submit" size="lg" loading={isSubmitting}>
        {COPY.auth.submitRegister}
      </Button>

      <p className="mt-2 text-center text-sm text-muted">
        {COPY.auth.haveAccount}{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-red-300)] hover:text-primary"
        >
          {COPY.nav.login}
        </Link>
      </p>
    </form>
  );
}

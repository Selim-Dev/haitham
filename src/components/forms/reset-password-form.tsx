"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/validators/auth.validator";
import { COPY } from "@/lib/arabic";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  // No-token / malformed-token short-circuit. The schema also enforces
  // min(32) so any token clearly under that threshold gets the same
  // "invalid link" panel rather than a confusing zod field error.
  if (!token || token.length < 32) {
    return (
      <div className="flex flex-col gap-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-danger/40 bg-danger/10">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7 text-danger"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">
            {COPY.auth.resetLinkInvalidTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {COPY.auth.resetLinkInvalidBody}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild size="md">
            <Link href="/forgot-password">{COPY.auth.requestNewLink}</Link>
          </Button>
          <Button asChild variant="ghost" size="md">
            <Link href="/login">{COPY.auth.backToLogin}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Surface the server message on the password field when it's a
        // token-state error (400), since that's actionable.
        if (res.status === 400) {
          setError("token", {
            type: "server",
            message: json.error || COPY.auth.resetLinkExpired,
          });
        }
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(COPY.auth.resetSuccess);
      router.push("/login");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <input type="hidden" {...register("token")} value={token} readOnly />

      <div>
        <Label htmlFor="password">{COPY.auth.resetNewPassword}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          placeholder="٨ أحرف على الأقل"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">
          {COPY.auth.resetConfirmPassword}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      {errors.token?.message ? (
        <div
          className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          <p>{errors.token.message}</p>
          <p className="mt-2">
            <Link
              href="/forgot-password"
              className="font-semibold underline-offset-2 hover:underline"
            >
              {COPY.auth.requestNewLink}
            </Link>
          </p>
        </div>
      ) : null}

      <Button type="submit" size="lg" loading={isSubmitting}>
        {COPY.auth.resetSubmit}
      </Button>

      <p className="mt-2 text-center text-sm text-muted">
        <Link
          href="/login"
          className="font-semibold text-[var(--color-red-300)] hover:text-primary"
        >
          {COPY.auth.backToLogin}
        </Link>
      </p>
    </form>
  );
}

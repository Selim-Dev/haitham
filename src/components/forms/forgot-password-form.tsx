"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/validators/auth.validator";
import { COPY } from "@/lib/arabic";

export function ForgotPasswordForm() {
  // The success panel intentionally does NOT reveal whether the email was
  // registered — it appears for any successful submission, matching the
  // no-enumeration guarantee on the server.
  const [sent, setSent] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      setSubmittedEmail(data.email);
      setSent(true);
    } catch {
      toast.error(COPY.common.error);
    }
  };

  if (sent) {
    return (
      <div
        className="flex flex-col gap-5 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7 text-[var(--color-primary)]"
          >
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">
            {COPY.auth.forgotSuccessTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {COPY.auth.forgotSuccessBody}
          </p>
          {submittedEmail ? (
            <p
              dir="ltr"
              className="mt-3 text-sm font-semibold text-foreground/90"
            >
              {submittedEmail}
            </p>
          ) : null}
          <p className="mt-3 text-xs leading-relaxed text-muted-2">
            {COPY.auth.forgotSuccessHint}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild variant="secondary" size="md">
            <Link href="/login">{COPY.auth.backToLogin}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-xs font-semibold text-muted hover:text-foreground"
          >
            {COPY.auth.requestNewLink}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div>
        <Label htmlFor="email">{COPY.auth.email}</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <Button type="submit" size="lg" loading={isSubmitting}>
        {COPY.auth.forgotSubmit}
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

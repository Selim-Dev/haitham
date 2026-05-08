"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { COPY } from "@/lib/arabic";
import type { PublicQuestion } from "@/services/application-question.service";

export function ApplicationForm({
  questions,
}: {
  questions: PublicQuestion[];
}) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function setAnswer(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    for (const q of questions) {
      const v = (values[q.id] ?? "").trim();
      if (q.required && !v) {
        next[q.id] = "هذه الإجابة مطلوبة";
      } else if (v.length > 4000) {
        next[q.id] = "الإجابة طويلة جدًا";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("راجع الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    const answers = questions
      .map((q) => ({
        questionId: q.id,
        answer: (values[q.id] ?? "").trim(),
      }))
      .filter((a) => a.answer.length > 0);

    try {
      const res = await fetch("/api/auth/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(COPY.application.success);
      router.push("/awaiting-approval");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 text-center text-sm text-muted">
        {COPY.application.noQuestions}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      {questions.map((q, idx) => {
        const id = `q-${q.id}`;
        const value = values[q.id] ?? "";
        return (
          <div key={q.id}>
            <Label htmlFor={id}>
              <span className="text-xs font-semibold text-muted-2">
                {idx + 1}.
              </span>{" "}
              {q.label}
              {q.required && (
                <span className="ms-1 text-[var(--color-red-300)]">*</span>
              )}
            </Label>
            {q.helperText && (
              <p className="-mt-1 mb-2 text-xs leading-relaxed text-muted-2">
                {q.helperText}
              </p>
            )}
            {q.type === "long" ? (
              <Textarea
                id={id}
                rows={4}
                maxLength={4000}
                value={value}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="اكتب إجابتك هنا..."
              />
            ) : q.type === "select" ? (
              <select
                id={id}
                value={value}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
              >
                <option value="">— اختر —</option>
                {(q.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={id}
                maxLength={500}
                value={value}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="اكتب إجابتك هنا..."
              />
            )}
            <FieldError message={errors[q.id]} />
          </div>
        );
      })}

      <Button type="submit" size="lg" loading={submitting}>
        {submitting ? COPY.application.submitting : COPY.application.submit}
      </Button>
    </form>
  );
}

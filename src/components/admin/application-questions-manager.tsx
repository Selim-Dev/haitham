"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ListChecks,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import {
  applicationQuestionSchema,
  type ApplicationQuestionInput,
  type ApplicationQuestionInputForm,
} from "@/validators/application.validator";
import { COPY } from "@/lib/arabic";
import type { AdminQuestion } from "@/services/application-question.service";

export function ApplicationQuestionsManager({
  initial,
}: {
  initial: AdminQuestion[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<AdminQuestion | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<AdminQuestion | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function toggleActive(q: AdminQuestion) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/application-questions/${q.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !q.isActive }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(q.isActive ? "تم إخفاء السؤال" : "تم إظهار السؤال");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
    }
  }

  async function move(q: AdminQuestion, direction: -1 | 1) {
    const newOrder = q.order + direction;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/application-questions/${q.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: Math.max(0, newOrder) }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
    }
  }

  async function destroy(q: AdminQuestion) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/application-questions/${q.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success("تم حذف السؤال");
      setDeleting(null);
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={() => setCreating(true)}
          >
            <Plus className="size-4" />
            {COPY.admin.application.questions.addNew}
          </Button>
        </div>

        {initial.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="size-6" />}
            title={COPY.admin.application.questions.empty}
            description="ابدأ بإضافة أول سؤال لاستمارة الانضمام."
            action={
              <Button variant="primary" onClick={() => setCreating(true)}>
                <Plus className="size-4" />
                {COPY.admin.application.questions.addNew}
              </Button>
            }
          />
        ) : (
          <ol className="flex flex-col gap-3">
            {initial.map((q, idx) => (
              <li
                key={q.id}
                className="rounded-2xl border border-[var(--color-border)] bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-2">
                        #{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        {q.label}
                      </h3>
                      {q.required ? (
                        <Badge variant="primary">مطلوب</Badge>
                      ) : (
                        <Badge variant="outline">اختياري</Badge>
                      )}
                      <Badge variant={q.isActive ? "success" : "outline"}>
                        {q.isActive ? "ظاهر" : "مخفي"}
                      </Badge>
                      <Badge variant="default">
                        {q.type === "short"
                          ? COPY.admin.application.questions.typeShort
                          : q.type === "long"
                            ? COPY.admin.application.questions.typeLong
                            : COPY.admin.application.questions.typeSelect}
                      </Badge>
                    </div>
                    {q.helperText && (
                      <p className="mt-2 text-xs text-muted">{q.helperText}</p>
                    )}
                    {q.type === "select" && q.options && q.options.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {q.options.map((opt) => (
                          <li
                            key={opt}
                            className="rounded-md border border-[var(--color-border-strong)] bg-elevated px-2 py-0.5 text-xs text-muted"
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={busy || idx === 0}
                      onClick={() => move(q, -1)}
                      className="grid size-8 place-items-center rounded-md border border-[var(--color-border-strong)] text-muted hover:text-foreground disabled:opacity-40"
                      aria-label="نقل لأعلى"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busy || idx === initial.length - 1}
                      onClick={() => move(q, 1)}
                      className="grid size-8 place-items-center rounded-md border border-[var(--color-border-strong)] text-muted hover:text-foreground disabled:opacity-40"
                      aria-label="نقل لأسفل"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => toggleActive(q)}
                      className="grid size-8 place-items-center rounded-md border border-[var(--color-border-strong)] text-muted hover:text-foreground disabled:opacity-40"
                      aria-label={q.isActive ? "إخفاء" : "إظهار"}
                    >
                      {q.isActive ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(q)}
                      className="grid size-8 place-items-center rounded-md border border-[var(--color-border-strong)] text-muted hover:text-foreground"
                      aria-label="تعديل"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(q)}
                      className="grid size-8 place-items-center rounded-md border border-[var(--color-border-strong)] text-danger hover:bg-danger/10"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {(creating || editing) && (
        <QuestionFormDialog
          question={editing}
          nextOrder={initial.length}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={COPY.admin.application.questions.deleteConfirm}
        description="لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        variant="danger"
        onConfirm={() => deleting && destroy(deleting)}
        onCancel={() => setDeleting(null)}
        loading={busy}
      />
    </>
  );
}

function QuestionFormDialog({
  question,
  nextOrder,
  onClose,
  onSaved,
}: {
  question: AdminQuestion | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationQuestionInputForm, unknown, ApplicationQuestionInput>({
    resolver: zodResolver(applicationQuestionSchema),
    defaultValues: {
      label: question?.label ?? "",
      helperText: question?.helperText ?? "",
      type: question?.type ?? "short",
      options: question?.options ?? [],
      required: question?.required ?? true,
      isActive: question?.isActive ?? true,
      order: question?.order ?? nextOrder,
    },
  });

  const type = watch("type");
  const [optionsText, setOptionsText] = React.useState(
    (question?.options ?? []).join("\n"),
  );

  React.useEffect(() => {
    const lines = optionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("options", lines);
  }, [optionsText, setValue]);

  const onSubmit = async (data: ApplicationQuestionInput) => {
    const payload = {
      ...data,
      helperText: data.helperText || undefined,
      options: data.type === "select" ? data.options ?? [] : undefined,
    };
    const url = isEdit
      ? `/api/admin/application-questions/${question.id}`
      : "/api/admin/application-questions";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(isEdit ? "تم تحديث السؤال" : "تم إضافة السؤال");
      onSaved();
    } catch {
      toast.error(COPY.common.error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-bold text-foreground">
          {isEdit
            ? COPY.admin.application.questions.editTitle
            : COPY.admin.application.questions.newTitle}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-4"
          noValidate
        >
          <div>
            <Label htmlFor="q-label">
              {COPY.admin.application.questions.labelField}
            </Label>
            <Input
              id="q-label"
              placeholder="مثال: لماذا تريد الانضمام للأكاديمية؟"
              {...register("label")}
            />
            <FieldError message={errors.label?.message} />
          </div>

          <div>
            <Label htmlFor="q-helper">
              {COPY.admin.application.questions.helperField}
            </Label>
            <Input
              id="q-helper"
              placeholder="نص توضيحي يساعد الطالب على الإجابة"
              {...register("helperText")}
            />
            <FieldError message={errors.helperText?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="q-type">
                {COPY.admin.application.questions.typeField}
              </Label>
              <select
                id="q-type"
                {...register("type")}
                className="h-11 w-full rounded-lg border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
              >
                <option value="short">
                  {COPY.admin.application.questions.typeShort}
                </option>
                <option value="long">
                  {COPY.admin.application.questions.typeLong}
                </option>
                <option value="select">
                  {COPY.admin.application.questions.typeSelect}
                </option>
              </select>
            </div>
            <div>
              <Label htmlFor="q-order">
                {COPY.admin.application.questions.orderField}
              </Label>
              <Input
                id="q-order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          {type === "select" && (
            <div>
              <Label htmlFor="q-options">
                {COPY.admin.application.questions.optionsField}
              </Label>
              <Textarea
                id="q-options"
                rows={4}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder={"خيار ١\nخيار ٢\nخيار ٣"}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                {...register("required")}
                className="size-4 accent-primary"
              />
              {COPY.admin.application.questions.requiredField}
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                {...register("isActive")}
                className="size-4 accent-primary"
              />
              {COPY.admin.application.questions.activeField}
            </label>
          </div>

          <div className="mt-2 flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              className="flex-1"
            >
              {isEdit ? COPY.common.save : "أضف السؤال"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {COPY.common.cancel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

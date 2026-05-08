"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Save, X, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { VIDEO_PROVIDERS } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { formatDuration, toArabicNumerals } from "@/lib/utils";

type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  videoProvider: keyof typeof VIDEO_PROVIDERS;
  videoAssetId: string;
  durationSeconds: number;
  isPreview: boolean;
  isPublished: boolean;
};

const empty = (courseId: string, order: number): Omit<Lesson, "id"> => ({
  courseId,
  title: "",
  description: "",
  order,
  videoProvider: "BUNNY",
  videoAssetId: "",
  durationSeconds: 0,
  isPreview: false,
  isPublished: true,
});

export function LessonManager({
  courseId,
  initialLessons,
}: {
  courseId: string;
  initialLessons: Lesson[];
}) {
  const router = useRouter();
  const [lessons, setLessons] = React.useState<Lesson[]>(initialLessons);
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const [draft, setDraft] = React.useState<Omit<Lesson, "id"> | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);

  function startNew() {
    setEditingId("new");
    setDraft(empty(courseId, lessons.length));
    setErrors({});
  }

  function startEdit(l: Lesson) {
    setEditingId(l.id);
    const { id: _id, ...rest } = l;
    void _id;
    setDraft(rest);
    setErrors({});
  }

  function cancel() {
    setEditingId(null);
    setDraft(null);
    setErrors({});
  }

  function validate(d: Omit<Lesson, "id">) {
    const e: Record<string, string> = {};
    if (!d.title.trim()) e.title = "العنوان مطلوب";
    if (!d.videoAssetId.trim()) e.videoAssetId = "معرف الفيديو مطلوب";
    if (d.durationSeconds < 0) e.durationSeconds = "غير صحيح";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!draft || !editingId) return;
    if (!validate(draft)) return;

    setBusy(true);
    try {
      const isNew = editingId === "new";
      const url = isNew ? "/api/admin/lessons" : `/api/admin/lessons/${editingId}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(isNew ? "تمت إضافة الدرس." : "تم حفظ الدرس.");
      cancel();
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success("تم حذف الدرس.");
      setLessons((arr) => arr.filter((l) => l.id !== id));
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          إجمالي الدروس: {toArabicNumerals(lessons.length)}
        </p>
        {!editingId && (
          <Button variant="primary" size="md" onClick={startNew}>
            <Plus className="size-4" />
            إضافة درس
          </Button>
        )}
      </div>

      {editingId === "new" && draft && (
        <DraftCard
          draft={draft}
          setDraft={setDraft}
          errors={errors}
          onSave={save}
          onCancel={cancel}
          busy={busy}
          isNew
        />
      )}

      <ol className="flex flex-col gap-3">
        {lessons.map((lesson, i) => {
          if (editingId === lesson.id && draft) {
            return (
              <li key={lesson.id}>
                <DraftCard
                  draft={draft}
                  setDraft={setDraft}
                  errors={errors}
                  onSave={save}
                  onCancel={cancel}
                  busy={busy}
                />
              </li>
            );
          }
          return (
            <li
              key={lesson.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-card p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-muted">
                {toArabicNumerals(i + 1)}
              </span>
              <PlayCircle className="size-5 shrink-0 text-[var(--color-red-300)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {lesson.title}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-2">
                  <span dir="ltr">
                    {lesson.videoProvider} · {lesson.videoAssetId}
                  </span>
                  {lesson.durationSeconds > 0 && (
                    <span>{formatDuration(lesson.durationSeconds)}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {lesson.isPreview && (
                  <Badge variant="primary">{COPY.courseDetail.preview}</Badge>
                )}
                {!lesson.isPublished && (
                  <Badge variant="outline">مسودة</Badge>
                )}
                <Button variant="ghost" size="sm" onClick={() => startEdit(lesson)}>
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(lesson.id)}
                >
                  <Trash2 className="size-4 text-[var(--color-danger)]" />
                </Button>
              </div>
            </li>
          );
        })}
      </ol>

      <ConfirmDialog
        open={!!confirmDelete}
        title="حذف الدرس؟"
        description="لا يمكن التراجع عن هذه العملية."
        confirmLabel="حذف"
        variant="danger"
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        loading={busy}
      />
    </div>
  );
}

function DraftCard({
  draft,
  setDraft,
  errors,
  onSave,
  onCancel,
  busy,
  isNew,
}: {
  draft: Omit<Lesson, "id">;
  setDraft: (d: Omit<Lesson, "id">) => void;
  errors: Record<string, string>;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  isNew?: boolean;
}) {
  const set = (patch: Partial<Omit<Lesson, "id">>) =>
    setDraft({ ...draft, ...patch });
  return (
    <div className="rounded-2xl border border-primary/40 bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-red-300)]">
        {isNew ? "درس جديد" : "تعديل الدرس"}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="lesson-title">عنوان الدرس</Label>
          <Input
            id="lesson-title"
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
          />
          <FieldError message={errors.title} />
        </div>

        <div>
          <Label htmlFor="lesson-provider">مزوّد الفيديو</Label>
          <select
            id="lesson-provider"
            value={draft.videoProvider}
            onChange={(e) =>
              set({ videoProvider: e.target.value as Lesson["videoProvider"] })
            }
            className="h-11 w-full rounded-lg border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
          >
            {Object.values(VIDEO_PROVIDERS).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="lesson-asset">معرف الفيديو (Asset ID)</Label>
          <Input
            id="lesson-asset"
            dir="ltr"
            value={draft.videoAssetId}
            onChange={(e) => set({ videoAssetId: e.target.value })}
            placeholder="GUID من Bunny Stream"
          />
          <FieldError message={errors.videoAssetId} />
        </div>

        <div>
          <Label htmlFor="lesson-order">الترتيب</Label>
          <Input
            id="lesson-order"
            type="number"
            min="0"
            dir="ltr"
            value={draft.order}
            onChange={(e) => set({ order: Number(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor="lesson-duration">المدة (بالثواني)</Label>
          <Input
            id="lesson-duration"
            type="number"
            min="0"
            dir="ltr"
            value={draft.durationSeconds}
            onChange={(e) =>
              set({ durationSeconds: Number(e.target.value) || 0 })
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="lesson-desc">وصف (اختياري)</Label>
          <Textarea
            id="lesson-desc"
            rows={2}
            value={draft.description ?? ""}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] bg-surface p-3">
          <input
            type="checkbox"
            checked={draft.isPreview}
            onChange={(e) => set({ isPreview: e.target.checked })}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-medium text-foreground">درس تجريبي</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] bg-surface p-3">
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(e) => set({ isPublished: e.target.checked })}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-medium text-foreground">منشور</span>
        </label>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button variant="primary" size="md" onClick={onSave} loading={busy}>
          <Save className="size-4" />
          حفظ
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel} disabled={busy}>
          <X className="size-4" />
          {COPY.common.cancel}
        </Button>
      </div>
    </div>
  );
}

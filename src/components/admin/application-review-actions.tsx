"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { COPY } from "@/lib/arabic";
import type { ApprovalStatus } from "@/lib/constants";

export function ApplicationReviewActions({
  userId,
  status,
}: {
  userId: string;
  status: ApprovalStatus;
}) {
  const router = useRouter();
  const [adminNote, setAdminNote] = React.useState("");
  const [confirm, setConfirm] = React.useState<null | "approve" | "reject">(
    null,
  );
  const [busy, setBusy] = React.useState(false);

  if (status === "APPROVED") {
    return (
      <div className="rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4 text-sm text-[var(--color-success)]">
        تم قبول هذا الطالب وإرسال بريد القبول إليه.
      </div>
    );
  }
  if (status === "REJECTED") {
    return (
      <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
        تم رفض هذا الطلب.
      </div>
    );
  }
  if (status === "PENDING_APPLICATION") {
    return (
      <div className="rounded-xl border border-[var(--color-border-strong)] bg-elevated p-4 text-sm text-muted">
        لم يكمل الطالب استمارة الانضمام بعد. لا يمكن مراجعة الطلب الآن.
      </div>
    );
  }

  async function act(kind: "approve" | "reject") {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/applications/${userId}/${kind}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNote: adminNote.trim() || undefined }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      if (kind === "approve") {
        if (json.emailSent) {
          toast.success("تم قبول الطالب وإرسال بريد التهنئة.");
        } else {
          toast.success("تم قبول الطالب — لكن البريد لم يُرسل.");
          if (json.emailError) {
            toast.message("سبب فشل البريد", { description: json.emailError });
          }
        }
      } else {
        toast.success("تم رفض الطلب.");
      }
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="adminNote">
            {COPY.admin.application.adminNote}{" "}
            <span className="font-normal text-muted-2">(اختياري)</span>
          </Label>
          <Textarea
            id="adminNote"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="ملاحظة للسجل الداخلي — مثل سبب الرفض أو سياق القبول"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setConfirm("approve")}
            loading={busy && confirm === "approve"}
          >
            <CheckCircle2 className="size-4" />
            {COPY.admin.application.approve}
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => setConfirm("reject")}
            loading={busy && confirm === "reject"}
          >
            <XCircle className="size-4" />
            {COPY.admin.application.reject}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "approve"}
        title={COPY.admin.application.confirmApprove}
        description="سيتم فتح المنصة بالكامل للطالب وإرسال بريد قبول إليه فورًا."
        confirmLabel={COPY.admin.application.approve}
        variant="primary"
        onConfirm={() => act("approve")}
        onCancel={() => setConfirm(null)}
        loading={busy}
      />
      <ConfirmDialog
        open={confirm === "reject"}
        title={COPY.admin.application.confirmReject}
        description="لن يتمكن الطالب من الدخول للمنصة بعد الرفض."
        confirmLabel={COPY.admin.application.reject}
        variant="danger"
        onConfirm={() => act("reject")}
        onCancel={() => setConfirm(null)}
        loading={busy}
      />
    </>
  );
}

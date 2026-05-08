"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { COPY } from "@/lib/arabic";

export function PaymentReviewActions({
  proofId,
  status,
}: {
  proofId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const router = useRouter();
  const [adminNote, setAdminNote] = React.useState("");
  const [confirm, setConfirm] = React.useState<null | "approve" | "reject">(null);
  const [busy, setBusy] = React.useState(false);

  if (status === "APPROVED") {
    return (
      <div className="rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4 text-sm text-[var(--color-success)]">
        تمت الموافقة على هذا الإيصال وفُعِّل الاشتراك.
      </div>
    );
  }
  if (status === "REJECTED") {
    return (
      <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
        تم رفض هذا الإيصال.
      </div>
    );
  }

  async function act(kind: "approve" | "reject") {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/payment-proofs/${proofId}/${kind}`,
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
      toast.success(
        kind === "approve" ? "تمت الموافقة وتفعيل الاشتراك." : "تم رفض الإيصال.",
      );
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
            {COPY.admin.review.adminNote}{" "}
            <span className="font-normal text-muted-2">(اختياري)</span>
          </Label>
          <Textarea
            id="adminNote"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="ملاحظة ستظهر للطالب — مثل سبب الرفض أو مرجع داخلي"
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
            {COPY.admin.review.approve}
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => setConfirm("reject")}
            loading={busy && confirm === "reject"}
          >
            <XCircle className="size-4" />
            {COPY.admin.review.reject}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "approve"}
        title={COPY.admin.review.confirmApprove}
        description="سيتم تفعيل اشتراك مدى الحياة للطالب على هذا الكورس فورًا."
        confirmLabel={COPY.admin.review.approve}
        variant="primary"
        onConfirm={() => act("approve")}
        onCancel={() => setConfirm(null)}
        loading={busy}
      />
      <ConfirmDialog
        open={confirm === "reject"}
        title={COPY.admin.review.confirmReject}
        description="سيتم إعلام الطالب برفض الإيصال مع ملاحظة الإدارة."
        confirmLabel={COPY.admin.review.reject}
        variant="danger"
        onConfirm={() => act("reject")}
        onCancel={() => setConfirm(null)}
        loading={busy}
      />
    </>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { COPY } from "@/lib/arabic";

export function EnrollmentRowActions({
  enrollmentId,
  status,
}: {
  enrollmentId: string;
  status: "ACTIVE" | "REVOKED";
}) {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (status === "REVOKED") {
    return <span className="text-xs text-muted-2">ملغى</span>;
  }

  async function revoke() {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/enrollments/${enrollmentId}/revoke`,
        { method: "PATCH" },
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success("تم إلغاء الوصول.");
      router.refresh();
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
        {COPY.admin.enrollment.revoke}
      </Button>
      <ConfirmDialog
        open={confirm}
        title="إلغاء وصول هذا الطالب للكورس؟"
        description="لن يستطيع الطالب مشاهدة الدروس حتى يتم إعادة تفعيله."
        variant="danger"
        confirmLabel={COPY.admin.enrollment.revoke}
        onConfirm={revoke}
        onCancel={() => setConfirm(false)}
        loading={busy}
      />
    </>
  );
}

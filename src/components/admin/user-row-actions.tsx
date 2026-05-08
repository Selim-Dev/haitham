"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { COPY } from "@/lib/arabic";

export function UserRowActions({
  userId,
  isBlocked,
  isSelf,
}: {
  userId: string;
  isBlocked: boolean;
  isSelf?: boolean;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (isSelf) {
    return (
      <span className="text-xs text-muted-2">حسابك</span>
    );
  }

  async function act() {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/users/${userId}/${isBlocked ? "unblock" : "block"}`,
        { method: "PATCH" },
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      toast.success(isBlocked ? "تم إلغاء الحظر." : "تم الحظر.");
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
      <Button
        variant={isBlocked ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setConfirm(true)}
      >
        {isBlocked ? COPY.admin.user.unblock : COPY.admin.user.block}
      </Button>
      <ConfirmDialog
        open={confirm}
        title={isBlocked ? "إلغاء حظر المستخدم؟" : "حظر هذا المستخدم؟"}
        description={
          isBlocked
            ? "سيتمكن المستخدم من تسجيل الدخول مجددًا."
            : "لن يستطيع المستخدم تسجيل الدخول أو مشاهدة الدروس حتى تلغي الحظر."
        }
        variant={isBlocked ? "primary" : "danger"}
        confirmLabel={isBlocked ? COPY.admin.user.unblock : COPY.admin.user.block}
        onConfirm={act}
        onCancel={() => setConfirm(false)}
        loading={busy}
      />
    </>
  );
}

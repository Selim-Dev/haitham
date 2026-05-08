"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import { COPY } from "@/lib/arabic";

export function LogoutButton({
  variant = "ghost",
  size = "md",
  redirectTo = "/",
  children,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(redirectTo);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={logout}
      loading={busy}
    >
      {children ?? COPY.nav.logout}
    </Button>
  );
}

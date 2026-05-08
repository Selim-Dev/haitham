"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/arabic";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = COPY.common.confirm,
  cancelLabel = COPY.common.cancel,
  variant = "primary",
  onConfirm,
  onCancel,
  loading = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <h2
              id="confirm-title"
              className="font-display text-xl font-bold text-foreground"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
            <div className="mt-6 flex gap-2">
              <Button
                variant={variant}
                size="md"
                onClick={onConfirm}
                loading={loading}
                className="flex-1"
              >
                {confirmLabel}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  THEMES,
  THEME_AR,
  THEME_DESCRIPTION_AR,
  type Theme,
} from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const THEME_PREVIEWS: Record<
  Theme,
  { gradient: string; accent: string; emoji?: string }
> = {
  DEFAULT: {
    gradient: "from-[#0b2814] via-[#0b0b0f] to-[#0b0b0f]",
    accent: "from-primary to-[var(--color-deep-red)]",
  },
  EID_AL_ADHA: {
    gradient: "from-[#2a1d05] via-[#0b0b0f] to-[#0b2814]",
    accent: "from-amber-300 to-amber-600",
    emoji: "🐏",
  },
};

export function ThemeSettingsForm({
  initialTheme,
}: {
  initialTheme: Theme;
}) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Theme>(initialTheme);
  const [saving, setSaving] = React.useState(false);

  const dirty = selected !== initialTheme;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeTheme: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || COPY.adminSettings.error);
      toast.success(COPY.adminSettings.saved);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : COPY.adminSettings.error;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 flex flex-col gap-1">
          <span className="font-display text-lg font-bold text-foreground">
            {COPY.adminSettings.themeLabel}
          </span>
          <span className="text-xs text-muted-2">
            {COPY.adminSettings.themeHelper}
          </span>
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.values(THEMES) as Theme[]).map((theme) => {
            const isSelected = selected === theme;
            const isActive = initialTheme === theme;
            const preview = THEME_PREVIEWS[theme];
            return (
              <label
                key={theme}
                className={cn(
                  "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-5 transition-all",
                  isSelected
                    ? "border-primary/60 shadow-[var(--shadow-red-glow)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
                )}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={isSelected}
                  onChange={() => setSelected(theme)}
                  className="sr-only"
                />

                {/* Mini preview tile */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "relative h-24 overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br",
                    preview.gradient,
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-x-4 bottom-3 h-1.5 rounded-full bg-gradient-to-l opacity-80",
                      preview.accent,
                    )}
                  />
                  {preview.emoji && (
                    <span className="absolute end-3 top-3 text-2xl">
                      {preview.emoji}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold text-foreground">
                        {THEME_AR[theme]}
                      </span>
                      {isActive && (
                        <Badge variant="success" className="text-[10px]">
                          <Sparkles className="size-3" />
                          {COPY.adminSettings.active}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-muted">
                      {THEME_DESCRIPTION_AR[theme]}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-[var(--color-border-strong)] bg-card text-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <Check className="size-4" />
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={save}
          disabled={!dirty || saving}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {COPY.adminSettings.saving}
            </>
          ) : (
            COPY.adminSettings.save
          )}
        </Button>
      </div>
    </div>
  );
}

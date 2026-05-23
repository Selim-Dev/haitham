import { Settings } from "lucide-react";
import { ThemeSettingsForm } from "@/components/admin/theme-settings-form";
import { getSiteSettings } from "@/services/settings.service";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-[var(--color-red-300)]">
          <Settings className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.adminSettings.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {COPY.adminSettings.subtitle}
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-[var(--color-border)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <ThemeSettingsForm initialTheme={settings.activeTheme} />
      </div>
    </div>
  );
}

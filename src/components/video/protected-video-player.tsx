"use client";

import * as React from "react";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";
import { WatermarkOverlay } from "./watermark-overlay";
import { COPY } from "@/lib/arabic";

type PlaybackResponse = {
  lesson: {
    id: string;
    title: string;
    courseSlug: string;
    courseTitle: string;
    isPreview: boolean;
  };
  playback: {
    provider: string;
    embedUrl?: string;
    watermarkText?: string;
    expiresAt?: string;
  };
  progressSeconds: number;
};

export function ProtectedVideoPlayer({ lessonId }: { lessonId: string }) {
  const [data, setData] = React.useState<PlaybackResponse | null>(null);
  const [error, setError] = React.useState<{
    status: number;
    message: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let aborted = false;
    setLoading(true);
    setError(null);
    fetch(`/api/lessons/${lessonId}/playback`, {
      cache: "no-store",
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          if (aborted) return;
          setError({
            status: res.status,
            message: json.error || COPY.common.error,
          });
          return;
        }
        if (aborted) return;
        setData(json);
      })
      .catch(() => {
        if (!aborted) {
          setError({ status: 500, message: COPY.common.error });
        }
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });
    return () => {
      aborted = true;
    };
  }, [lessonId]);

  // Periodically save progress (debounced approach: every 15s while playing).
  React.useEffect(() => {
    if (!data) return;
    const id = setInterval(() => {
      // Iframe-based players make precise progress hard; this is a best-effort
      // heartbeat that we last-watched the lesson. Real seconds tracking would
      // require provider postMessage events.
      fetch(`/api/watch-progress/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressSeconds: 0, completed: false }),
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, [data, lessonId]);

  if (loading) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border border-[var(--color-border)] bg-card">
        <Loader2 className="size-8 animate-spin text-[var(--color-red-300)]" />
      </div>
    );
  }

  if (error?.status === 403) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border border-[var(--color-border-strong)] bg-card p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-[var(--color-red-300)]">
            <Lock className="size-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {COPY.dashboard.accessDeniedLesson}
          </h3>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border border-[var(--color-danger)]/30 bg-card p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-[var(--color-danger)]/15 text-[var(--color-danger)]">
            <AlertTriangle className="size-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {error?.message ?? COPY.common.error}
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = data.playback.embedUrl;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-black shadow-[var(--shadow-card)]">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
          title={data.lesson.title}
        />
      ) : (
        <div className="grid size-full place-items-center text-muted">
          لا يوجد رابط مشاهدة متاح.
        </div>
      )}

      {data.playback.watermarkText && (
        <WatermarkOverlay text={data.playback.watermarkText} />
      )}
    </div>
  );
}

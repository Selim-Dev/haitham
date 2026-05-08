"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp"];

export function ThumbnailUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);

  async function uploadFile(f: File) {
    if (!f.type.startsWith("image/")) {
      toast.error("اختر صورة فقط (JPG, PNG, WebP)");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("الحد الأقصى ٥ ميجابايت");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", f);
      const res = await fetch("/api/admin/uploads/thumbnail", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || COPY.common.error);
        return;
      }
      onChange(json.url);
      toast.success("تم رفع الصورة.");
    } catch {
      toast.error(COPY.common.error);
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src={value}
            alt="غلاف الكورس"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <label className="grid size-8 cursor-pointer place-items-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:bg-background">
              <input
                type="file"
                accept={ALLOWED_EXT.map((e) => `.${e}`).join(",")}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                }}
                className="sr-only"
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid size-8 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:bg-danger hover:text-white"
              aria-label="حذف الصورة"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-2" dir="ltr">
          {value.length > 60 ? `${value.slice(0, 57)}...` : value}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) uploadFile(f);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-[var(--color-border-strong)] bg-surface hover:border-primary/40",
          uploading && "pointer-events-none opacity-70",
        )}
      >
        <input
          type="file"
          accept={ALLOWED_EXT.map((e) => `.${e}`).join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
          }}
          className="sr-only"
          disabled={uploading}
        />
        {uploading ? (
          <>
            <Loader2 className="size-8 animate-spin text-[var(--color-red-300)]" />
            <p className="text-sm font-semibold text-foreground">
              جارٍ رفع الصورة...
            </p>
          </>
        ) : (
          <>
            <Upload className="size-8 text-[var(--color-red-300)]" />
            <p className="text-sm font-semibold text-foreground">
              اضغط لاختيار صورة الغلاف أو اسحبها هنا
            </p>
            <p className="text-xs text-muted">
              JPG, PNG, WebP — حتى ٥ ميجابايت
            </p>
          </>
        )}
      </label>

      {!showUrlInput ? (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="text-start text-xs text-muted-2 transition-colors hover:text-foreground"
        >
          أو الصق رابط صورة من الإنترنت
        </button>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            dir="ltr"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              const v = urlInput.trim();
              if (v) {
                onChange(v);
                setShowUrlInput(false);
                setUrlInput("");
              }
            }}
          >
            <LinkIcon className="size-4" />
            استخدام
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput("");
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

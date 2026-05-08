import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStorageProvider } from "@/services/storage/storage.service";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const MAX_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "ملف الصورة مطلوب" },
        { status: 400 },
      );
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. JPG, PNG, أو WebP فقط." },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف أكبر من المسموح (٥ ميجابايت)." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await getStorageProvider().upload({
      buffer,
      filename: file.name,
      mimeType: file.type,
      folder: "ahmed-haitham/thumbnails",
    });

    return NextResponse.json({
      url: stored.url,
      storageKey: stored.storageKey,
    });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.status ?? 500 },
    );
  }
}

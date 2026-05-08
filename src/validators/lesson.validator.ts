import { z } from "zod";

export const lessonInputSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(2).max(200),
  description: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
  videoProvider: z
    .enum(["BUNNY", "VDOCIPHER", "CLOUDFLARE_STREAM", "MUX"])
    .default("BUNNY"),
  videoAssetId: z.string().trim().min(1, "معرف الفيديو مطلوب"),
  durationSeconds: z.number().int().nonnegative().default(0),
  isPreview: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export type LessonInput = z.infer<typeof lessonInputSchema>;

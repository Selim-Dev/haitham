import { z } from "zod";

export const courseInputSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-ء-ي]+$/, "الـ slug يحتوي رموزًا غير مسموحة"),
  description: z.string().min(10),
  shortDescription: z.string().min(2).max(280),
  price: z.number().nonnegative(),
  currency: z.string().default("EGP"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().trim().min(1),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  durationLabel: z.string().optional(),
  isPublished: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type CourseInput = z.infer<typeof courseInputSchema>;
export type CourseInputForm = z.input<typeof courseInputSchema>;

export const courseListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z.enum(["newest", "price-low", "price-high"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type CourseListQuery = z.infer<typeof courseListQuerySchema>;

import { z } from "zod";

// Code format: 3–32 chars, A-Z / 0-9 / _ / - only. Auto-uppercased.
const codeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z0-9_-]{3,32}$/,
    "كود الكوبون يحتوي رموزًا غير صحيحة (حروف لاتينية كبيرة، أرقام، _ أو - فقط)",
  );

export const couponInputSchema = z
  .object({
    code: codeSchema,
    type: z.enum(["PERCENTAGE", "FIXED"]),
    percentageValue: z.coerce.number().int().min(1).max(100).optional(),
    fixedValueEgp: z.coerce.number().nonnegative().optional(),
    fixedValueUsd: z.coerce.number().nonnegative().optional(),
    maxUses: z.coerce.number().int().min(1),
    expiresAt: z.coerce.date().refine((d) => d > new Date(), {
      message: "انتهاء الصلاحية يجب أن يكون في المستقبل",
    }),
    appliesToAllCourses: z.coerce.boolean().default(false),
    courseIds: z.array(z.string()).default([]),
    isActive: z.coerce.boolean().default(true),
  })
  .refine(
    (v) =>
      v.type === "PERCENTAGE"
        ? typeof v.percentageValue === "number"
        : typeof v.fixedValueEgp === "number" &&
          typeof v.fixedValueUsd === "number",
    {
      message: "أكمل قيمة الخصم حسب نوع الكوبون",
      path: ["type"],
    },
  )
  .refine((v) => v.appliesToAllCourses || v.courseIds.length > 0, {
    message:
      'اختر كورسًا واحدًا على الأقل أو فعّل "يطبّق على كل الكورسات"',
    path: ["courseIds"],
  });

export type CouponInput = z.infer<typeof couponInputSchema>;
export type CouponInputForm = z.input<typeof couponInputSchema>;

// Body of POST /api/coupons/validate
export const couponValidateInputSchema = z.object({
  code: codeSchema,
  courseId: z.string().min(1, "الكورس مطلوب"),
});

export type CouponValidateInput = z.infer<typeof couponValidateInputSchema>;

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ message: "الاسم مطلوب" })
      .trim()
      .min(2, "الاسم قصير جدًا")
      .max(120, "الاسم طويل جدًا"),
    email: z
      .string({ message: "البريد الإلكتروني مطلوب" })
      .trim()
      .toLowerCase()
      .email("البريد الإلكتروني غير صحيح"),
    phone: z
      .string()
      .trim()
      .min(7, "رقم الهاتف غير صحيح")
      .max(20, "رقم الهاتف غير صحيح")
      .optional()
      .or(z.literal("")),
    password: z
      .string({ message: "كلمة المرور مطلوبة" })
      .min(8, "كلمة المرور يجب ألا تقل عن ٨ أحرف")
      .max(128, "كلمة المرور طويلة جدًا"),
    confirmPassword: z.string({ message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string({ message: "البريد الإلكتروني مطلوب" })
    .trim()
    .toLowerCase()
    .email("البريد الإلكتروني غير صحيح"),
  password: z
    .string({ message: "كلمة المرور مطلوبة" })
    .min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const adminCreateUserSchema = z.object({
  name: z
    .string({ message: "الاسم مطلوب" })
    .trim()
    .min(2, "الاسم قصير جدًا")
    .max(120, "الاسم طويل جدًا"),
  email: z
    .string({ message: "البريد الإلكتروني مطلوب" })
    .trim()
    .toLowerCase()
    .email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .trim()
    .min(7, "رقم الهاتف غير صحيح")
    .max(20, "رقم الهاتف غير صحيح")
    .optional()
    .or(z.literal("")),
  password: z
    .string({ message: "كلمة المرور مطلوبة" })
    .min(8, "كلمة المرور يجب ألا تقل عن ٨ أحرف")
    .max(128, "كلمة المرور طويلة جدًا"),
  role: z.enum(["STUDENT", "ADMIN"]).default("STUDENT"),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type AdminCreateUserInputForm = z.input<typeof adminCreateUserSchema>;

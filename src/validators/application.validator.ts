import { z } from "zod";

export const applicationQuestionSchema = z.object({
  label: z
    .string({ message: "نص السؤال مطلوب" })
    .trim()
    .min(3, "السؤال قصير جدًا")
    .max(300, "السؤال طويل جدًا"),
  helperText: z
    .string()
    .trim()
    .max(500, "الوصف طويل جدًا")
    .optional()
    .or(z.literal("")),
  type: z.enum(["short", "long", "select"]).default("short"),
  options: z.array(z.string().trim().min(1).max(120)).optional(),
  required: z.boolean().default(true),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).max(9999).default(0),
});

export type ApplicationQuestionInput = z.infer<typeof applicationQuestionSchema>;
export type ApplicationQuestionInputForm = z.input<
  typeof applicationQuestionSchema
>;

export const applicationQuestionUpdateSchema = applicationQuestionSchema
  .partial()
  .extend({});

export type ApplicationQuestionUpdateInput = z.infer<
  typeof applicationQuestionUpdateSchema
>;

export const applicationAnswerSchema = z.object({
  questionId: z.string().min(1),
  answer: z
    .string({ message: "الإجابة مطلوبة" })
    .trim()
    .min(1, "الإجابة مطلوبة")
    .max(4000, "الإجابة طويلة جدًا"),
});

export const submitApplicationSchema = z.object({
  answers: z
    .array(applicationAnswerSchema)
    .min(1, "يجب الإجابة على الأسئلة"),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;

export const reviewApplicationSchema = z.object({
  adminNote: z
    .string()
    .trim()
    .max(1000, "الملاحظة طويلة جدًا")
    .optional()
    .or(z.literal("")),
});

export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;

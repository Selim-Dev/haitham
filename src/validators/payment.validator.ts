import { z } from "zod";

export const paymentProofInputSchema = z.object({
  courseId: z.string().min(1, "الكورس مطلوب"),
  amount: z.coerce
    .number({ message: "المبلغ مطلوب" })
    .positive("المبلغ يجب أن يكون أكبر من صفر"),
  currency: z.string().default("EGP"),
  paymentMethod: z.enum(["WALLET", "BANK", "PAYPAL"]).default("WALLET"),
  transactionReference: z.string().trim().optional().or(z.literal("")),
  userNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export type PaymentProofInput = z.infer<typeof paymentProofInputSchema>;

export const paypalProofInputSchema = z.object({
  courseId: z.string().min(1, "الكورس مطلوب"),
  transactionReference: z
    .string({ message: "رقم العملية مطلوب" })
    .trim()
    .min(4, "رقم العملية قصير جدًا")
    .max(120, "رقم العملية طويل جدًا"),
  userNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export type PaypalProofInput = z.infer<typeof paypalProofInputSchema>;

export const adminPaymentReviewSchema = z.object({
  adminNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export type AdminPaymentReviewInput = z.infer<typeof adminPaymentReviewSchema>;

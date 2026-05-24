import { z } from "zod";

// Optional coupon-code field shared by both submission flows. Format must
// match the admin-side coupon code regex so they line up at lookup time.
const couponCodeField = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9_-]{3,32}$/)
  .optional()
  .or(z.literal(""));

export const paymentProofInputSchema = z.object({
  courseId: z.string().min(1, "الكورس مطلوب"),
  amount: z.coerce
    .number({ message: "المبلغ مطلوب" })
    .positive("المبلغ يجب أن يكون أكبر من صفر"),
  currency: z.string().default("EGP"),
  paymentMethod: z.enum(["WALLET", "BANK"]).default("WALLET"),
  transactionReference: z.string().trim().optional().or(z.literal("")),
  userNote: z.string().trim().max(500).optional().or(z.literal("")),
  couponCode: couponCodeField,
});

export type PaymentProofInput = z.infer<typeof paymentProofInputSchema>;

export const internationalProofInputSchema = z.object({
  courseId: z.string().min(1, "الكورس مطلوب"),
  paymentMethod: z.enum([
    "PAYPAL",
    "CRYPTO_SOLANA",
    "CRYPTO_BINANCE",
    "EWALLET",
  ]),
  // Reference is optional — the uploaded receipt is the primary artifact.
  // When provided (e.g. crypto TX hash, PayPal txn ID), we still dedup it
  // server-side in createInternationalPaymentProof.
  transactionReference: z
    .string()
    .trim()
    .max(200, "رقم العملية طويل جدًا")
    .optional()
    .or(z.literal("")),
  userNote: z.string().trim().max(500).optional().or(z.literal("")),
  couponCode: couponCodeField,
});

export type InternationalProofInput = z.infer<
  typeof internationalProofInputSchema
>;

export const adminPaymentReviewSchema = z.object({
  adminNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export type AdminPaymentReviewInput = z.infer<typeof adminPaymentReviewSchema>;

import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { PaymentStatus, PaymentMethod } from "@/lib/constants";

// Snapshot of the coupon the student claimed at submission time. Captured
// once and never mutated — the admin reads this during review, no joins
// needed (and the original coupon may be deleted / expired / exhausted by
// the time the admin gets to it).
export type CouponInvalidReason =
  | "NOT_FOUND"
  | "INACTIVE"
  | "EXPIRED"
  | "EXHAUSTED"
  | "NOT_FOR_COURSE";

export interface IAppliedCoupon {
  code: string;
  couponId?: mongoose.Types.ObjectId;
  isValidAtSubmission: boolean;
  invalidReason?: CouponInvalidReason;
  type?: "PERCENTAGE" | "FIXED";
  value?: number;
  discountAmount: number;
  expectedAmount: number;
}

export interface IPaymentProof extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  receiptStorageKey?: string;
  transactionReference?: string;
  userNote?: string;
  appliedCoupon?: IAppliedCoupon;
  status: PaymentStatus;
  adminNote?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AppliedCouponSchema = new Schema<IAppliedCoupon>(
  {
    code: { type: String, required: true, trim: true, uppercase: true },
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
    isValidAtSubmission: { type: Boolean, required: true },
    invalidReason: {
      type: String,
      enum: ["NOT_FOUND", "INACTIVE", "EXPIRED", "EXHAUSTED", "NOT_FOR_COURSE"],
    },
    type: { type: String, enum: ["PERCENTAGE", "FIXED"] },
    value: { type: Number },
    discountAmount: { type: Number, required: true, default: 0 },
    expectedAmount: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const PaymentProofSchema = new Schema<IPaymentProof>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EGP", uppercase: true },
    paymentMethod: {
      type: String,
      enum: [
        "WALLET",
        "BANK",
        "PAYPAL",
        "CRYPTO_SOLANA",
        "CRYPTO_BINANCE",
        "EWALLET",
      ],
      default: "WALLET",
      required: true,
      index: true,
    },
    // Receipt fields are optional at the schema level. The submission API
    // is the source of truth on whether a receipt is required per method
    // (domestic: required; international: required; admin-created: not
    // required). Widening this allows international submissions to attach
    // their transfer screenshot.
    receiptUrl: { type: String },
    receiptStorageKey: { type: String },
    transactionReference: { type: String, trim: true },
    userNote: { type: String, trim: true, maxlength: 500 },
    appliedCoupon: { type: AppliedCouponSchema, default: undefined },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
      index: true,
    },
    adminNote: { type: String, trim: true, maxlength: 500 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

PaymentProofSchema.index({ userId: 1, courseId: 1, status: 1 });

export const PaymentProofModel: Model<IPaymentProof> =
  (mongoose.models.PaymentProof as Model<IPaymentProof>) ||
  mongoose.model<IPaymentProof>("PaymentProof", PaymentProofSchema);

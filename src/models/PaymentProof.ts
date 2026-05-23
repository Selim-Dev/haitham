import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { PaymentStatus, PaymentMethod } from "@/lib/constants";

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
  status: PaymentStatus;
  adminNote?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

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

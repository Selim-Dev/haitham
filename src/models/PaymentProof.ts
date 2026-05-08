import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { PaymentStatus } from "@/lib/constants";

export interface IPaymentProof extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  receiptUrl: string;
  receiptStorageKey: string;
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
    receiptUrl: { type: String, required: true },
    receiptStorageKey: { type: String, required: true },
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

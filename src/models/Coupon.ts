import mongoose, { Schema, type Model, type Document } from "mongoose";

export type CouponType = "PERCENTAGE" | "FIXED";

export interface ICoupon extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  type: CouponType;
  // PERCENTAGE coupons: 1–100. FIXED coupons: per-currency amounts (both
  // required because courses are dual-priced EGP + USD).
  percentageValue?: number;
  fixedValueEgp?: number;
  fixedValueUsd?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  // If true, courseIds is ignored — the coupon applies to every course.
  appliesToAllCourses: boolean;
  courseIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 32,
    },
    type: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },
    percentageValue: { type: Number, min: 1, max: 100 },
    fixedValueEgp: { type: Number, min: 0 },
    fixedValueUsd: { type: Number, min: 0 },
    maxUses: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, required: true, default: 0, min: 0 },
    expiresAt: { type: Date, required: true, index: true },
    appliesToAllCourses: { type: Boolean, required: true, default: false },
    courseIds: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    isActive: { type: Boolean, required: true, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// Speeds up the "is this coupon currently usable" lookup.
CouponSchema.index({ isActive: 1, expiresAt: 1 });

export const CouponModel: Model<ICoupon> =
  (mongoose.models.Coupon as Model<ICoupon>) ||
  mongoose.model<ICoupon>("Coupon", CouponSchema);

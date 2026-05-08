import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { EnrollmentStatus, AccessType } from "@/lib/constants";

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  paymentProofId?: mongoose.Types.ObjectId;
  status: EnrollmentStatus;
  accessType: AccessType;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
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
    paymentProofId: { type: Schema.Types.ObjectId, ref: "PaymentProof" },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE",
      required: true,
      index: true,
    },
    accessType: {
      type: String,
      enum: ["LIFETIME"],
      default: "LIFETIME",
      required: true,
    },
  },
  { timestamps: true },
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const EnrollmentModel: Model<IEnrollment> =
  (mongoose.models.Enrollment as Model<IEnrollment>) ||
  mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

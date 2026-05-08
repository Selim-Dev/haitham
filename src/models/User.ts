import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { ApprovalStatus } from "@/lib/constants";

export interface IApplicationAnswer {
  questionId: mongoose.Types.ObjectId | string;
  question: string;
  answer: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "STUDENT" | "ADMIN";
  isBlocked: boolean;
  approvalStatus: ApprovalStatus;
  applicationAnswers?: IApplicationAnswer[];
  applicationSubmittedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  adminNote?: string;
  approvalEmailSentAt?: Date;
  registrationIp?: string;
  registrationCountry?: string;
  registrationCountryName?: string;
  registrationCity?: string;
  registrationRegion?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationAnswerSchema = new Schema<IApplicationAnswer>(
  {
    questionId: { type: Schema.Types.Mixed, required: true },
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["STUDENT", "ADMIN"],
      default: "STUDENT",
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["PENDING_APPLICATION", "PENDING_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING_APPLICATION",
      required: true,
      index: true,
    },
    applicationAnswers: { type: [ApplicationAnswerSchema], default: undefined },
    applicationSubmittedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    adminNote: { type: String, trim: true, maxlength: 1000 },
    approvalEmailSentAt: { type: Date },
    registrationIp: { type: String, trim: true, maxlength: 64 },
    registrationCountry: { type: String, trim: true, maxlength: 4, uppercase: true },
    registrationCountryName: { type: String, trim: true, maxlength: 120 },
    registrationCity: { type: String, trim: true, maxlength: 120 },
    registrationRegion: { type: String, trim: true, maxlength: 120 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).passwordHash;
        return ret;
      },
    },
  },
);

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

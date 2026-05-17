import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  priceUsd?: number;
  paypalHostedButtonId?: string;
  thumbnailUrl?: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationLabel?: string;
  lessonsCount: number;
  isPublished: boolean;
  featured: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 280 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EGP", uppercase: true, trim: true },
    priceUsd: { type: Number, min: 0 },
    paypalHostedButtonId: { type: String, trim: true, maxlength: 64 },
    thumbnailUrl: { type: String },
    category: { type: String, required: true, trim: true, index: true },
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
      required: true,
    },
    durationLabel: { type: String },
    lessonsCount: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

CourseSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

export const CourseModel: Model<ICourse> =
  (mongoose.models.Course as Model<ICourse>) ||
  mongoose.model<ICourse>("Course", CourseSchema);

import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { VideoProviderName } from "@/lib/constants";

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  videoProvider: VideoProviderName;
  videoAssetId: string;
  durationSeconds: number;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String },
    order: { type: Number, required: true, default: 0, index: true },
    videoProvider: {
      type: String,
      enum: ["BUNNY", "VDOCIPHER", "CLOUDFLARE_STREAM", "MUX"],
      default: "BUNNY",
      required: true,
    },
    videoAssetId: { type: String, required: true, trim: true },
    durationSeconds: { type: Number, default: 0, min: 0 },
    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

LessonSchema.index({ courseId: 1, order: 1 });

export const LessonModel: Model<ILesson> =
  (mongoose.models.Lesson as Model<ILesson>) ||
  mongoose.model<ILesson>("Lesson", LessonSchema);

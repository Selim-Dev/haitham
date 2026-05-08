import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IWatchProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  progressSeconds: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WatchProgressSchema = new Schema<IWatchProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    progressSeconds: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

WatchProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const WatchProgressModel: Model<IWatchProgress> =
  (mongoose.models.WatchProgress as Model<IWatchProgress>) ||
  mongoose.model<IWatchProgress>("WatchProgress", WatchProgressSchema);

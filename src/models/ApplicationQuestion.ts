import mongoose, { Schema, type Model, type Document } from "mongoose";

export type ApplicationQuestionType = "short" | "long" | "select";

export interface IApplicationQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  label: string;
  helperText?: string;
  type: ApplicationQuestionType;
  options?: string[];
  required: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationQuestionSchema = new Schema<IApplicationQuestion>(
  {
    label: { type: String, required: true, trim: true, maxlength: 300 },
    helperText: { type: String, trim: true, maxlength: 500 },
    type: {
      type: String,
      enum: ["short", "long", "select"],
      default: "short",
      required: true,
    },
    options: { type: [String], default: undefined },
    required: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export const ApplicationQuestionModel: Model<IApplicationQuestion> =
  (mongoose.models.ApplicationQuestion as Model<IApplicationQuestion>) ||
  mongoose.model<IApplicationQuestion>(
    "ApplicationQuestion",
    ApplicationQuestionSchema,
  );

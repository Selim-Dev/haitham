import mongoose, { Schema, type Model, type Document } from "mongoose";
import { THEMES, type Theme } from "@/lib/constants";

// Singleton settings document. We pin the lookup with `key: "global"` so we
// never end up with multiple settings rows even if a race upserts at the
// same time — the unique index enforces a single row.

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  key: "global";
  activeTheme: Theme;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      enum: ["global"],
      default: "global",
      required: true,
      unique: true,
      index: true,
    },
    activeTheme: {
      type: String,
      enum: Object.values(THEMES),
      default: THEMES.DEFAULT,
      required: true,
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const SettingsModel: Model<ISettings> =
  (mongoose.models.Settings as Model<ISettings>) ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { SettingsModel } from "@/models/Settings";
import { THEMES, type Theme } from "@/lib/constants";

export type SiteSettings = {
  activeTheme: Theme;
};

const DEFAULT_SETTINGS: SiteSettings = {
  activeTheme: THEMES.DEFAULT,
};

// Reads the singleton settings document. If it doesn't exist yet (fresh
// install, before any admin has touched /admin/settings), returns sensible
// defaults rather than failing — the homepage must always render.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connectDB();
    const doc = await SettingsModel.findOne({ key: "global" }).lean();
    if (!doc) return DEFAULT_SETTINGS;
    return { activeTheme: doc.activeTheme };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(
  input: Partial<SiteSettings>,
  actorId: string,
): Promise<SiteSettings> {
  await connectDB();
  const update: Record<string, unknown> = {
    updatedBy: new mongoose.Types.ObjectId(actorId),
  };
  if (input.activeTheme) update.activeTheme = input.activeTheme;

  const doc = await SettingsModel.findOneAndUpdate(
    { key: "global" },
    { $set: update, $setOnInsert: { key: "global" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return { activeTheme: doc.activeTheme };
}

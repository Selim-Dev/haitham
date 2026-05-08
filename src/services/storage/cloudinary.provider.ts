import { v2 as cloudinary } from "cloudinary";
import type { StorageProvider, StoredFile } from "./storage.service";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary env vars missing: CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET",
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export const cloudinaryProvider: StorageProvider = {
  async upload({ buffer, filename, mimeType, folder = "ahmed-haitham/receipts" }) {
    ensureConfigured();

    const isPdf = mimeType === "application/pdf";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: isPdf ? "raw" : "image",
      public_id: filename.replace(/\.[^.]+$/, ""),
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    const stored: StoredFile = {
      url: result.secure_url,
      storageKey: result.public_id,
      bytes: result.bytes,
      mimeType,
      provider: "CLOUDINARY",
    };
    return stored;
  },
};

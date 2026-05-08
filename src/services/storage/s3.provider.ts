import type { StorageProvider } from "./storage.service";

export const s3Provider: StorageProvider = {
  async upload() {
    throw new Error(
      "S3 provider not implemented. Configure Cloudinary or implement S3 here.",
    );
  },
};

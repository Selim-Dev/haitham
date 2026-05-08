import { cloudinaryProvider } from "./cloudinary.provider";

export type StoredFile = {
  url: string;
  storageKey: string;
  bytes: number;
  mimeType: string;
  provider: "CLOUDINARY" | "S3";
};

export interface StorageProvider {
  upload(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    folder?: string;
  }): Promise<StoredFile>;
}

export function getStorageProvider(): StorageProvider {
  return cloudinaryProvider;
}

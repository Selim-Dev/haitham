import type { VideoProviderName } from "@/lib/constants";
import { bunnyProvider } from "./providers/bunny.provider";
import { vdocipherProvider } from "./providers/vdocipher.provider";
import { cloudflareProvider } from "./providers/cloudflare.provider";
import { muxProvider } from "./providers/mux.provider";

export type PlaybackData = {
  provider: VideoProviderName;
  embedUrl?: string;
  token?: string;
  expiresAt?: string;
  watermarkText?: string;
};

export interface VideoProvider {
  getPlaybackData(input: {
    videoAssetId: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  }): Promise<PlaybackData>;
}

export function getVideoProvider(name: VideoProviderName): VideoProvider {
  switch (name) {
    case "BUNNY":
      return bunnyProvider;
    case "VDOCIPHER":
      return vdocipherProvider;
    case "CLOUDFLARE_STREAM":
      return cloudflareProvider;
    case "MUX":
      return muxProvider;
    default:
      return bunnyProvider;
  }
}

export function buildWatermarkText(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
}): string {
  const id = user.id.slice(-8);
  const contact = user.email || user.phone || "";
  return `${user.name} • ${contact} • ID: ${id}`;
}

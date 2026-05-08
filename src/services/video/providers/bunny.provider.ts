import { createHash } from "crypto";
import type { VideoProvider, PlaybackData } from "../video.service";
import { buildWatermarkText } from "../video.service";
import { AUTH } from "@/lib/constants";

/**
 * Bunny Stream signed embed URL.
 * Auth scheme: token = sha256_hex(securityKey + videoId + expiresTimestamp).
 * URL: https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}?token=...&expires=...
 *
 * The Bunny Stream docs: https://docs.bunny.net/docs/stream-token-authentication
 */
export const bunnyProvider: VideoProvider = {
  async getPlaybackData({ videoAssetId, user }): Promise<PlaybackData> {
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const securityKey = process.env.BUNNY_STREAM_SECURITY_KEY;

    if (!libraryId || !securityKey) {
      throw Object.assign(
        new Error("Bunny Stream is not configured (set BUNNY_STREAM_LIBRARY_ID & BUNNY_STREAM_SECURITY_KEY)"),
        { status: 500 },
      );
    }

    if (!videoAssetId) {
      throw Object.assign(new Error("videoAssetId مطلوب"), { status: 400 });
    }

    const expires = Math.floor(Date.now() / 1000) + AUTH.PLAYBACK_TOKEN_TTL_SECONDS;

    // Bunny token = sha256_hex(securityKey + videoId + expires)
    const token = createHash("sha256")
      .update(`${securityKey}${videoAssetId}${expires}`)
      .digest("hex");

    const embedUrl =
      `https://iframe.mediadelivery.net/embed/${libraryId}/${videoAssetId}` +
      `?token=${token}&expires=${expires}&autoplay=false`;

    return {
      provider: "BUNNY",
      embedUrl,
      token,
      expiresAt: new Date(expires * 1000).toISOString(),
      watermarkText: buildWatermarkText(user),
    };
  },
};

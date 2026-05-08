import type { VideoProvider } from "../video.service";

export const cloudflareProvider: VideoProvider = {
  async getPlaybackData() {
    throw Object.assign(
      new Error("Cloudflare Stream provider is not implemented yet."),
      { status: 501 },
    );
  },
};

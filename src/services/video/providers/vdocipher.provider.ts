import type { VideoProvider } from "../video.service";

export const vdocipherProvider: VideoProvider = {
  async getPlaybackData() {
    throw Object.assign(
      new Error("VdoCipher provider is not implemented yet."),
      { status: 501 },
    );
  },
};

import type { VideoProvider } from "../video.service";

export const muxProvider: VideoProvider = {
  async getPlaybackData() {
    throw Object.assign(new Error("Mux provider is not implemented yet."), {
      status: 501,
    });
  },
};

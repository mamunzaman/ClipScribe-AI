import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  serverExternalPackages: ["openai", "ffmpeg-static", "ffprobe-static"],
  outputFileTracingIncludes: {
    "/api/transcribe": [
      "./node_modules/ffmpeg-static/**/*",
      "./node_modules/ffmpeg-static/ffmpeg*",
    ],
  },
};

export default nextConfig;

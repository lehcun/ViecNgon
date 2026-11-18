import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)
  .map((hostname) => ({
    protocol: "https" as const,
    hostname,
  }));

const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT_STANDALONE === "true"
    ? { output: "standalone" as const }
    : {}),
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      ...(!isProd
        ? [
            {
              protocol: "https" as const,
              hostname: "example.com",
            },
          ]
        : []),
      ...extraImageHosts,
    ],
    // Định dạng ưu tiên
    formats: ["image/avif", "image/webp"], // Tối ưu với AVIF/WebP
    // Breakpoints cho responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache tối thiểu
    minimumCacheTTL: 60, // Cache 60 giây
  },
};

export default nextConfig;

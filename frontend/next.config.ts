import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**", // Cho phép tất cả domains (cẩn thận với security)
      },
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

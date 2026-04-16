import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["example.com", "res.cloudinary.com"], // cho phép load ảnh từ Cloudinary
    remotePatterns: [
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

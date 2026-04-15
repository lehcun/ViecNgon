import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cấu hình cho phép Next.js lấy ảnh từ các domain này
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "andpad.co.jp" },
      { protocol: "https", hostname: "www.hsc.com.vn" },
      { protocol: "https", hostname: "vng.com.vn" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [460, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;

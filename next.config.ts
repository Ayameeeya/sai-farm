import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    serverActions: {
      // 管理画面の画像アップロード用
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "xxlanegqftfcqvqrkrlw.supabase.co" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "placehold.co",
      "utqpspeicywesqihyelg.supabase.co",
      "images.seeklogo.com",
      "business.inquirer.net",
      "pngimg.com",
      "kenkarlo.com",
      "orangemagazine.ph",
      "img.kwcdn.com",
      "images.unsplash.com",
      "s.alicdn.com",
      "tse1.mm.bing.net",
      "www.businessnews.com.ph",
      "down-ph.img.susercontent.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

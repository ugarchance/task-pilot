import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  }
};

export default nextConfig;

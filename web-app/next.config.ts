import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    unoptimized: true,
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
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'uuid': 'uuid/dist/esm-browser'
    };
    return config;
  }
};

export default nextConfig;

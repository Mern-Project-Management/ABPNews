import type { NextConfig } from "next";

const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.metrotimes.in';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.metrotimes.in',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${ADMIN_BASE_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${ADMIN_BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

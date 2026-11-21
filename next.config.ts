import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Image configuration (unoptimized to serve original full quality without compression)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
    ],
  },

  // Tree-shake large packages (e.g., lucide-react) to keep client bundle tiny
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Cache headers for static content and images
  async headers() {
    return [
      {
        source: '/api/storage/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=31536000',
          },
        ],
      },
      {
        source: '/images/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

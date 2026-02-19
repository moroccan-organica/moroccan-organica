import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Skip Next.js image optimization proxy — Supabase storage URLs resolve
    // through NAT64 which Next.js blocks as "private IP". With unoptimized,
    // the <Image> src is used directly without proxying.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.paypalobjects.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.paypalobjects.com; frame-src 'self' https://www.paypal.com; connect-src 'self' https://www.paypal.com; sandbox;",
  },
  serverExternalPackages: ['bcryptjs'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

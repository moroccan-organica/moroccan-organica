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
  async redirects() {
    return [
      // Old site: /organica/argan-oil → new argan oil page
      {
        source: '/organica/argan-oil',
        destination: '/organica/argan-oil-of-morocco',
        permanent: true,
      },
      // Old site: /organica/delivery-Information (capital I) → correct lowercase route
      {
        source: '/organica/delivery-Information',
        destination: '/organica/delivery-information',
        permanent: true,
      },
      // Localized variants for delivery-Information
      {
        source: '/:lang(fr|ar)/organica/delivery-Information',
        destination: '/:lang/organica/delivery-information',
        permanent: true,
      },
      // Old site: /organica/contact → new /contact page
      {
        source: '/organica/contact',
        destination: '/contact',
        permanent: true,
      },
      // Localized variants for /organica/contact
      {
        source: '/:lang(fr|ar)/organica/contact',
        destination: '/:lang/contact',
        permanent: true,
      },
      // Old PHP: /product_details → new /shop
      {
        source: '/product_details',
        destination: '/shop',
        permanent: true,
      },
      // Localized variants for argan-oil redirect
      {
        source: '/:lang(fr|ar)/organica/argan-oil',
        destination: '/:lang/organica/argan-oil-of-morocco',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

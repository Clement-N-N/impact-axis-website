import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { securityHeaders } from "./lib/security-headers";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Nothing is gained by advertising the framework and its version.
  poweredByHeader: false,
  // Applied to every response, so there is no route that answers without them.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
  // /programs was a placeholder; its content lives on What We Do.
  async redirects() {
    return [
      {
        source: "/:locale(en|fr)/programs",
        destination: "/:locale/what-we-do",
        permanent: true,
      },
    ];
  },
  images: {
    // 75 is the default; 90 is for photos shown large, such as the About
    // page "Why we exist" photo. Next 16 only serves listed qualities.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // YouTube thumbnails for testimonial videos without a photo.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

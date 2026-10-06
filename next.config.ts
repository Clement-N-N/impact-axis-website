import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // LOCAL ONLY — do not commit. Required to test on a real phone over the LAN:
  // Next blocks cross-origin requests to dev-only assets, so loading the site
  // from this machine's network address has its HMR socket refused and React
  // never hydrates. The page still server-renders, so it looks fine while
  // everything interactive is silently dead.
  //
  // Update if the machine's LAN IP changes; `next dev` prints it on start as
  // "Network: http://<ip>:<port>".
  allowedDevOrigins: ["192.168.1.168"],
  turbopack: {
    root: import.meta.dirname,
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

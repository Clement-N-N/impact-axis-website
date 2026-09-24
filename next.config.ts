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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

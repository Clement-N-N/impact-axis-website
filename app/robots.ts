import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";

  return {
    rules: {
      userAgent: "*",
      // /api/og is the social share card; X and LinkedIn won't show a
      // preview image that robots.txt blocks.
      allow: ["/", "/api/og"],
      disallow: ["/api/", "/studio/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

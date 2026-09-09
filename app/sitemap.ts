import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { BLOG_CATEGORY_SLUGS_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const locales = routing.locales;

  const staticRoutes = [
    "",
    "/about",
    "/what-we-do",
    "/programs",
    "/impact",
    "/work-with-us",
    "/blog",
    "/events",
    "/contact",
    "/terms-of-use",
    "/privacy-policy",
  ];

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Add static routes for each locale
  for (const route of staticRoutes) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${route}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Fetch dynamic blog posts from Sanity
  try {
    const blogSlugs = (await client.fetch(BLOG_SLUGS_QUERY)) as { slug: string }[];
    if (Array.isArray(blogSlugs)) {
      for (const { slug } of blogSlugs) {
        if (!slug) continue;
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/blog/${slug}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch blog slugs for sitemap:", error);
  }

  // Fetch dynamic blog categories from Sanity
  try {
    const categorySlugs = (await client.fetch(BLOG_CATEGORY_SLUGS_QUERY)) as { slug: string }[];
    if (Array.isArray(categorySlugs)) {
      for (const { slug } of categorySlugs) {
        if (!slug) continue;
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/blog/category/${slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.5,
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch category slugs for sitemap:", error);
  }

  return entries;
}

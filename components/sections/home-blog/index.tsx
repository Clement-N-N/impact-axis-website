import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { BLOG_POSTS_QUERY } from "@/sanity/queries";
import { isBlogPost } from "@/components/sections/blog-card/types";
import { homeBlogChrome } from "./data";
import type { HomeBlogContent } from "./types";
import { HomeBlogSection } from "./HomeBlogSection";

const FEATURED_POST_COUNT = 3;

async function getHomeBlogContent(): Promise<HomeBlogContent | null> {
  try {
    const result = await client.fetch(
      BLOG_POSTS_QUERY,
      { categorySlug: null },
      { next: { revalidate: 60 } },
    );
    if (Array.isArray(result) && result.length > 0 && result.every(isBlogPost)) {
      return { ...homeBlogChrome, posts: result.slice(0, FEATURED_POST_COUNT) };
    }
  } catch (error) {
    console.error("Failed to fetch home blog content from Sanity.", error);
  }
  return null;
}

export async function HomeBlog({ locale }: { locale: Locale }) {
  const data = await getHomeBlogContent();
  if (!data) return null;
  return <HomeBlogSection data={data} locale={locale} />;
}

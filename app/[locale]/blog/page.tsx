import { setRequestLocale } from "next-intl/server";
import { BlogHero } from "@/components/sections/blog-hero";
import { blogHeroContent } from "@/components/sections/blog-hero/data";
import { BlogBody } from "@/components/sections/blog-body";
import { isBlogPost, type BlogPost } from "@/components/sections/blog-card/types";
import { client } from "@/sanity/client";
import { BLOG_POSTS_QUERY } from "@/sanity/queries";
import type { Locale } from "@/i18n/routing";

const HERO_POST_COUNT = 2;

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const result = await client.fetch(BLOG_POSTS_QUERY, {}, { next: { revalidate: 60 } });
    if (Array.isArray(result) && result.every(isBlogPost)) {
      return result;
    }
  } catch (error) {
    console.error("Failed to fetch blog posts from Sanity.", error);
  }
  return [];
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getBlogPosts();
  const heroPosts = posts.slice(0, HERO_POST_COUNT);
  const bodyPosts = posts.slice(HERO_POST_COUNT);

  return (
    <>
      <BlogHero data={blogHeroContent} posts={heroPosts} locale={locale as Locale} />
      <BlogBody posts={bodyPosts} locale={locale as Locale} />
    </>
  );
}

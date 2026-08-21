import { setRequestLocale } from "next-intl/server";
import { BlogHero } from "@/components/sections/blog-hero";
import { blogHeroContent } from "@/components/sections/blog-hero/data";
import { BlogBody } from "@/components/sections/blog-body";
import type { BlogCategory } from "@/components/sections/blog-body/types";
import { isBlogPost, type BlogPost } from "@/components/sections/blog-card/types";
import { client } from "@/sanity/client";
import { BLOG_CATEGORIES_QUERY, BLOG_POSTS_QUERY } from "@/sanity/queries";
import type { Locale } from "@/i18n/routing";

const HERO_POST_COUNT = 2;

async function getBlogPosts(categorySlug: string | null): Promise<BlogPost[]> {
  try {
    const result = await client.fetch(
      BLOG_POSTS_QUERY,
      { categorySlug },
      { next: { revalidate: 60 } },
    );
    if (Array.isArray(result) && result.every(isBlogPost)) {
      return result;
    }
  } catch (error) {
    console.error("Failed to fetch blog posts from Sanity.", error);
  }
  return [];
}

async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const result = await client.fetch(BLOG_CATEGORIES_QUERY, {}, { next: { revalidate: 60 } });
    if (Array.isArray(result)) return result as BlogCategory[];
  } catch (error) {
    console.error("Failed to fetch blog categories from Sanity.", error);
  }
  return [];
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const activeCategory = category || undefined;
  const [posts, categories] = await Promise.all([
    getBlogPosts(activeCategory ?? null),
    getBlogCategories(),
  ]);
  const heroPosts = posts.slice(0, HERO_POST_COUNT);
  const bodyPosts = posts.slice(HERO_POST_COUNT);

  return (
    <>
      <BlogHero data={blogHeroContent} posts={heroPosts} locale={locale as Locale} />
      <BlogBody
        posts={bodyPosts}
        categories={categories}
        activeCategory={activeCategory}
        locale={locale as Locale}
      />
    </>
  );
}

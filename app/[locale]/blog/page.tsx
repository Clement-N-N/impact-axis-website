import { setRequestLocale } from "next-intl/server";
import { BlogHero } from "@/components/sections/blog-hero";
import { blogHeroContent } from "@/components/sections/blog-hero/data";
import { BlogBody } from "@/components/sections/blog-body";
import { getBlogCategories, getBlogPosts } from "@/sanity/blog";
import type { Locale } from "@/i18n/routing";

const HERO_POST_COUNT = 2;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, categories] = await Promise.all([getBlogPosts(null), getBlogCategories()]);
  const heroPosts = posts.slice(0, HERO_POST_COUNT);
  const bodyPosts = posts.slice(HERO_POST_COUNT);

  return (
    <>
      <BlogHero data={blogHeroContent} posts={heroPosts} locale={locale as Locale} />
      <BlogBody posts={bodyPosts} categories={categories} locale={locale as Locale} />
    </>
  );
}

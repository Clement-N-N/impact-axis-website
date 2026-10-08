import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { BlogListing } from "@/components/sections/blog/BlogListing";
import { getBlogCategories, getBlogPage, getBlogPosts } from "@/sanity/blog";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("blog", "/blog", locale);
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, posts, categories] = await Promise.all([getBlogPage(), getBlogPosts(null), getBlogCategories()]);

  return <BlogListing page={page} posts={posts} categories={categories} locale={locale as Locale} />;
}

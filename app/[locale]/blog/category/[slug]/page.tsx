import type { Metadata } from "next";
import { blogCategoryTitle, pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogListing } from "@/components/sections/blog/BlogListing";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { BLOG_CATEGORY_SLUGS_QUERY } from "@/sanity/queries";
import { getBlogCategories, getBlogCategoryBySlug, getBlogPage, getBlogPosts } from "@/sanity/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(BLOG_CATEGORY_SLUGS_QUERY);
  return (slugs as { slug: string }[]).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getBlogCategoryBySlug(slug);
  if (!category) return {};

  const categoryName = getLocalizedText(category.title, locale as Locale);
  return pageMetadata({
    locale,
    path: `/blog/category/${slug}`,
    title: blogCategoryTitle(categoryName, locale as Locale),
    description:
      locale === "fr"
        ? `Articles Impact Axis sur ${categoryName.toLowerCase()} : analyses, témoignages et actualités sur l'emploi des jeunes au Cameroun.`
        : `Impact Axis articles on ${categoryName.toLowerCase()}: insights, stories and updates on youth employment in Cameroon.`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getBlogCategoryBySlug(slug);
  if (!category) notFound();

  const [page, posts, categories] = await Promise.all([getBlogPage(), getBlogPosts(slug), getBlogCategories()]);

  return (
    <BlogListing
      page={page}
      posts={posts}
      categories={categories}
      activeCategory={category}
      locale={locale as Locale}
    />
  );
}

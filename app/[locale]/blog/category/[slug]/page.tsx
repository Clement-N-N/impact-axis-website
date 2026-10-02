import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogCategoryHero } from "@/components/sections/blog-category-hero";
import { BlogBody } from "@/components/sections/blog-body";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { BLOG_CATEGORY_SLUGS_QUERY } from "@/sanity/queries";
import { getBlogCategories, getBlogCategoryBySlug, getBlogPosts } from "@/sanity/blog";

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
  const title = `${categoryName} — Blog`;
  const description =
    locale === "fr"
      ? `Explorez les articles de la catégorie ${categoryName}.`
      : `Explore articles under the ${categoryName} category.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/blog/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/blog/category/${slug}`,
        fr: `${baseUrl}/fr/blog/category/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getBlogCategoryBySlug(slug);
  if (!category) notFound();

  const [posts, categories] = await Promise.all([getBlogPosts(slug), getBlogCategories()]);

  return (
    <>
      <BlogCategoryHero category={category} locale={locale as Locale} />
      <BlogBody posts={posts} categories={categories} activeCategory={slug} locale={locale as Locale} />
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BlogHero } from "@/components/sections/blog-hero";
import { blogHeroContent } from "@/components/sections/blog-hero/data";
import { BlogBody } from "@/components/sections/blog-body";
import { getBlogCategories, getBlogPosts } from "@/sanity/blog";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "fr" ? "Blog & Actualités" : "Blog & News";
  const description =
    locale === "fr"
      ? "Découvrez nos derniers articles, actualités et réflexions sur le développement des talents en Afrique."
      : "Explore our latest articles, news, and insights on empowering African talent.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/blog`,
        fr: `${baseUrl}/fr/blog`,
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

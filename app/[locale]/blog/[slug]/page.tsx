import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogDetailsHero } from "@/components/sections/blog-details-hero";
import { BlogDetailsBody } from "@/components/sections/blog-details-body";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { BLOG_POST_BY_SLUG_QUERY, BLOG_POSTS_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/queries";
import type { BlogPost, BlogPostDetail } from "@/components/sections/blog-card/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const result = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug });
    return (result as BlogPostDetail | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch blog post from Sanity.", error);
    return null;
  }
}

async function getRelatedPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = (await client.fetch(BLOG_POSTS_QUERY, {}, { next: { revalidate: 60 } })) as BlogPost[];
    return posts.find((candidate) => candidate.id !== slug) ?? null;
  } catch (error) {
    console.error("Failed to fetch related blog post from Sanity.", error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch(BLOG_SLUGS_QUERY);
  return (slugs as { slug: string }[]).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return { title: getLocalizedText(post.title, locale as Locale) };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPost = await getRelatedPost(slug);

  return (
    <>
      <BlogDetailsHero post={post} locale={locale as Locale} />
      <BlogDetailsBody post={post} relatedPost={relatedPost} locale={locale as Locale} />
    </>
  );
}

import type { Metadata } from "next";
import { BASE_URL, cleanTitle, pageMetadata } from "@/lib/seo";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogDetailsHero } from "@/components/sections/blog-details-hero";
import { BlogDetailsBody } from "@/components/sections/blog-details-body";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
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
    const posts = (await client.fetch(
      BLOG_POSTS_QUERY,
      { categorySlug: null },
      { next: { revalidate: 60 } },
    )) as BlogPost[];
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

  const postTitle = getLocalizedText(post.title, locale as Locale);
  let image: { url: string; alt: string } | undefined;
  if (typeof post.image === "string") {
    image = { url: post.image, alt: postTitle };
  } else if (post.image && typeof post.image === "object") {
    image = { url: urlFor(post.image).width(1200).height(630).url(), alt: postTitle };
  }

  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: cleanTitle(postTitle),
    description: getLocalizedText(post.excerpt, locale as Locale),
    type: "article",
    image,
  });
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
      <ArticleJsonLd
        url={`${BASE_URL}/${locale}/blog/${slug}`}
        headline={getLocalizedText(post.title, locale as Locale)}
        description={getLocalizedText(post.excerpt, locale as Locale)}
        datePublished={post.date}
        authorName={post.author?.name}
        image={
          typeof post.image === "string"
            ? post.image
            : post.image
              ? urlFor(post.image).width(1200).height(630).url()
              : undefined
        }
        locale={locale as Locale}
      />
    </>
  );
}

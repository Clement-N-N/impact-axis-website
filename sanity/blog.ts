import { isBlogPost, type BlogCategory, type BlogPost, type BlogPostDetail } from "@/components/sections/blog-card/types";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { SanityImageValue } from "./types";
import { client, sanityFetchOptions } from "./client";
import {
  BLOG_CATEGORIES_QUERY,
  BLOG_CATEGORY_BY_SLUG_QUERY,
  BLOG_PAGE_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_QUERY,
} from "./queries";

/** The "Blog Page" document in Sanity. Every field is optional; the site falls back to its own copy. */
export type BlogPageContent = {
  eyebrow?: LocalizedText | null;
  title?: LocalizedText | null;
  intro?: LocalizedText | null;
  featuredPost?: BlogPost | null;
  cta?: {
    eyebrow?: LocalizedText | null;
    title?: LocalizedText | null;
    text?: LocalizedText | null;
    buttonLabel?: LocalizedText | null;
    buttonHref?: string | null;
    image?: (SanityImageValue & { alt?: string }) | null;
  } | null;
};

export async function getBlogPage(): Promise<BlogPageContent | null> {
  try {
    return ((await client.fetch(BLOG_PAGE_QUERY, {}, sanityFetchOptions)) as BlogPageContent | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch the blog page settings from Sanity.", error);
    return null;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    return ((await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug }, sanityFetchOptions)) as BlogPostDetail | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch blog post from Sanity.", error);
    return null;
  }
}

/** Up to `count` other posts: same category first, then the newest. */
export function pickRelated(posts: BlogPost[], current: BlogPost, count = 3): BlogPost[] {
  const others = posts.filter((p) => p.id !== current.id);
  const sameCategory = current.category ? others.filter((p) => p.category?.slug === current.category?.slug) : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, count);
}

export async function getBlogPosts(categorySlug: string | null): Promise<BlogPost[]> {
  try {
    const result = await client.fetch(
      BLOG_POSTS_QUERY,
      { categorySlug },
      sanityFetchOptions,
    );
    if (Array.isArray(result) && result.every(isBlogPost)) {
      return result;
    }
  } catch (error) {
    console.error("Failed to fetch blog posts from Sanity.", error);
  }
  return [];
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const result = await client.fetch(BLOG_CATEGORIES_QUERY, {}, sanityFetchOptions);
    if (Array.isArray(result)) return result as BlogCategory[];
  } catch (error) {
    console.error("Failed to fetch blog categories from Sanity.", error);
  }
  return [];
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  try {
    const result = await client.fetch(
      BLOG_CATEGORY_BY_SLUG_QUERY,
      { slug },
      sanityFetchOptions,
    );
    return (result as BlogCategory | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch blog category from Sanity.", error);
    return null;
  }
}

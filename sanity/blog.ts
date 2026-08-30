import { isBlogPost, type BlogPost } from "@/components/sections/blog-card/types";
import type { BlogCategory } from "@/components/sections/blog-body/types";
import { client } from "./client";
import { BLOG_CATEGORIES_QUERY, BLOG_CATEGORY_BY_SLUG_QUERY, BLOG_POSTS_QUERY } from "./queries";

export async function getBlogPosts(categorySlug: string | null): Promise<BlogPost[]> {
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

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const result = await client.fetch(BLOG_CATEGORIES_QUERY, {}, { next: { revalidate: 60 } });
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
      { next: { revalidate: 60 } },
    );
    return (result as BlogCategory | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch blog category from Sanity.", error);
    return null;
  }
}

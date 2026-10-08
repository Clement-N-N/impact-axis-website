import type { Locale } from "@/i18n/routing";
import { getBlogPage, getBlogPosts } from "@/sanity/blog";
import { homeBlogChrome } from "./data";
import { HomeBlogSection } from "./HomeBlogSection";

const POST_COUNT = 3;

/**
 * Three posts for the home page: the post featured on the blog (set in the
 * "Blog Page" document in Sanity) first, then the newest ones. Hidden when
 * there are no posts.
 */
export async function HomeBlog({ locale }: { locale: Locale }) {
  const [page, posts] = await Promise.all([getBlogPage(), getBlogPosts(null)]);
  const featured = page?.featuredPost;
  const ordered = featured ? [featured, ...posts.filter((p) => p.id !== featured.id)] : posts;
  if (ordered.length === 0) return null;
  return <HomeBlogSection data={{ ...homeBlogChrome, posts: ordered.slice(0, POST_COUNT) }} locale={locale} />;
}

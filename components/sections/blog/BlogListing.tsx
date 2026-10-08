import clsx from "clsx";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText as t, type LocalizedText } from "@/components/sections/home-hero/types";
import type { BlogCategory, BlogPost } from "@/components/sections/blog-card/types";
import type { BlogPageContent } from "@/sanity/blog";
import { blogDefaults, blogLabels } from "./data";
import { FeaturedCard, PostCard } from "./PostCard";
import { BlogCta } from "./BlogCta";
import { Rise } from "./Rise";

/**
 * The blog index and the per-topic pages: a navy banner, the featured post
 * overlapping it (index only), topic filters, a grid of posts, and the call
 * to action from the "Blog Page" document. Banner copy and the featured post
 * come from that document too, with the site's own copy as a fallback.
 */
export function BlogListing({
  page,
  posts,
  categories,
  locale,
  activeCategory = null,
}: {
  page: BlogPageContent | null;
  posts: BlogPost[];
  categories: BlogCategory[];
  locale: Locale;
  activeCategory?: BlogCategory | null;
}) {
  const featured = activeCategory ? null : (page?.featuredPost ?? posts[0] ?? null);
  const grid = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  const eyebrow = page?.eyebrow ?? blogDefaults.eyebrow;
  const title: LocalizedText = activeCategory ? activeCategory.title : (page?.title ?? blogDefaults.title);
  const intro = activeCategory
    ? null
    : (page?.intro ?? blogDefaults.intro);

  return (
    <Rise>
      <section
        aria-labelledby="blog-title"
        className={clsx(
          "bg-impact-blue relative isolate overflow-hidden text-white",
          featured ? "pt-[clamp(3rem,6vw,5rem)] pb-[clamp(9rem,14vw,11rem)]" : "py-[clamp(3rem,6vw,5rem)]",
        )}
      >
        <span aria-hidden="true" className="absolute -top-40 -right-32 -z-10 size-[30rem] rounded-full bg-[#74b9ff]/20 blur-[110px]" />
        <Container>
          {activeCategory ? (
            <Link
              href="/blog"
              className="text-impact-yellow text-[13px] font-bold tracking-[0.14em] uppercase hover:underline"
            >
              {t(eyebrow, locale)}
            </Link>
          ) : (
            <p className="text-impact-yellow text-[13px] font-bold tracking-[0.14em] uppercase">{t(eyebrow, locale)}</p>
          )}
          <h1
            id="blog-title"
            className="mt-4 max-w-[56rem] text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance"
          >
            {t(title, locale)}
          </h1>
          {intro && <p className="mt-5 max-w-[38rem] text-lg leading-relaxed text-pretty text-white/80">{t(intro, locale)}</p>}
          {activeCategory && (
            <p className="mt-4 text-white/70">
              {posts.length} {t(posts.length === 1 ? blogLabels.post : blogLabels.posts, locale)}
            </p>
          )}
        </Container>
      </section>

      <Container className="pb-[clamp(3.5rem,7vw,6rem)]">
        {featured && (
          <div className="-mt-[clamp(6.5rem,10vw,8rem)]">
            <FeaturedCard post={featured} locale={locale} />
          </div>
        )}

        {categories.length > 0 && (
          <nav aria-label={t(blogLabels.filterLabel, locale)} className="mt-[clamp(2.5rem,4vw,3.5rem)]">
            <ul className="flex flex-wrap gap-2">
              {[{ slug: null, title: blogLabels.allPosts }, ...categories].map((c) => {
                const on = (activeCategory?.slug ?? null) === c.slug;
                return (
                  <li key={c.slug ?? "all"}>
                    <Link
                      href={c.slug ? `/blog/category/${c.slug}` : "/blog"}
                      aria-current={on ? "page" : undefined}
                      className={clsx(
                        "focus-visible:outline-impact-blue inline-flex rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                        on
                          ? "bg-impact-blue border-impact-blue text-white"
                          : "text-impact-blue hover:border-impact-blue/40 border-[#d9dcea] bg-white",
                      )}
                    >
                      {t(c.title, locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {grid.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          !featured && (
            <p className="mt-8 rounded-[20px] bg-[#f4f6fc] p-8 text-black/70">
              {t(blogLabels.noPosts, locale)}{" "}
              <Link href="/blog" className="text-impact-blue font-semibold underline">
                {t(blogLabels.allPosts, locale)}
              </Link>
            </p>
          )
        )}

        <div className="mt-[clamp(3.5rem,6vw,5rem)]">
          <BlogCta cta={page?.cta} locale={locale} variant="band" />
        </div>
      </Container>
    </Rise>
  );
}

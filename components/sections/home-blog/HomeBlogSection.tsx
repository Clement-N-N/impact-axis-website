import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText as t } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { PostRow } from "@/components/sections/blog/PostCard";
import { Rise } from "@/components/sections/blog/Rise";
import type { HomeBlogContent } from "./types";

/**
 * Compact home page blog teaser: one heading row with a link to the blog,
 * then three posts as small photo-and-title rows (side by side on large
 * screens, stacked on phones). Kept short on purpose so it doesn't add much
 * scrolling to the home page.
 */
export function HomeBlogSection({ data, locale }: { data: HomeBlogContent; locale: Locale }) {
  const allPosts = (className: string) => (
    <Link
      href={data.allPosts.href}
      className={`text-impact-blue decoration-impact-yellow focus-visible:outline-impact-blue items-center gap-2 font-semibold decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
    >
      {t(data.allPosts.label, locale)}
      <ArrowRightIcon weight="bold" className="size-4" />
    </Link>
  );

  return (
    <section aria-labelledby="home-blog-title" className="w-full bg-[#f4f6fc] py-[clamp(3rem,6vw,4.5rem)]">
      <Rise>
        <Container>
          <div data-rise className="flex items-end justify-between gap-6">
            <div className="flex flex-col items-start gap-3">
              <span className="bg-impact-yellow rounded-full px-3.5 py-1 text-sm font-semibold whitespace-nowrap text-black">
                {t(data.eyebrow, locale)}
              </span>
              <h2
                id="home-blog-title"
                className="text-impact-blue text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance"
              >
                {t(data.headline, locale)}
              </h2>
            </div>
            {allPosts("hidden shrink-0 md:inline-flex")}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-3 lg:gap-8">
            {data.posts.map((post) => (
              <PostRow key={post.id} post={post} locale={locale} />
            ))}
          </div>

          {allPosts("mt-8 inline-flex md:hidden")}
        </Container>
      </Rise>
    </section>
  );
}

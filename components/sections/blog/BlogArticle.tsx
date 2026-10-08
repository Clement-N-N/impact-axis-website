import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText as t } from "@/components/sections/home-hero/types";
import type { BlogPost, BlogPostDetail } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl, urlFor } from "@/sanity/image";
import type { BlogPageContent } from "@/sanity/blog";
import { blogDefaults, blogLabels } from "./data";
import { blogPortableComponents, tocEntries } from "./portable";
import { PostCard, PostMeta } from "./PostCard";
import { ArticleToc } from "./ArticleToc";
import { ArticleShare } from "./ArticleShare";
import { BlogCta } from "./BlogCta";
import { Rise } from "./Rise";

/**
 * A blog article: breadcrumb, headline, summary and byline; a wide cover
 * photo; then the body in a reading column with the "On this page" menu on
 * the left and share buttons on the right (both stay in view while
 * scrolling on large screens). Ends with the call to action from the
 * "Blog Page" document and three related posts.
 */
export function BlogArticle({
  post,
  related,
  page,
  locale,
}: {
  post: BlogPostDetail;
  related: BlogPost[];
  page: BlogPageContent | null;
  locale: Locale;
}) {
  const title = t(post.title, locale);
  const body = post.body?.[locale]?.length ? post.body[locale] : (post.body?.en ?? []);
  const toc = tocEntries(body);
  const cover = post.image?.asset ? urlFor(post.image).width(2000).height(1125).url() : null;
  const avatar = resolveSanityImageUrl(post.author?.image, 96, 96);
  const share = {
    title,
    label: t(blogLabels.share, locale),
    copyLabel: t(blogLabels.copyLink, locale),
    copiedLabel: t(blogLabels.copied, locale),
  };

  return (
    <Rise>
      <article>
        <Container className="pt-[clamp(2.5rem,5vw,4rem)]">
          <nav aria-label="Breadcrumb" data-rise className="text-sm text-[#6b7090]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/blog" className="hover:text-impact-blue underline-offset-4 hover:underline">
                  {t(page?.eyebrow ?? blogDefaults.eyebrow, locale)}
                </Link>
              </li>
              {post.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/blog/category/${post.category.slug}`}
                      className="hover:text-impact-blue underline-offset-4 hover:underline"
                    >
                      {t(post.category.title, locale)}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>
          <h1
            data-rise
            className="text-impact-blue mt-5 max-w-[62rem] text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance"
          >
            {title}
          </h1>
          <p data-rise className="mt-5 max-w-[46rem] text-[clamp(1.125rem,1.5vw,1.3125rem)] leading-relaxed text-pretty text-black/65">
            {t(post.excerpt, locale)}
          </p>
          <div data-rise className="mt-7 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="bg-impact-blue relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full font-bold text-white">
                {avatar ? <Image src={avatar} alt="" fill sizes="48px" className="object-cover" /> : post.author?.name?.charAt(0)}
              </span>
              <div className="flex flex-col">
                <span className="text-impact-blue font-semibold">{post.author?.name}</span>
                <span className="text-sm text-[#6b7090]">
                  {post.authorRole && `${t(post.authorRole, locale)} · `}
                  <PostMeta post={post} locale={locale} className="" />
                </span>
              </div>
            </div>
            <div className="lg:hidden">
              <ArticleShare {...share} direction="row" />
            </div>
          </div>
        </Container>

        {cover && (
          <Container className="mt-[clamp(2rem,4vw,3rem)]">
            <figure data-rise>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[26px] bg-[#eef1fb]">
                <Image
                  src={cover}
                  alt={post.image?.alt ?? ""}
                  fill
                  priority
                  sizes="(min-width: 1440px) 1360px, 100vw"
                  className="object-cover"
                />
              </div>
              {post.image?.caption && <figcaption className="mt-3 text-sm text-[#6b7090]">{post.image.caption}</figcaption>}
            </figure>
          </Container>
        )}

        <Container className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 lg:grid-cols-[220px_minmax(0,720px)_1fr] lg:gap-x-14">
          <aside className="hidden lg:block">
            <ArticleToc entries={toc} label={t(blogLabels.onThisPage, locale)} />
          </aside>
          <div className="min-w-0">
            <PortableText value={body} components={blogPortableComponents(locale)} />
          </div>
          <aside className="hidden justify-self-end lg:block">
            <ArticleShare {...share} direction="column" />
          </aside>
        </Container>
      </article>

      <Container
        className={`mt-[clamp(3rem,6vw,5rem)] lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-14 ${related.length ? "" : "mb-[clamp(3.5rem,7vw,6rem)]"}`}
      >
        <div className="hidden lg:block" />
        <BlogCta cta={page?.cta} locale={locale} variant="card" />
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="keep-reading" className="mt-[clamp(3.5rem,7vw,6rem)] bg-[#f4f6fc] py-[clamp(3rem,6vw,5rem)]">
          <Container>
            <h2
              id="keep-reading"
              data-rise
              className="text-impact-blue text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.03em]"
            >
              {t(blogLabels.keepReading, locale)}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </Rise>
  );
}

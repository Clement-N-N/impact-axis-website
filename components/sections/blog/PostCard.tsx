import Image from "next/image";
import clsx from "clsx";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText as t } from "@/components/sections/home-hero/types";
import { formatBlogDate, readingMinutes, type BlogPost } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl } from "@/sanity/image";
import { blogLabels } from "./data";

export function CategoryChip({ post, locale, tone = "soft" }: { post: BlogPost; locale: Locale; tone?: "soft" | "glass" }) {
  if (!post.category) return null;
  return (
    <span
      className={
        tone === "glass"
          ? "rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-bold text-white"
          : "text-impact-blue rounded-full bg-[#eef1fb] px-2.5 py-1 text-xs font-bold"
      }
    >
      {t(post.category.title, locale)}
    </span>
  );
}

export function PostMeta({ post, locale, className }: { post: BlogPost; locale: Locale; className?: string }) {
  const minutes = readingMinutes(post, locale);
  return (
    <span className={className ?? "text-sm text-[#6b7090]"}>
      {formatBlogDate(post.date, locale)}
      {minutes && ` · ${minutes} ${t(blogLabels.minRead, locale)}`}
    </span>
  );
}

/** Grid card: photo, topic, title, summary. The whole card is one link. */
export function PostCard({ post, locale, size = "default" }: { post: BlogPost; locale: Locale; size?: "default" | "large" }) {
  const large = size === "large";
  const src = resolveSanityImageUrl(post.image, large ? 1400 : 900, large ? 875 : 600);
  return (
    <article data-rise className="group relative flex flex-col">
      <div className={clsx("relative overflow-hidden rounded-[20px] bg-[#eef1fb]", large ? "aspect-[16/10]" : "aspect-[3/2]")}>
        {src && (
          <Image
            src={src}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <CategoryChip post={post} locale={locale} />
        <PostMeta post={post} locale={locale} />
      </div>
      <h3
        className={clsx(
          "text-impact-blue mt-3 leading-[1.2] font-semibold tracking-[-0.015em] text-balance",
          large ? "text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] tracking-[-0.025em]" : "text-[clamp(1.25rem,1.6vw,1.375rem)]",
        )}
      >
        <Link
          href={post.href}
          className="after:absolute after:inset-0 focus-visible:outline-none group-focus-within:underline group-hover:underline decoration-impact-yellow decoration-2 underline-offset-4"
        >
          {t(post.title, locale)}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-pretty text-black/65">{t(post.excerpt, locale)}</p>
      <span className="group-focus-within:outline-impact-blue pointer-events-none absolute -inset-2 rounded-[24px] group-focus-within:outline-2" />
    </article>
  );
}

/** Compact row: small photo beside the topic, title and date. */
export function PostRow({ post, locale }: { post: BlogPost; locale: Locale }) {
  const src = resolveSanityImageUrl(post.image, 480, 360);
  return (
    <article data-rise className="group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[#eef1fb]">
        {src && (
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 16vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryChip post={post} locale={locale} />
        </div>
        <h3 className="text-impact-blue text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-[1.2] font-semibold tracking-[-0.01em] text-balance">
          <Link
            href={post.href}
            className="decoration-impact-yellow decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
          >
            {t(post.title, locale)}
          </Link>
        </h3>
        <PostMeta post={post} locale={locale} />
      </div>
      <span className="group-focus-within:outline-impact-blue pointer-events-none absolute -inset-2 rounded-[20px] group-focus-within:outline-2" />
    </article>
  );
}

/** The large card that overlaps the navy banner. */
export function FeaturedCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const src = resolveSanityImageUrl(post.image, 1400, 1000);
  return (
    <article
      data-rise
      className="group relative grid overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-30px_rgb(16_27_98/0.45)] lg:grid-cols-[1.35fr_1fr]"
    >
      <div className="relative aspect-[16/10] bg-[#eef1fb] lg:aspect-auto lg:min-h-[28rem]">
        {src && (
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-9 lg:p-11">
        <div className="flex flex-wrap gap-2">
          <span className="bg-impact-yellow text-impact-blue rounded-full px-2.5 py-1 text-xs font-bold">
            {t(blogLabels.featured, locale)}
          </span>
          <CategoryChip post={post} locale={locale} />
        </div>
        <h2 className="text-impact-blue text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
          <Link href={post.href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {t(post.title, locale)}
          </Link>
        </h2>
        <p className="text-[17px] leading-relaxed text-pretty text-black/65">{t(post.excerpt, locale)}</p>
        <PostMeta post={post} locale={locale} />
        {/* Looks like a button but the whole card is the link (the title's
            ::after covers it). pointer-events-none keeps clicks going to that
            link: the hover scale lifts this above the overlay otherwise. */}
        <span
          aria-hidden="true"
          className="bg-impact-yellow text-impact-blue pointer-events-none inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 font-bold transition-transform group-hover:scale-[1.03]"
        >
          {t(blogLabels.readStory, locale)}
          <ArrowRightIcon weight="bold" className="size-4" />
        </span>
      </div>
      <span className="group-focus-within:outline-impact-blue pointer-events-none absolute inset-0 rounded-[26px] group-focus-within:outline-3 group-focus-within:-outline-offset-3" />
    </article>
  );
}

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { BlogCard } from "@/components/ui/BlogCard";
import type { BlogPost, BlogPostDetail } from "@/components/sections/blog-card/types";
import { blogBodyContent } from "@/components/sections/blog-body/data";
import { BlogContentLayout } from "@/components/sections/blog-content-layout";
import { PromoCard } from "@/components/ui/PromoCard";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed break-words">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-tight text-black break-words">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-[clamp(1.35rem,2.2vw,1.875rem)] font-medium leading-tight text-black break-words">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium leading-snug text-black break-words">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-2 text-[clamp(1.1rem,1.5vw,1.25rem)] font-medium leading-snug text-black break-words">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-black pl-4 italic text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-black hover:text-impact-gray break-words"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = resolveSanityImageUrl(value, 1200, 800);
      if (!src) return null;
      return (
        <div className="my-6 relative aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Image src={src} alt={value?.alt || ""} fill className="object-cover" />
        </div>
      );
    },
  },
};

export function BlogDetailsBody({
  post,
  relatedPost,
  locale,
}: {
  post: BlogPostDetail;
  relatedPost: BlogPost | null;
  locale: Locale;
}) {
  return (
    <BlogContentLayout
      main={
        <div className="flex flex-col gap-6 max-w-[850px]">
          <PortableText value={post.body[locale]} components={portableTextComponents} />
        </div>
      }
      sidebar={
        <>
          <PromoCard content={blogBodyContent.promoCard} locale={locale} />
          {relatedPost && (
            <BlogCard
              post={relatedPost}
              locale={locale}
              readMoreLabel={blogBodyContent.readMoreLabel}
              variant="compact"
            />
          )}
        </>
      }
    />
  );
}

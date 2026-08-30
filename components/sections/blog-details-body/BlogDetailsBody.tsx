import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { BlogCard } from "@/components/ui/BlogCard";
import type { BlogPost, BlogPostDetail } from "@/components/sections/blog-card/types";
import { blogBodyContent } from "@/components/sections/blog-body/data";
import { BlogContentLayout } from "@/components/sections/blog-content-layout";
import { PromoCard } from "@/components/ui/PromoCard";
import type { Locale } from "@/i18n/routing";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">{children}</p>
    ),
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

import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/sections/parallax-image";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate, type BlogPostDetail } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl } from "@/sanity/image";
import { AuthorCard } from "./AuthorCard";
import { ShareButtons } from "./ShareButtons";

export function BlogDetailsHero({ post, locale }: { post: BlogPostDetail; locale: Locale }) {
  const imageSrc = resolveSanityImageUrl(post.image, 1600, 1000);

  return (
    <>
      <section className="w-full bg-white pt-section">
        <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-1 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
          </div>

          <div className="col-span-4 mb-10 md:col-span-8 lg:col-span-8">
            <h1 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium text-black">
              {getLocalizedText(post.title, locale)}
            </h1>
          </div>
        </Container>
      </section>

      {imageSrc && <ParallaxImage src={imageSrc} heightClass="h-[80vh]" padded={false} reveal />}

      <section className="w-full bg-white pt-10 pb-section">
        <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-1 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
          </div>

          <div className="col-span-4 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between md:col-span-8 lg:col-span-11">
            <div className="flex flex-col gap-3">
              <AuthorCard author={post.author} role={post.authorRole} locale={locale} />
              <span className="text-sm text-impact-gray">{formatBlogDate(post.date, locale)}</span>
            </div>

            <ShareButtons title={post.title} locale={locale} />
          </div>
        </Container>
      </section>
    </>
  );
}

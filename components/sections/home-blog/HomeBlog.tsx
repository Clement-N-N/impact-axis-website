import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { homeBlogContent } from "./data";
import { BlogCard } from "./BlogCard";

export function HomeBlog({ locale }: { locale: Locale }) {
  const data = homeBlogContent;

  return (
    <section className="w-full bg-[#F5F1E8] py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:row-start-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:row-start-1">
          <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:row-start-2 lg:border-r lg:border-border lg:pr-10">
          <BlogCard post={data.posts[0]} locale={locale} readMoreLabel={data.readMoreLabel} />
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-8 md:col-span-8 lg:col-span-5 lg:row-start-2 lg:pl-10">
          <BlogCard
            post={data.posts[1]}
            locale={locale}
            readMoreLabel={data.readMoreLabel}
            variant="horizontal"
          />
          <BlogCard
            post={data.posts[2]}
            locale={locale}
            readMoreLabel={data.readMoreLabel}
            variant="horizontal"
          />
          <Link
            href={data.moreNewsButton.href}
            className="border border-border px-8 py-3 text-center text-sm text-black"
          >
            {getLocalizedText(data.moreNewsButton.label, locale)}
          </Link>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/sections/blog-card";
import { PromoCard } from "@/components/ui/PromoCard";
import type { Locale } from "@/i18n/routing";
import { blogBodyContent } from "./data";
import { CategoryList } from "./CategoryList";

export function BlogBody({ locale }: { locale: Locale }) {
  const data = blogBodyContent;

  return (
    <section className="w-full bg-white pb-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-9 pr-[2rem]">
          <div className="divide-y divide-border">
            {data.posts.map((post) => (
              <div key={post.id} className="py-8 first:pt-0">
                <BlogCard post={post} locale={locale} readMoreLabel={data.readMoreLabel} variant="list" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <PromoCard content={data.promoCard} locale={locale} />
            <CategoryList heading={data.categoriesHeading} categories={data.categories} locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  );
}

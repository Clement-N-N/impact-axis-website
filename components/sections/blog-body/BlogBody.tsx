import { BlogCard } from "@/components/ui/BlogCard";
import { BlogContentLayout } from "@/components/sections/blog-content-layout";
import { PromoCard } from "@/components/ui/PromoCard";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/components/sections/blog-card/types";
import { blogBodyContent } from "./data";
import { CategoryList } from "./CategoryList";
import type { BlogCategory } from "./types";

export function BlogBody({
  posts,
  categories,
  activeCategory,
  locale,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
  activeCategory?: string;
  locale: Locale;
}) {
  const data = blogBodyContent;

  return (
    <BlogContentLayout
      main={
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="py-8 first:pt-0">
              <BlogCard post={post} locale={locale} readMoreLabel={data.readMoreLabel} variant="list" />
            </div>
          ))}
        </div>
      }
      sidebar={
        <>
          <PromoCard content={data.promoCard} locale={locale} />
          <CategoryList
            heading={data.categoriesHeading}
            viewAllLabel={data.viewAllCategoriesLabel}
            categories={categories}
            activeCategory={activeCategory}
            locale={locale}
          />
        </>
      }
    />
  );
}

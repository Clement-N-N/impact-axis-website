import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogCategory } from "@/components/sections/blog-body/types";

export function BlogCategoryHero({ category, locale }: { category: BlogCategory; locale: Locale }) {
  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <h1 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium text-black">
            {getLocalizedText(category.title, locale)}
          </h1>
        </div>
      </Container>
    </section>
  );
}

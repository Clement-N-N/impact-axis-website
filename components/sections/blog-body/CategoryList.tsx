import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogCategory } from "./types";

export function CategoryList({
  heading,
  viewAllLabel,
  categories,
  activeCategory,
  locale,
}: {
  heading: LocalizedText;
  viewAllLabel: LocalizedText;
  categories: BlogCategory[];
  activeCategory?: string;
  locale: Locale;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-black">{getLocalizedText(heading, locale)}</p>
        {activeCategory && (
          <Link href="/blog" className="text-sm text-impact-gray underline hover:text-black">
            {getLocalizedText(viewAllLabel, locale)}
          </Link>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {categories.map((category) => {
          const isActive = category.slug === activeCategory;
          return (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={clsx(isActive ? "font-medium text-black" : "text-impact-gray hover:text-black")}
              >
                {getLocalizedText(category.title, locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

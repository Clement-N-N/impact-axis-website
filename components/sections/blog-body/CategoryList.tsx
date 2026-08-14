import { Link } from "@/i18n/navigation";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { CategoryItem } from "./types";

export function CategoryList({
  heading,
  categories,
  locale,
}: {
  heading: LocalizedText;
  categories: CategoryItem[];
  locale: Locale;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <p className="font-medium text-black">{getLocalizedText(heading, locale)}</p>
      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category.href + getLocalizedText(category.label, locale)}>
            <Link href={category.href} className="text-impact-gray hover:text-black">
              {getLocalizedText(category.label, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { PromoCardContent } from "@/components/ui/PromoCard";

export type CategoryItem = {
  label: LocalizedText;
  href: string;
};

export type BlogBodyContent = {
  readMoreLabel: LocalizedText;
  promoCard: PromoCardContent;
  categoriesHeading: LocalizedText;
  categories: CategoryItem[];
};

import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { PromoCardContent } from "@/components/ui/PromoCard";

export type BlogCategory = {
  title: LocalizedText;
  slug: string;
};

export type BlogBodyContent = {
  readMoreLabel: LocalizedText;
  promoCard: PromoCardContent;
  categoriesHeading: LocalizedText;
  viewAllCategoriesLabel: LocalizedText;
};

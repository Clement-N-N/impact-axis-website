import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { BlogPost } from "@/components/sections/blog-card/types";
import type { PromoCardContent } from "@/components/ui/PromoCard";

export type CategoryItem = {
  label: LocalizedText;
  href: string;
};

export type BlogBodyContent = {
  readMoreLabel: LocalizedText;
  posts: BlogPost[];
  promoCard: PromoCardContent;
  categoriesHeading: LocalizedText;
  categories: CategoryItem[];
};

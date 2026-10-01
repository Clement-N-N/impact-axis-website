import type { LocalizedText } from "@/components/sections/home-hero/types";

export type BlogCategory = {
  title: LocalizedText;
  slug: string;
};

export type BlogBodyContent = {
  readMoreLabel: LocalizedText;
  categoriesHeading: LocalizedText;
  viewAllCategoriesLabel: LocalizedText;
};

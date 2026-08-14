import type { LocalizedText } from "@/components/sections/home-hero/types";

export type BlogPost = {
  id: string;
  image: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: LocalizedText;
  href: string;
};

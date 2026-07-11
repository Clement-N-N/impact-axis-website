import type { LocalizedText } from "@/components/sections/home-hero/types";

export type BlogPost = {
  image: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: string;
  href: string;
};

export type HomeBlogContent = {
  eyebrow: LocalizedText;
  readMoreLabel: LocalizedText;
  moreNewsButton: { label: LocalizedText; href: string };
  posts: [BlogPost, BlogPost, BlogPost];
};

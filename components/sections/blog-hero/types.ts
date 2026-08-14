import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { BlogPost } from "@/components/sections/blog-card/types";

export type BlogHeroContent = {
  title: LocalizedText;
  readMoreLabel: LocalizedText;
  posts: [BlogPost, BlogPost];
};

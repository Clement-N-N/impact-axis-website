import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { BlogPost } from "@/components/sections/blog-card/types";

export type { BlogPost };

export type HomeBlogChrome = {
  eyebrow: LocalizedText;
  readMoreLabel: LocalizedText;
  moreNewsButton: { label: LocalizedText; href: string };
};

export type HomeBlogContent = HomeBlogChrome & {
  posts: BlogPost[];
};

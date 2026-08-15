import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { LocalizedPortableText, SanityImageValue } from "@/sanity/types";

export type BlogPost = {
  id: string;
  image?: SanityImageValue;
  title: LocalizedText;
  excerpt: LocalizedText;
  /** ISO date string, e.g. "2026-06-13" — formatted per-locale at render time. */
  date: string;
  href: string;
};

export type BlogAuthor = {
  name: string;
  image?: SanityImageValue;
};

export type BlogPostDetail = BlogPost & {
  author: BlogAuthor;
  authorRole: LocalizedText;
  category?: { title: LocalizedText };
  body: LocalizedPortableText;
};

export function formatBlogDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(
    new Date(date),
  );
}

export function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && typeof record.fr === "string";
}

export function isBlogPost(value: unknown): value is BlogPost {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.href === "string" &&
    typeof item.date === "string" &&
    isLocalizedText(item.title) &&
    isLocalizedText(item.excerpt)
  );
}

import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";
import type { PortableTextBlock } from "@portabletext/react";

export type LocalizedPortableText = {
  en: PortableTextBlock[];
  fr: PortableTextBlock[];
};

export type SanityImageValue = {
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
};

export type TestimonialVideo = {
  asset: { url: string; mimeType: string } | null;
} | null;

export type Testimonial = {
  quote: LocalizedText;
  name: string;
  title: LocalizedText;
  image: string | SanityImageValue;
  video?: TestimonialVideo;
  description?: LocalizedPortableText;
};

export type HomeTestimonialsContent = {
  title: LocalizedText;
  seeAllStoriesButton: HeroButton;
  testimonials: Testimonial[];
};

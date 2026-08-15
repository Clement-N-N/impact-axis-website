import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";
import type { LocalizedPortableText, SanityImageValue } from "@/sanity/types";

export type { LocalizedPortableText, SanityImageValue };

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

import type { Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import { client } from "@/sanity/client";
import { HOME_TESTIMONIALS_QUERY } from "@/sanity/queries";
import { homeTestimonialsChrome } from "./data";
import type { Testimonial, HomeTestimonialsContent } from "./types";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

type SanityTestimonial = {
  name: string;
  title: LocalizedText;
  summary: LocalizedText;
  image: unknown;
  video: unknown;
};

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && typeof record.fr === "string";
}

function isSanityTestimonial(value: unknown): value is SanityTestimonial {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.name === "string" && isLocalizedText(item.title) && isLocalizedText(item.summary)
  );
}

function isSanityTestimonialsData(value: unknown): value is { testimonials: SanityTestimonial[] } {
  if (typeof value !== "object" || value === null) return false;
  const content = value as Record<string, unknown>;
  if (!Array.isArray(content.testimonials) || content.testimonials.length === 0) return false;
  return content.testimonials.every(isSanityTestimonial);
}

async function getHomeTestimonialsContent(): Promise<HomeTestimonialsContent | null> {
  try {
    const result = await client.fetch(HOME_TESTIMONIALS_QUERY, {}, { next: { revalidate: 60 } });
    if (isSanityTestimonialsData(result)) {
      const testimonials: Testimonial[] = result.testimonials.map((item) => ({
        quote: item.summary,
        name: item.name,
        title: item.title,
        image: (item.image as Testimonial["image"]) ?? "",
        video: item.video as Testimonial["video"],
      }));
      // Section heading/CTA stay hardcoded by design, matching the FAQ pattern.
      return {
        title: homeTestimonialsChrome.title,
        seeAllStoriesButton: homeTestimonialsChrome.seeAllStoriesButton,
        testimonials,
      };
    }
  } catch (error) {
    console.error("Failed to fetch home testimonials content from Sanity.", error);
  }
  return null;
}

export async function HomeTestimonials({ locale }: { locale: Locale }) {
  const data = await getHomeTestimonialsContent();
  if (!data) return null;
  return <TestimonialsCarousel data={data} locale={locale} />;
}

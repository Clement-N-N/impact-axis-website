import type { Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import { client } from "@/sanity/client";
import { HOME_FAQ_QUERY } from "@/sanity/queries";
import { homeFaqContent } from "./data";
import type { FaqItem, HomeFaqContent } from "./types";
import { FaqSection } from "./FaqSection";

type SanityFaqData = {
  faqs: FaqItem[];
};

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && typeof record.fr === "string";
}

function isFaqItem(value: unknown): value is FaqItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return isLocalizedText(item.question) && isLocalizedText(item.answer);
}

function isSanityFaqData(value: unknown): value is SanityFaqData {
  if (typeof value !== "object" || value === null) return false;
  const content = value as Record<string, unknown>;

  if (!Array.isArray(content.faqs) || content.faqs.length === 0) return false;
  if (!content.faqs.every(isFaqItem)) return false;

  return true;
}

async function getHomeFaqContent(): Promise<HomeFaqContent> {
  try {
    const result = await client.fetch(HOME_FAQ_QUERY, {}, { next: { revalidate: 60 } });
    if (isSanityFaqData(result)) {
      // Everything except the Q&A list stays hardcoded by design (kept out of
      // Sanity to avoid adding editing surface the site owner doesn't need).
      return {
        eyebrow: homeFaqContent.eyebrow,
        faqs: result.faqs,
        stillHaveQuestionsHeading: homeFaqContent.stillHaveQuestionsHeading,
        contactButton: homeFaqContent.contactButton,
      };
    }
  } catch (error) {
    console.error(
      "Failed to fetch home FAQ content from Sanity, falling back to default FAQ content.",
      error,
    );
  }
  return homeFaqContent;
}

export async function HomeFaq({ locale }: { locale: Locale }) {
  const data = await getHomeFaqContent();
  return <FaqSection data={data} locale={locale} />;
}

import type { Locale } from "@/i18n/routing";
import type { HeadlineSegment } from "./HeadlineWithIcons";

export type LocalizedText = {
  en: string;
  fr: string;
};

export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export type HeroButton = {
  label: LocalizedText;
  href: string;
};

export type PromoCardHeroContent = {
  type: "promo-card";
  backgroundImages: [string, string, string];
  headline: LocalizedText;
  seeAllStoriesButton: HeroButton;
  card: {
    badgeLabel: LocalizedText;
    image: string;
    title: LocalizedText;
    dateLine: LocalizedText;
    applyButton: HeroButton;
    learnMoreButton: HeroButton;
  };
};

export type OverlayWelcomeHeroContent = {
  type: "overlay-welcome";
  backgroundImages: [string, string, string];
  eyebrow: LocalizedText;
  headline: LocalizedText;
  headlineEmphasis: LocalizedText;
  seeAllStoriesButton: HeroButton;
};

export type CollageDarkHeroContent = {
  type: "collage-dark";
  headline: LocalizedText;
  seeAllStoriesButton: HeroButton;
  collageImages: [string, string, string];
};

export type CollageDescriptionHeroContent = {
  type: "collage-description";
  headline: LocalizedText;
  description: LocalizedText;
  seeAllStoriesButton: HeroButton;
  collageImages: [string, string, string];
};

export type FullbleedOverlayHeroContent = {
  type: "fullbleed-overlay";
  backgroundImages: [string, string, string];
  headlineSegments: Record<Locale, HeadlineSegment[]>;
  seeAllStoriesButton: HeroButton;
};

export type LearningEarningHeroContent = {
  type: "learning-earning";
  /** The whole sentence, as read by screen readers and search engines. */
  headline: LocalizedText;
  eyebrow: LocalizedText;
  /** First line of the visible headline: "From learning". */
  lead: LocalizedText;
  /** Starts the second line, before the yellow box: "to" (empty in French). */
  connector: LocalizedText;
  /** The rolling last word, each with its own photo. The last one stays. */
  words: {
    text: LocalizedText;
    image: string;
    position?: string;
    /** Mirror the photo so its subject sits clear of the headline. */
    flip?: boolean;
  }[];
  description: LocalizedText;
  paths: [HeroPath, HeroPath];
  proof: { value: string; label: LocalizedText }[];
};

export type HeroPath = HeroButton & { kicker: LocalizedText; title: LocalizedText };

export type HeroContent =
  | LearningEarningHeroContent
  | PromoCardHeroContent
  | OverlayWelcomeHeroContent
  | CollageDarkHeroContent
  | CollageDescriptionHeroContent
  | FullbleedOverlayHeroContent;

export type HeroVariantId = HeroContent["type"];

export type HeroConfig = {
  activeHero: HeroVariantId;
  heroes: Record<HeroVariantId, HeroContent>;
};

export type HeroVariantProps<T extends HeroContent> = {
  data: T;
  locale: Locale;
};

export const HERO_VARIANT_IDS: readonly HeroVariantId[] = [
  "learning-earning",
  "promo-card",
  "overlay-welcome",
  "collage-dark",
  "collage-description",
  "fullbleed-overlay",
];

export function isHeroVariantId(value: unknown): value is HeroVariantId {
  return typeof value === "string" && (HERO_VARIANT_IDS as readonly string[]).includes(value);
}

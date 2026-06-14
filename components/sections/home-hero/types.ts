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

export type HeroContent =
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

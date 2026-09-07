import type { LocalizedText } from "@/components/sections/home-hero/types";

export type Milestone = {
  year: string;
  shortYear: string;
  badge: LocalizedText;
  phase: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  yearSubtitle: LocalizedText;
  tags: string[];
};

export type JourneyHeroContent = {
  badge: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  backLink: LocalizedText;
};

export type JourneyCtaContent = {
  tag: LocalizedText;
  headline: LocalizedText;
  paragraph: LocalizedText;
  ctaPartner: LocalizedText;
  ctaReports: LocalizedText;
};

export type JourneyPageContent = {
  hero: JourneyHeroContent;
  milestones: Milestone[];
  cta: JourneyCtaContent;
};

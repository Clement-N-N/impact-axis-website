import type { LocalizedText, HeroButton } from "@/components/sections/home-hero/types";

export type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type HomeFaqContent = {
  eyebrow: LocalizedText;
  faqs: FaqItem[];
  stillHaveQuestionsHeading: LocalizedText;
  contactButton: HeroButton;
};

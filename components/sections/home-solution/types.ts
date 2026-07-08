import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";

export type HomeSolutionContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  button: HeroButton;
  paragraphs: [LocalizedText, LocalizedText, LocalizedText];
  image: string;
  imageAlt: LocalizedText;
};

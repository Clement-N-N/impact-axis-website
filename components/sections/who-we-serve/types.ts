import type { LocalizedText } from "@/components/sections/home-hero/types";

export type WhoWeServeCard = {
  icon: string;
  number: string;
  label: LocalizedText;
  description: LocalizedText;
};

export type WhoWeServeContent = {
  eyebrow: LocalizedText;
  cards: WhoWeServeCard[];
};

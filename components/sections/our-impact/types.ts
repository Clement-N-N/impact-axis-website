import type { LocalizedText } from "@/components/sections/home-hero/types";

export type ImpactStat = {
  number: string;
  label: LocalizedText;
};

export type ImpactCardDesign = {
  image: string;
  background: string;
};

export type ImpactMetric = ImpactStat & ImpactCardDesign;

export type OurImpactChrome = {
  eyebrow: LocalizedText;
  paragraph: LocalizedText;
  reportCta: LocalizedText;
};

export type OurImpactContent = OurImpactChrome & {
  metrics: ImpactMetric[];
};

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

/** Headline copy for the home tiles; kept in code alongside the design. */
export type OurImpactCopy = {
  headline: LocalizedText;
  subline: LocalizedText;
};

export type OurImpactContent = OurImpactChrome &
  OurImpactCopy & {
    metrics: ImpactMetric[];
  };

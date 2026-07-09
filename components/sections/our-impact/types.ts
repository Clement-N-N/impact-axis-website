import type { LocalizedText } from "@/components/sections/home-hero/types";

export type ImpactMetric = {
  number: string;
  label: LocalizedText;
  image: string;
  background: string;
};

export type OurImpactContent = {
  eyebrow: LocalizedText;
  paragraph: LocalizedText;
  metrics: [ImpactMetric, ImpactMetric, ImpactMetric, ImpactMetric, ImpactMetric, ImpactMetric];
};

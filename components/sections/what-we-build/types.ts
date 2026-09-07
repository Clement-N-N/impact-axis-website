import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";

export type WhatWeBuildSlide = {
  legendLabel: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  image: string;
  button: HeroButton;
};

export type WhatWeBuildOverlayContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  backgroundImage: string;
};

export type WhatWeBuildContent = {
  overlay: WhatWeBuildOverlayContent;
  slides: WhatWeBuildSlide[];
};

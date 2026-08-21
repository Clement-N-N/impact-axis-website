import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";

export type WhatWeBuildSlide = {
  legendLabel: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  image: string;
  button: HeroButton;
};

export type WhatWeBuildContent = {
  overlay: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    backgroundImage: string;
  };
  slides: [WhatWeBuildSlide, WhatWeBuildSlide, WhatWeBuildSlide];
};

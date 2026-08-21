import type { HeroButton, LocalizedText } from "@/components/sections/home-hero/types";

export type BottomCtaBlock = {
  image: string;
  accentColor: string;
  title: LocalizedText;
  button: HeroButton;
  buttonVariant: "white" | "primary";
};

export type BottomCtaContent = {
  block: BottomCtaBlock;
};

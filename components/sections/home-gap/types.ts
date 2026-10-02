import type { LocalizedText } from "@/components/sections/home-hero/types";

export type GapPair = {
  /** What's missing for young people. */
  gap: LocalizedText;
  /** How Impact Axis fills it. */
  answer: LocalizedText;
};

export type HomeGapContent = {
  problemEyebrow: LocalizedText;
  problem: LocalizedText;
  solutionEyebrow: LocalizedText;
  solution: LocalizedText;
  /** "{n} / {total} closed" */
  counter: LocalizedText;
  pairs: GapPair[];
  button: { label: LocalizedText; href: string };
};

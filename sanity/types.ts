import type { PortableTextBlock } from "@portabletext/react";

export type SanityImageValue = {
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
};

export type LocalizedPortableText = {
  en: PortableTextBlock[];
  fr: PortableTextBlock[];
};

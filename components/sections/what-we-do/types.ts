import type { LocalizedText } from "@/components/sections/home-hero/types";

/**
 * Shape of the Our Work page content.
 *
 * Mirrors the About page's convention: flat, one key per section, nothing
 * nested deeper than a repeatable array of objects, so each section maps onto
 * one fieldset of a future `whatWeDoPage` Sanity singleton without reshaping.
 */

export type WhatWeDoImage = {
  src: string;
  alt: LocalizedText;
};

export type WhatWeDoCta = {
  label: LocalizedText;
  href: string;
};

/** One of the three coloured "directions" cards in the hero. */
export type WhatWeDoDirection = {
  title: LocalizedText;
  body: LocalizedText;
  image: WhatWeDoImage;
  /** CSS object-position keeping the subject in the 4:3 frame. */
  imagePosition?: string;
  /** Internal route or in-page anchor (e.g. "#focus"). */
  href: string;
};

export type WhatWeDoHeroContent = {
  headline: LocalizedText;
  intro: LocalizedText;
  directions: WhatWeDoDirection[];
};

export type FocusArea = {
  title: LocalizedText;
  description: LocalizedText;
  /** Optional skills shown as chips under the description. */
  chips?: LocalizedText[];
  image: WhatWeDoImage;
  /** CSS object-position keeping the subject in the 4:3 frame. */
  imagePosition?: string;
};

export type OurFocusContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  areas: FocusArea[];
};

export type Programme = {
  /**
   * Doubles as the anchor id, so other sections and off-page links can deep
   * link straight to a programme (`/what-we-do#goodwill-fellowship`).
   */
  id: string;
  title: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  image: WhatWeDoImage;
  /**
   * Omitted until a programme has a page of its own. The copy calls for
   * "Explore the Goodwill Fellowship →" style links, but there is no content
   * for those pages yet and a button that goes nowhere is worse than none.
   */
  cta?: WhatWeDoCta;
};

export type OurProgrammesContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  programmes: Programme[];
};

export type DifferentiatorTrait = {
  title: LocalizedText;
  description: LocalizedText;
  /** Path under `public/icons`, following the `who-we-serve` convention. */
  icon: string;
};

export type WhatMakesDifferentContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  traits: DifferentiatorTrait[];
};

export type WorkInActionContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  caption: LocalizedText;
  /** Rendered as a full-bleed parallax band; decorative, so alt is empty. */
  image: WhatWeDoImage;
  cta: WhatWeDoCta;
};

export type ClosingCtaCard = {
  title: LocalizedText;
  description: LocalizedText;
  cta: WhatWeDoCta;
};

export type OurWorkClosingContent = {
  headline: LocalizedText;
  cards: ClosingCtaCard[];
};

export type GalleryEvent = {
  /** Stable key used by the filter chips and each photo's `event`. */
  id: string;
  name: LocalizedText;
};

export type GalleryPhoto = {
  src: string;
  alt: LocalizedText;
  event: GalleryEvent["id"];
  width: number;
  height: number;
  /** Mosaic footprint: 1×1 by default, `wide` 2×1, `tall` 1×2, `big` 2×2. */
  span?: "wide" | "tall" | "big";
};

export type GalleryContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  allLabel: LocalizedText;
  /** Accessible label for the chip group. */
  filterLabel: LocalizedText;
  lightbox: {
    close: LocalizedText;
    previous: LocalizedText;
    next: LocalizedText;
    /** "{current} of {total}" */
    counter: LocalizedText;
  };
  events: GalleryEvent[];
  photos: GalleryPhoto[];
};

export type WhatWeDoPageContent = {
  hero: WhatWeDoHeroContent;
  focus: OurFocusContent;
  programmes: OurProgrammesContent;
  different: WhatMakesDifferentContent;
  workInAction: WorkInActionContent;
  gallery: GalleryContent;
  closing: OurWorkClosingContent;
};

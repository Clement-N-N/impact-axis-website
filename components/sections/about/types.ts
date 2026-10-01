import type { LocalizedText } from "@/components/sections/home-hero/types";

/**
 * Shape of the About page content.
 *
 * Deliberately flat and one-section-per-key so it can be pushed into Sanity
 * later without reshaping: each top-level key here becomes one fieldset on an
 * `aboutPage` singleton, every `LocalizedText` becomes a `localizedString` or
 * `localizedText` object, and every `image` string becomes a Sanity image
 * reference. Nothing is nested more deeply than a repeatable array of objects,
 * which is the one structure Sanity models cleanly as an array field.
 *
 * Image values are `cdn.sanity.io` URLs of assets already uploaded to the
 * dataset, matching the convention the previous version of this file used.
 * They resolve without any runtime Sanity query, and `next.config.ts` already
 * allowlists that host in `images.remotePatterns`.
 */

export type AboutImage = {
  src: string;
  alt: LocalizedText;
};

export type AboutHeroContent = {
  /** `*phrase*` marks a highlighted phrase. */
  headline: LocalizedText;
  paragraph: LocalizedText;
  cta: { label: LocalizedText; href: string };
  /** Cut-out photo with a transparent background. */
  image: AboutImage;
};

export type AboutImageBandContent = {
  caption: LocalizedText;
  image: AboutImage;
};

export type WhyWeExistAboutContent = {
  eyebrow: LocalizedText;
  /** Two-weight headline: `lead` is set bold, `turn` light. */
  tagline: { lead: LocalizedText; turn: LocalizedText };
  /** Shown in the first card. */
  intro: LocalizedText;
  /** Shown in the second card, above the CTA. */
  paragraphs: LocalizedText[];
  image: AboutImage;
  cta: { label: LocalizedText; href: string };
};

export type MissionVisionContent = {
  eyebrow: LocalizedText;
  missionTitle: LocalizedText;
  /** `[word]` gets a highlighter stroke, `{phrase}` a full gradient fill. */
  missionBody: LocalizedText;
  visionTitle: LocalizedText;
  visionBody: LocalizedText;
};

export type PhotoStripContent = {
  kicker: LocalizedText;
  /** Headline over the full-bleed photo: a white lead, then a yellow accent. */
  headlineLead: LocalizedText;
  headlineAccent: LocalizedText;
  /** First image opens to full bleed; the rest frame it and drift away. */
  images: AboutImage[];
};

export type ApproachStep = {
  stepNumber: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  image: AboutImage;
};

export type OurApproachContent = {
  eyebrow: LocalizedText;
  /** "Learn. Apply. Connect." — the three-word summary of the model. */
  tagline: LocalizedText;
  /** Section heading. */
  title: LocalizedText;
  /** Intro paragraph under the heading. */
  headline: LocalizedText;
  steps: ApproachStep[];
  closingLine: LocalizedText;
};

export type PrincipleItem = {
  title: LocalizedText;
  description: LocalizedText;
};

export type OurPrinciplesContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  /** Appears on the beam once all the principle pillars are in place. */
  beamLine: LocalizedText;
  principles: PrincipleItem[];
  /** Not shown by the pillars design; kept for the Sanity fieldset. */
  image: AboutImage;
};

export type PartnerLogo = {
  name: string;
  logoUrl: string;
};

export type PartnershipContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  logos: PartnerLogo[];
  ctaHeadline: LocalizedText;
  ctaParagraph: LocalizedText;
  cta: { label: LocalizedText; href: string };
};

export type AboutPageContent = {
  hero: AboutHeroContent;
  imageBand: AboutImageBandContent;
  whyWeExist: WhyWeExistAboutContent;
  missionVision: MissionVisionContent;
  photoStrip: PhotoStripContent;
  ourApproach: OurApproachContent;
  ourPrinciples: OurPrinciplesContent;
  partnership: PartnershipContent;
};

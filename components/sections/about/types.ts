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
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraph: LocalizedText;
};

export type AboutImageBandContent = {
  caption: LocalizedText;
  image: AboutImage;
};

export type WhyWeExistAboutContent = {
  eyebrow: LocalizedText;
  tagline: LocalizedText;
  paragraphs: LocalizedText[];
  cta: { label: LocalizedText; href: string };
};

export type MissionVisionContent = {
  eyebrow: LocalizedText;
  missionTitle: LocalizedText;
  missionBody: LocalizedText;
  visionTitle: LocalizedText;
  visionBody: LocalizedText;
};

export type PhotoStripContent = {
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
  principles: PrincipleItem[];
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

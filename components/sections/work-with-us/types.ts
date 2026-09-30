import type { LocalizedText } from "@/components/sections/home-hero/types";

/**
 * Content for the Work With Us hub.
 *
 * The four audience cards are deliberately absent: their names and headlines
 * already live in `partnership/data.ts`, which drives the four pages at
 * `/work-with-us/<slug>`. The hub reads them from there, so the index cannot
 * drift from the pages it points at, and the audience copy has one home.
 *
 * Partner logos are likewise reused from the About page's list rather than
 * restated here.
 */

export type WorkWithUsCta = {
  label: LocalizedText;
  href: string;
};

export type HubHeroContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  cta: WorkWithUsCta;
};

export type WhyPartnerContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
};

export type WaysToWorkContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  /** Appended to each card, e.g. "Explore funding partnerships". */
  cardCtaLabel: LocalizedText;
};

export type PartnerStep = {
  title: LocalizedText;
  /** The short "We begin with the challenge:" lead-in. */
  lead: LocalizedText;
  description: LocalizedText;
};

export type HowWePartnerContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  steps: PartnerStep[];
};

export type WhyImpactAxisContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraph: LocalizedText;
  logosCaption: LocalizedText;
};

export type OpportunitiesContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  cta: WorkWithUsCta;
};

export type WorkWithUsPageContent = {
  hero: HubHeroContent;
  whyPartner: WhyPartnerContent;
  waysToWork: WaysToWorkContent;
  howWePartner: HowWePartnerContent;
  whyImpactAxis: WhyImpactAxisContent;
  opportunities: OpportunitiesContent;
};

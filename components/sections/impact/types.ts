import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { ReportCategory } from "@/sanity/reports";

/**
 * Static chrome for the Impact page. The reports themselves come from Sanity —
 * only the surrounding copy lives here, following the About and Our Work
 * convention of one flat key per section.
 */

export type ImpactCta = {
  label: LocalizedText;
  href: string;
};

export type ImpactHeroContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  readLatest: LocalizedText;
  browse: LocalizedText;
};

export type ImpactStat = {
  value: string;
  label: LocalizedText;
  visual?: "number" | "ring" | "bar";
  featured?: boolean;
  detail?: LocalizedText;
};

export type ImpactStatsContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  stats: ImpactStat[];
};

export type ReportLibraryContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  all: LocalizedText;
  categories: Record<ReportCategory, LocalizedText>;
  latest: LocalizedText;
  read: LocalizedText;
  download: LocalizedText;
  /** Shown when nothing has been published yet. */
  empty: LocalizedText;
};

export type CommitmentContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  cta: ImpactCta;
};

export type ImpactPageContent = {
  hero: ImpactHeroContent;
  /** Fallback figures for when Sanity can't be reached. */
  stats: ImpactStatsContent;
  library: ReportLibraryContent;
  commitment: CommitmentContent;
};

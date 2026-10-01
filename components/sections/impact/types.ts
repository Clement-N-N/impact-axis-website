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
  paragraphs: LocalizedText[];
  cta: ImpactCta;
};

export type ImpactStat = {
  value: string;
  label: LocalizedText;
};

export type ImpactStatsContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  stats: ImpactStat[];
};

export type LatestReportContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  /** Shown when nothing has been published yet. */
  emptyState: LocalizedText;
  viewLabel: LocalizedText;
  downloadLabel: LocalizedText;
};

export type ReportGroupCopy = {
  category: ReportCategory;
  title: LocalizedText;
  description: LocalizedText;
};

export type ReportsListContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  /** Only rendered for categories that actually have a published report. */
  groups: ReportGroupCopy[];
};

export type CommitmentContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  cta: ImpactCta;
};

export type ImpactPageContent = {
  hero: ImpactHeroContent;
  stats: ImpactStatsContent;
  latest: LatestReportContent;
  reports: ReportsListContent;
  commitment: CommitmentContent;
};

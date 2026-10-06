import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getReports } from "@/sanity/reports";
import { getImpactStats } from "@/sanity/home";
import {
  ImpactDataRoom,
  ReportLibrary,
  CommitmentSection,
  impactPageContent,
} from "@/components/sections/impact";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("impact", "/impact", locale);
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const content = impactPageContent;
  const [reports, liveStats] = await Promise.all([
    getReports(),
    getImpactStats(),
  ]);

  // The figures live in the `homeImpact` singleton so this page and the home
  // page cannot disagree. The static copy stays as a fallback for when Sanity
  // is unreachable, matching how the home page sections behave.
  const stats = liveStats.length ? liveStats : content.stats.stats;

  // An explicitly featured report wins; otherwise the most recently published
  // one, since the query already returns them newest first.
  const latest = reports.find((report) => report.featured) ?? reports[0] ?? null;

  return (
    <div className="w-full bg-white">
      <ImpactDataRoom hero={content.hero} stats={stats} latest={latest} locale={loc} />
      <ReportLibrary
        data={content.library}
        reports={reports}
        latestId={latest?.id ?? null}
        locale={loc}
      />
      <CommitmentSection data={content.commitment} locale={loc} />
    </div>
  );
}

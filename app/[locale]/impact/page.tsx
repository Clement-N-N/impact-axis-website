import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getReports } from "@/sanity/reports";
import {
  ImpactHero,
  ImpactStatsBand,
  LatestReport,
  ReportsList,
  CommitmentSection,
  impactPageContent,
} from "@/components/sections/impact";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = isFr
    ? "Impact et redevabilité — Impact Axis"
    : "Impact & Accountability — Impact Axis";
  const description = isFr
    ? "Nos résultats, nos rapports annuels et nos documents de redevabilité : ce que nous avons accompli, ce que nous apprenons et où nous allons."
    : "Our results, annual reports and accountability documents: what we have done, what we are learning and where we are going next.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/impact`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/impact`,
        fr: `${baseUrl}/fr/impact`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const content = impactPageContent;
  const reports = await getReports();

  // An explicitly featured report wins; otherwise the most recently published
  // one, since the query already returns them newest first.
  const latest = reports.find((report) => report.featured) ?? reports[0] ?? null;

  return (
    <div className="w-full bg-white">
      <ImpactHero data={content.hero} locale={loc} />
      <ImpactStatsBand data={content.stats} locale={loc} />
      <LatestReport data={content.latest} report={latest} locale={loc} />
      <ReportsList data={content.reports} reports={reports} locale={loc} />
      <CommitmentSection data={content.commitment} locale={loc} />
    </div>
  );
}

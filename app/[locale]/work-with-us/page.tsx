import type { Metadata } from "next";
import { pageTitle, withBrand } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getImpactStats } from "@/sanity/home";
import {
  HubAudienceHero,
  HubClosing,
  HubExamples,
  HubProof,
  HubSteps,
} from "@/components/sections/work-with-us/HubSections";
import { FALLBACK_STATS } from "@/components/sections/work-with-us/hub-data";
import type { ImpactStatEntry } from "@/sanity/home";

/** Four figures: reach first, then the money figure, then the rest. */
function pickStats(stats: ImpactStatEntry[]) {
  if (!stats.length) return FALLBACK_STATS;
  const money = stats.find((s) => s.value.includes("$"));
  const rest = stats.filter((s) => s !== money);
  return [rest[0], money, ...rest.slice(1)]
    .filter(Boolean)
    .slice(0, 4) as ImpactStatEntry[];
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = pageTitle("workWithUs", locale);
  const description = isFr
    ? "Impact Axis collabore avec des financeurs, des employeurs, des établissements d'enseignement et des professionnels pour élargir l'accès des jeunes aux compétences, à l'expérience et aux opportunités au Cameroun."
    : "Impact Axis partners with funders, employers, education institutions and professionals to expand young people's access to skills, experience and meaningful opportunities in Cameroon.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/work-with-us`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/work-with-us`,
        fr: `${baseUrl}/fr/work-with-us`,
      },
    },
    openGraph: {
      title: withBrand(title),
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function WorkWithUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;

  // The same `homeImpact` singleton the home and Impact pages read, so the
  // figures cannot disagree; the fallback only covers a Sanity outage.
  const stats = pickStats(await getImpactStats());

  return (
    <div className="w-full bg-white">
      <HubAudienceHero locale={loc} />
      <HubProof locale={loc} stats={stats} />
      <HubSteps locale={loc} />
      <HubExamples locale={loc} />
      <HubClosing locale={loc} />
    </div>
  );
}

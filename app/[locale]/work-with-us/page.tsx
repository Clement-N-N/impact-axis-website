import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getImpactStats } from "@/sanity/home";
import { ParallaxImage } from "@/components/sections/parallax-image";
import {
  HubHero,
  WhyPartnerSection,
  WaysToWorkSection,
  HowWePartnerSection,
  WhyImpactAxisSection,
  OpportunitiesSection,
  workWithUsPageContent,
} from "@/components/sections/work-with-us";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = isFr
    ? "Travailler avec nous — Impact Axis"
    : "Work With Us — Impact Axis";
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
      title,
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
  const content = workWithUsPageContent;

  // The same `homeImpact` singleton the home and Impact pages read, so the
  // figures cannot disagree between the three places that show them.
  const stats = await getImpactStats();

  return (
    <div className="w-full bg-white">
      <HubHero data={content.hero} locale={loc} />
      <WhyPartnerSection data={content.whyPartner} locale={loc} />
      {/* The page was wall-to-wall text. Every other page breaks its reading
          with photography, and this component already exists for it. */}
      <ParallaxImage
        src="/images/alumni-2.png"
        heightClass="h-[38vh] sm:h-[48vh] lg:h-[62vh]"
        padded={false}
        reveal
      />
      <WaysToWorkSection data={content.waysToWork} locale={loc} />
      <HowWePartnerSection data={content.howWePartner} locale={loc} />
      <WhyImpactAxisSection
        data={content.whyImpactAxis}
        stats={stats}
        locale={loc}
      />
      <OpportunitiesSection data={content.opportunities} locale={loc} />
    </div>
  );
}

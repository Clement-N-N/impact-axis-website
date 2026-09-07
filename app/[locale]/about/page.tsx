import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  AboutHero,
  WhyWeExistAbout,
  MissionVisionSection,
  ArchDivider,
  OurApproachSection,
  OurStorySection,
  OurPrinciplesSection,
  OurPeopleSection,
  PartnershipSection,
  aboutPageContent,
} from "@/components/sections/about";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = isFr ? "À propos de nous — Impact Axis" : "About Us — Impact Axis";
  const description = isFr
    ? "Impact Axis est une organisation à but non lucratif qui développe l'employabilité et les compétences des jeunes au Cameroun."
    : "Impact Axis is a Cameroon-based nonprofit youth workforce development organisation building stronger pathways to meaningful work.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/about`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/about`,
        fr: `${baseUrl}/fr/about`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const content = aboutPageContent;

  return (
    <div className="w-full bg-white">
      <AboutHero data={content.hero} locale={loc} />
      <WhyWeExistAbout data={content.whyWeExist} locale={loc} />
      <MissionVisionSection data={content.missionVision} locale={loc} />
      <ArchDivider />
      <OurApproachSection data={content.ourApproach} locale={loc} />
      <OurStorySection data={content.ourStory} locale={loc} />
      <OurPrinciplesSection data={content.ourPrinciples} locale={loc} />
      <OurPeopleSection data={content.ourPeople} locale={loc} />
      <PartnershipSection data={content.partnership} locale={loc} />
    </div>
  );
}

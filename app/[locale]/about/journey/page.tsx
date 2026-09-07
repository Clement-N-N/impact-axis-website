import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  JourneyHero,
  JourneyTimeline,
  JourneyCta,
  journeyPageContent,
} from "@/components/sections/journey";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = isFr ? "Notre parcours — Impact Axis" : "Our Journey — Impact Axis";
  const description = isFr
    ? "Découvrez l'évolution d'Impact Axis : d'une recherche universitaire en 2021 à la construction de systèmes durables pour le développement des talents en 2025 et au-delà."
    : "Follow the evolution of Impact Axis: from a university research inquiry in 2021 to an enduring talent and workforce systems builder in 2025 and beyond.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/about/journey`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/about/journey`,
        fr: `${baseUrl}/fr/about/journey`,
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

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;

  return (
    <div className="w-full bg-white">
      <JourneyHero data={journeyPageContent.hero} locale={loc} />
      <JourneyTimeline milestones={journeyPageContent.milestones} locale={loc} />
      <JourneyCta data={journeyPageContent.cta} locale={loc} />
    </div>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  WhatWeDoHero,
  OurFocusSection,
  OurProgrammesSection,
  WhatMakesDifferentSection,
  WorkInActionSection,
  OurWorkClosingCta,
  whatWeDoPageContent,
} from "@/components/sections/what-we-do";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  const title = isFr ? "Notre travail — Impact Axis" : "Our Work — Impact Axis";
  const description = isFr
    ? "Impact Axis conçoit et met en œuvre au Cameroun des programmes de développement de l'employabilité des jeunes : compétences pratiques, expérience concrète et accès aux opportunités."
    : "Impact Axis designs and delivers youth workforce development programmes in Cameroon, building practical skills, real-world experience and access to opportunity.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/what-we-do`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/what-we-do`,
        fr: `${baseUrl}/fr/what-we-do`,
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

export default async function WhatWeDoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const content = whatWeDoPageContent;

  return (
    <div className="w-full bg-white">
      <WhatWeDoHero data={content.hero} locale={loc} />
      <OurFocusSection data={content.focus} locale={loc} />
      <OurProgrammesSection data={content.programmes} locale={loc} />
      <WhatMakesDifferentSection data={content.different} locale={loc} />
      <WorkInActionSection data={content.workInAction} locale={loc} />
      <OurWorkClosingCta data={content.closing} locale={loc} />
    </div>
  );
}

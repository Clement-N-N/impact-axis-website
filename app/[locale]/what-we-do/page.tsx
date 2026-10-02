import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  WhatWeDoHero,
  OurFocusSection,
  OurProgrammesSection,
  EventGallerySection,
  whatWeDoPageContent,
} from "@/components/sections/what-we-do";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("whatWeDo", "/what-we-do", locale);
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
      {/* "What makes our work different" and "Work in action" are hidden
          for now (components and content kept) in favour of the gallery. */}
      <EventGallerySection data={content.gallery} locale={loc} />
      {/* "Find your place in our work" (OurWorkClosingCta) is hidden for
          now; component and content kept. */}
    </div>
  );
}

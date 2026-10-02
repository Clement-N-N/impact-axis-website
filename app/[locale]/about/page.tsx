import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  AboutHero,
  WhyWeExistAbout,
  OurStorySection,
  MissionVisionSection,
  PhotoStrip,
  OurApproachSection,
  OurPrinciplesSection,
  TeamSection,
  aboutPageContent,
} from "@/components/sections/about";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("about", "/about", locale);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const content = aboutPageContent;

  return (
    <div className="w-full bg-white">
      <AboutHero data={content.hero} locale={loc} />
      {/* The "Youth workforce development in Cameroon" image band
          (AboutImageBand) is hidden for now; component and content kept. */}
      <WhyWeExistAbout data={content.whyWeExist} locale={loc} />
      <OurStorySection data={content.ourStory} locale={loc} />
      <MissionVisionSection data={content.missionVision} locale={loc} />
      <PhotoStrip data={content.photoStrip} locale={loc} />
      <OurApproachSection data={content.ourApproach} locale={loc} />
      <OurPrinciplesSection data={content.ourPrinciples} locale={loc} />
      {/* Partnership now lives on Work With Us (and as a logo strip on the
          home page); the About page ends with the people instead. */}
      <TeamSection data={content.team} locale={loc} />
    </div>
  );
}

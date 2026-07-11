import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/sections/home-hero";
import { WhyWeExist } from "@/components/sections/why-we-exist";
import { ParallaxImage } from "@/components/sections/parallax-image";
import { HomeSolution } from "@/components/sections/home-solution";
import { WhoWeServe } from "@/components/sections/who-we-serve";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { OurImpact } from "@/components/sections/our-impact";
import { HomeTestimonials } from "@/components/sections/home-testimonials";
import { HomeBlog } from "@/components/sections/home-blog";
import { HomeFaq } from "@/components/sections/home-faq";
import { BottomCta } from "@/components/sections/bottom-cta";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero locale={locale as Locale} />
      <WhyWeExist locale={locale as Locale} />
      <ParallaxImage src="/images/team-1.jpg" heightClass="h-[55vh]" />
      <HomeSolution locale={locale as Locale} />
      <ParallaxImage src="/images/pattern-1.png" heightClass="h-[35vh]" padded={false} />
      <WhoWeServe locale={locale as Locale} />
      <WhatWeBuild locale={locale as Locale} />
      <OurImpact locale={locale as Locale} />
      <HomeTestimonials locale={locale as Locale} />
      <HomeBlog locale={locale as Locale} />
      <HomeFaq locale={locale as Locale} />
      <BottomCta locale={locale as Locale} />
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/sections/home-hero";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeHero locale={locale as Locale} />;
}

import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { HOME_SETTINGS_QUERY } from "@/sanity/queries";
import { heroConfig } from "@/components/sections/home-hero/data";
import { isHeroVariantId } from "./types";
import { PromoCardHero } from "./PromoCardHero";
import { OverlayWelcomeHero } from "./OverlayWelcomeHero";
import { CollageDarkHero } from "./CollageDarkHero";
import { CollageDescriptionHero } from "./CollageDescriptionHero";
import { FullbleedOverlayHero } from "./FullbleedOverlayHero";

type HomeSettingsQueryResult = { heroVariant: string } | null;

async function getActiveHeroVariant() {
  try {
    const settings = await client.fetch<HomeSettingsQueryResult>(
      HOME_SETTINGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    if (settings && isHeroVariantId(settings.heroVariant)) {
      return settings.heroVariant;
    }
  } catch (error) {
    console.error(
      "Failed to fetch home hero settings from Sanity, falling back to default hero variant.",
      error,
    );
  }
  return heroConfig.activeHero;
}

export async function HomeHero({ locale }: { locale: Locale }) {
  const activeHero = await getActiveHeroVariant();
  const data = heroConfig.heroes[activeHero];

  switch (data.type) {
    case "promo-card":
      return <PromoCardHero data={data} locale={locale} />;
    case "overlay-welcome":
      return <OverlayWelcomeHero data={data} locale={locale} />;
    case "collage-dark":
      return <CollageDarkHero data={data} locale={locale} />;
    case "collage-description":
      return <CollageDescriptionHero data={data} locale={locale} />;
    case "fullbleed-overlay":
      return <FullbleedOverlayHero data={data} locale={locale} />;
  }
}

import type { Locale } from "@/i18n/routing";
import { heroConfig } from "@/components/sections/home-hero/data";
import { PromoCardHero } from "./PromoCardHero";
import { OverlayWelcomeHero } from "./OverlayWelcomeHero";
import { CollageDarkHero } from "./CollageDarkHero";
import { CollageDescriptionHero } from "./CollageDescriptionHero";
import { FullbleedOverlayHero } from "./FullbleedOverlayHero";

export function HomeHero({ locale }: { locale: Locale }) {
  const data = heroConfig.heroes[heroConfig.activeHero];

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

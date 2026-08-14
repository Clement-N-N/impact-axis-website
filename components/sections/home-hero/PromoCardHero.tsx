import { cva } from "class-variance-authority";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PromoCard } from "@/components/ui/PromoCard";
import { HeroBackgroundSlideshow } from "./HeroBackgroundSlideshow";
import {
  getLocalizedText,
  type HeroVariantProps,
  type PromoCardHeroContent,
} from "./types";

const headlineColStyles = cva("flex flex-col gap-6 self-end", {
  variants: {
    locale: {
      en: "lg:col-span-6",
      fr: "lg:col-span-6",
    },
  },
  defaultVariants: { locale: "en" },
});

const cardColStyles = cva("self-center", {
  variants: {
    locale: {
      en: "col-span-3 col-start-10",
      fr: "col-span-3 col-start-10",
    },
  },
  defaultVariants: { locale: "en" },
});

export function PromoCardHero({
  data,
  locale,
}: HeroVariantProps<PromoCardHeroContent>) {
  return (
    <section className="relative w-full overflow-hidden lg:min-h-[calc(100vh-60px)] 2xl:min-h-[calc(100vh-70px)]">
      <HeroBackgroundSlideshow images={data.backgroundImages} />
      <div className="absolute inset-0 z-10 flex h-full w-full items-end bg-[#0D0D0D]/65">
        <Container className="gap-gutter grid grid-cols-1 py-12 lg:grid-cols-12">
          <div className={headlineColStyles({ locale })}>
            <h1 className="text-5xl !font-medium text-white">
              {getLocalizedText(data.headline, locale)}
            </h1>
            <Button
              href={data.seeAllStoriesButton.href}
              variant="primary"
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
              className="w-fit"
            >
              {getLocalizedText(data.seeAllStoriesButton.label, locale)}
            </Button>
          </div>

          <PromoCard content={data.card} locale={locale} className={cardColStyles({ locale })} />
        </Container>
      </div>
    </section>
  );
}

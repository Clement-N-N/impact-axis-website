import { cva } from "class-variance-authority";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
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

const cardColStyles = cva(
  "self-center bg-white p-3 flex flex-col gap-4",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

const cardStyles = cva(
  "self-center bg-[image:var(--gradient-yellow)] p-3 flex flex-col gap-4",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

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

          <div className={cardColStyles({ locale })}>
            <div className={cardStyles({ locale })}>
              <span className="text-sm font-medium text-black">
         
                {getLocalizedText(data.card.badgeLabel, locale)}
              </span>
              <div className="relative h-40 w-full overflow-hidden rounded-xl">
                <Image
                  src={data.card.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg !font-medium text-black !leading-[120%]">
                {getLocalizedText(data.card.title, locale)}
              </h2>
              <p className="text-black text-sm">
                {getLocalizedText(data.card.dateLine, locale)}
              </p>
              <Button
                href={data.card.applyButton.href}
                variant="dark"
                icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
              >
                {getLocalizedText(data.card.applyButton.label, locale)}
              </Button>
              <Button
                href={data.card.learnMoreButton.href}
                variant="text"
                className="self-center"
              >
                {getLocalizedText(data.card.learnMoreButton.label, locale)}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

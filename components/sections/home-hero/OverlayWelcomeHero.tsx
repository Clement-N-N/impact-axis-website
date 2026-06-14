import { cva } from "class-variance-authority";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { HeroBackgroundSlideshow } from "./HeroBackgroundSlideshow";
import { getLocalizedText, type HeroVariantProps, type OverlayWelcomeHeroContent } from "./types";

const contentColStyles = cva("flex flex-col gap-6 self-center", {
  variants: {
    locale: {
      en: "col-span-7 col-start-6",
      fr: "col-span-8 col-start-5",
    },
  },
  defaultVariants: { locale: "en" },
});

export function OverlayWelcomeHero({ data, locale }: HeroVariantProps<OverlayWelcomeHeroContent>) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <HeroBackgroundSlideshow images={data.backgroundImages} />
      <div className="absolute inset-0 bg-black/30" />
      <Container className="absolute inset-0 z-10 grid grid-cols-1 gap-gutter py-12 lg:grid-cols-12">
        <span className="col-span-2 self-center text-sm text-white">
          {getLocalizedText(data.eyebrow, locale)}
        </span>

        <div className={contentColStyles({ locale })}>
          <h1 className="text-5xl font-medium text-white">
            {getLocalizedText(data.headline, locale)}{" "}
            <span className="font-light">{getLocalizedText(data.headlineEmphasis, locale)}</span>
          </h1>
          <Button
            href={data.seeAllStoriesButton.href}
            variant="primary"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.seeAllStoriesButton.label, locale)}
          </Button>
        </div>
      </Container>
    </section>
  );
}

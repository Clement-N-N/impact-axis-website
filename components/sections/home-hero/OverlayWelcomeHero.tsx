import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { HeroBackgroundSlideshow } from "./HeroBackgroundSlideshow";
import {
  getLocalizedText,
  type HeroVariantProps,
  type OverlayWelcomeHeroContent,
} from "./types";

export function OverlayWelcomeHero({
  data,
  locale,
}: HeroVariantProps<OverlayWelcomeHeroContent>) {
  return (
    <section className="relative w-full overflow-hidden lg:min-h-[calc(100vh-60px)] 2xl:min-h-[calc(100vh-70px)]">
      <HeroBackgroundSlideshow images={data.backgroundImages} />
      <div className="absolute h-full w-full inset-0 bg-[#0D0D0D]/65 flex items-end">
        <Container className="b-0 gap-gutter grid h-fit grid-cols-1 py-[100px] lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-2 lg:block">
            <div className="h-[8px] w-[8px] bg-white mt-[1vw]" />
          </div>

          <div className="h-full lg:col-span-4">
            <span className="text-lg text-white leading-[3vw]">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
          </div>

          <div className="flex h-full flex-col gap-10 lg:col-span-6">
            <h1 className="text-[4vw] leading-[4.5vw] !font-normal text-white">
              {getLocalizedText(data.headline, locale)}{" "}
              <span className="font-normal italic">
                {getLocalizedText(data.headlineEmphasis, locale)}
              </span>
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
        </Container>
      </div>
    </section>
  );
}

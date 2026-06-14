import { cva } from "class-variance-authority";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText, type CollageDarkHeroContent, type HeroVariantProps } from "./types";

const textColStyles = cva("flex flex-col gap-6 self-center", {
  variants: {
    locale: {
      en: "col-span-5",
      fr: "col-span-6",
    },
  },
  defaultVariants: { locale: "en" },
});

const collageColStyles = cva("flex h-[70vh] items-end gap-gutter self-end pb-12", {
  variants: {
    locale: {
      en: "col-span-7 col-start-6",
      fr: "col-span-6 col-start-7",
    },
  },
  defaultVariants: { locale: "en" },
});

const COLLAGE_HEIGHTS = ["h-3/4", "h-full", "h-1/2"];

export function CollageDarkHero({ data, locale }: HeroVariantProps<CollageDarkHeroContent>) {
  return (
    <section className="min-h-screen w-full bg-impact-blue">
      <Container className="grid h-full grid-cols-1 gap-gutter py-12 lg:grid-cols-12">
        <div className={textColStyles({ locale })}>
          <h1 className="text-5xl font-medium text-white">
            {getLocalizedText(data.headline, locale)}
          </h1>
          <Button
            href={data.seeAllStoriesButton.href}
            variant="primary"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.seeAllStoriesButton.label, locale)}
          </Button>
        </div>

        <div className={collageColStyles({ locale })}>
          {data.collageImages.map((src, index) => (
            <div key={src} className={`relative w-full flex-1 overflow-hidden ${COLLAGE_HEIGHTS[index]}`}>
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

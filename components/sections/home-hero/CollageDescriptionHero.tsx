import { cva } from "class-variance-authority";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  getLocalizedText,
  type CollageDescriptionHeroContent,
  type HeroVariantProps,
} from "./types";

const headlineColStyles = cva("row-start-1", {
  variants: {
    locale: {
      en: "col-span-7",
      fr: "col-span-8",
    },
  },
  defaultVariants: { locale: "en" },
});

const descriptionColStyles = cva(
  "row-start-2 flex flex-col gap-6 self-end border-l border-white/30 pl-6",
  {
    variants: {
      locale: {
        en: "col-span-3",
        fr: "col-span-4",
      },
    },
    defaultVariants: { locale: "en" },
  }
);

const collageColStyles = cva("row-start-2 flex h-[60vh] items-end gap-gutter self-end", {
  variants: {
    locale: {
      en: "col-span-6 col-start-7",
      fr: "col-span-5 col-start-8",
    },
  },
  defaultVariants: { locale: "en" },
});

const COLLAGE_HEIGHTS = ["h-3/4", "h-full", "h-1/2"];

export function CollageDescriptionHero({
  data,
  locale,
}: HeroVariantProps<CollageDescriptionHeroContent>) {
  return (
    <section className="min-h-screen w-full bg-impact-blue">
      <Container className="grid h-full grid-cols-1 grid-rows-[auto_1fr] gap-gutter py-12 lg:grid-cols-12">
        <h1 className={`${headlineColStyles({ locale })} text-5xl font-medium text-white`}>
          {getLocalizedText(data.headline, locale)}
        </h1>

        <div className={descriptionColStyles({ locale })}>
          <p className="text-base text-white/80">{getLocalizedText(data.description, locale)}</p>
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

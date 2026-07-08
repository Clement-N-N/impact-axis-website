import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  getLocalizedText,
  type CollageDescriptionHeroContent,
  type HeroVariantProps,
} from "./types";

const COLLAGE_HEIGHTS = ["h-[69.44%]", "h-[83.33%]", "h-full"];
const COLLAGE_BACKGROUNDS = [
  "bg-[image:var(--gradient-blue)]",
  "bg-[image:var(--gradient-yellow)]",
  "bg-[image:var(--gradient-peach)]",
];
// Each box shows a slice of one shared image, scaled to the middle box's own
// height (not the full row) so the slices line up into a single seamless photo.
const COLLAGE_IMAGE_SCALES = ["120%", "100%", "83.33%"];
// Boxes are equal width but separated by gap-gutter, so the virtual image
// (spanning all 3 boxes + the 2 gaps between them) and each box's offset into
// it must account for that gap in px, not just box-width percentages.
const COLLAGE_IMAGE_WIDTH = "calc(300% + 2 * var(--spacing-gutter))";
const COLLAGE_IMAGE_LEFTS = [
  "0px",
  "calc(-100% - var(--spacing-gutter))",
  "calc(-200% - 2 * var(--spacing-gutter))",
];
const COLLAGE_IMAGE_SRC = "/images/collage-image-1.png";

export function CollageDescriptionHero({
  data,
  locale,
}: HeroVariantProps<CollageDescriptionHeroContent>) {
  return (
    <section className="relative min-h-screen w-full bg-impact-blue lg:h-[calc(100vh-var(--header-height))] lg:min-h-0">
      <div className="absolute inset-0 h-full w-full bg-overlay-dark/45">
        <Container className="h-full grid grid-cols-1 py-12 gap-gutter lg:grid-cols-12 ">
          <div className="grid grid-cols-1 gap-gutter content-between lg:col-span-6 lg:h-full lg:grid-cols-6">
            <h1 className="text-5xl font-medium text-white w-[95%] lg:col-span-6">
              {getLocalizedText(data.headline, locale)}
            </h1>
            <p className="border-l-2 border-white/25 pl-3 text-base text-white lg:col-span-3 lg:col-start-3">
              {getLocalizedText(data.description, locale)}
            </p>
            <Button
              href={data.seeAllStoriesButton.href}
              variant="primary"
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
              className="lg:col-span-6"
            >
              {getLocalizedText(data.seeAllStoriesButton.label, locale)}
            </Button>
          </div>

          <div className="flex h-[100%] items-end gap-gutter self-end lg:col-span-6">
            {COLLAGE_HEIGHTS.map((height, index) => (
              <div
                key={index}
                className={`relative w-full flex-1 overflow-hidden ${height} ${COLLAGE_BACKGROUNDS[index]}`}
              >
                <div
                  className="absolute bottom-0 overflow-hidden"
                  style={{
                    left: COLLAGE_IMAGE_LEFTS[index],
                    width: COLLAGE_IMAGE_WIDTH,
                    height: COLLAGE_IMAGE_SCALES[index],
                  }}
                >
                  <Image src={COLLAGE_IMAGE_SRC} alt="" fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

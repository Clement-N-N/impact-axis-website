import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { AboutHeroContent } from "./types";
import {
  HeroStagger,
  HeroStaggerItem,
  HeroSubjectMotion,
} from "./AboutHeroMotion";
import { HeroCta, HighlightedText } from "./AboutHeroParts";

/**
 * About page hero: a centred headline whose key
 * phrases warm to brand yellow, the paragraph and CTA beneath, and the
 * cohort cut-out rising up from the bottom edge over a navy-to-slate floor.
 *
 * Server component; motion comes from `AboutHeroMotion`.
 */
export function AboutHero({
  data,
  locale,
}: {
  data: AboutHeroContent;
  locale: Locale;
}) {
  return (
    <section className="relative isolate flex w-full flex-col overflow-hidden bg-[linear-gradient(to_bottom,#101b62_55%,#47486c_88%)] lg:min-h-[calc(100svh-var(--header-height))]">
      <Container className="relative z-10 pt-14 md:pt-20 lg:pt-16">
        <HeroStagger className="mx-auto flex max-w-[62rem] flex-col items-center gap-6 text-center">
          <HeroStaggerItem>
            <h1 className="text-5xl leading-[1.1]! font-light! tracking-[-0.02em] text-balance text-white">
              <HighlightedText text={getLocalizedText(data.headline, locale)} />
            </h1>
          </HeroStaggerItem>
          <HeroStaggerItem>
            <p className="mx-auto max-w-[60ch] text-lg text-pretty text-white/85">
              {getLocalizedText(data.paragraph, locale)}
            </p>
          </HeroStaggerItem>
          <HeroStaggerItem className="pt-2">
            <HeroCta
              href={data.cta.href}
              label={getLocalizedText(data.cta.label, locale)}
            />
          </HeroStaggerItem>
        </HeroStagger>
      </Container>

      {/* Cohort: cut-out along the floor, cropped at chest height as in the
          design, its raised hands reaching up towards the CTA. Wider than the
          viewport on small screens so faces stay a readable size (sides crop). */}
      <HeroSubjectMotion
        delay={0.5}
        rise={80}
        className="relative mx-auto mt-auto aspect-[1848/665] w-[150%] max-w-none shrink-0 self-center pt-10 md:w-[110%] lg:w-[min(84rem,90%)] lg:pt-6"
      >
        <Image
          src={data.image.src}
          alt={getLocalizedText(data.image.alt, locale)}
          fill
          preload
          // Lossless PNG source served once-compressed at q90 (allowed in
          // next.config); sizes mirror the box widths below.
          quality={90}
          sizes="(min-width: 1024px) min(84rem, 90vw), (min-width: 768px) 110vw, 150vw"
          className="object-contain object-bottom"
        />
      </HeroSubjectMotion>
    </section>
  );
}

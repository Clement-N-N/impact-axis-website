"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { PartnerLogoMarquee } from "@/components/sections/partners/PartnerLogoMarquee";
import type { PartnershipContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Partnership: the heading and intro, then the partners as two rows of
 * logo cards gliding in opposite directions (paused on hover, with a
 * pause control for WCAG 2.2.2), and a navy call-to-action panel to close
 * the page. Logos sit in greyscale and come to colour on hover.
 *
 * Under prefers-reduced-motion the rows don't move; each becomes a
 * wrapped grid of every partner instead.
 */
export function PartnershipSection({
  data,
  locale,
}: {
  data: PartnershipContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }
      gsap.from("[data-rise]", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="partnership-title"
      className="py-section w-full overflow-hidden bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="partnership-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[46ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>
      </Container>

      {/* Logos: full-bleed rows. */}
      <div data-rise className="mt-12 md:mt-16">
        <PartnerLogoMarquee locale={locale} rows={2} logos={data.logos} />
      </div>

      {/* Closing call to action. */}
      <Container className="mt-12 md:mt-16">
        <div
          data-rise
          className="bg-impact-blue relative isolate overflow-hidden rounded-[28px] px-6 py-10 text-white md:rounded-[36px] md:px-12 md:py-14 lg:px-16"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-[#74b9ff]/25 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-[#a9d3ff]/15 blur-[90px]"
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <h3 className="text-4xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance">
                {getLocalizedText(data.ctaHeadline, locale)}
              </h3>
              <p className="max-w-[58ch] text-lg text-pretty text-white/75">
                {getLocalizedText(data.ctaParagraph, locale)}
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Button
                href={data.cta.href}
                variant="primary"
                icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
              >
                {getLocalizedText(data.cta.label, locale)}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

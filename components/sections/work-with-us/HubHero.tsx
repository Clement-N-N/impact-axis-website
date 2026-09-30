"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HubHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * A full-bleed photograph with the headline over it.
 *
 * About, Our Work and Impact all open on white text, so a fourth would have
 * been the fourth copy of one template — and this page had no image above the
 * fold at all. The treatment is not invented: the home page's hero already has
 * full-bleed overlay variants, down to the `#0D0D0D`/65 scrim. No interior page
 * uses one, which is what makes it read as this page's own opening.
 *
 * The supporting paragraphs and the call to action sit below the image on
 * white, where they are read rather than fought against by the photograph.
 */
export function HubHero({
  data,
  locale,
}: {
  data: HubHeroContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const bodyItems = bodyRef.current
        ? gsap.utils.toArray<HTMLElement>(bodyRef.current.children)
        : [];
      const fadeTargets = [eyebrowRef.current, ...bodyItems].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline();
          tl.to(eyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.65, ease: "power4.out", stagger: 0.1 },
              "-=0.3",
            )
            .to(
              bodyItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.35",
            );

          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white">
      <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden lg:h-[72vh]">
        <Image
          src="/images/girls-1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/65" />

        <div className="absolute inset-0 flex items-end pb-12 lg:pb-16">
          <Container className="gap-gutter grid w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-10">
              <span
                ref={eyebrowRef}
                className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/70"
              >
                {getLocalizedText(data.eyebrow, locale)}
              </span>
              <h1 className="mt-5 text-[clamp(1.875rem,4.2vw,3.5rem)] leading-[1.1] font-medium text-white lg:mt-6">
                <span ref={headlineRef} className="block">
                  {getLocalizedText(data.headline, locale)}
                </span>
              </h1>
            </div>
          </Container>
        </div>
      </div>

      <Container className="gap-gutter pt-section grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div
          ref={bodyRef}
          className="gap-gutter col-span-4 grid grid-cols-1 md:col-span-8 lg:col-span-10 lg:col-start-3 lg:grid-cols-2"
        >
          {data.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-impact-gray text-[clamp(0.9375rem,1.15vw,1.0625rem)] leading-[1.7]"
            >
              {getLocalizedText(paragraph, locale)}
            </p>
          ))}

          <div className="lg:col-span-2">
            <Button
              href={data.cta.href}
              variant="primary"
              icon={<ArrowRightIcon weight="bold" />}
            >
              {getLocalizedText(data.cta.label, locale)}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

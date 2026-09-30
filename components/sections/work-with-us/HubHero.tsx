"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HubHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * The headline runs the full width and the two paragraphs sit beneath it in
 * two columns, rather than the eyebrow-left/stack-right arrangement About, Our
 * Work and Impact all open with. Same furniture, different structure, so the
 * page does not read as the fourth copy of one template.
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
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>

          <h1 className="mt-6 text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.1] font-medium text-black lg:mt-8">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h1>
        </div>

        <div
          ref={bodyRef}
          className="gap-gutter col-span-4 mt-10 grid grid-cols-1 md:col-span-8 lg:col-span-10 lg:col-start-3 lg:mt-14 lg:grid-cols-2"
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

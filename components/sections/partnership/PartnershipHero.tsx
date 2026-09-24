"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type PartnershipHeroProps = {
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  locale: Locale;
};

export function PartnershipHero({
  headline,
  paragraphs,
  locale,
}: PartnershipHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const paragraphItems = paragraphsRef.current
        ? gsap.utils.toArray<HTMLElement>(paragraphsRef.current.children)
        : [];

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(paragraphItems, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(paragraphItems, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(self.lines, {
            yPercent: 0,
            duration: 0.6,
            ease: "power4.out",
            stagger: 0.12,
          }).to(
            paragraphItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.18,
            },
            "-=0.3",
          );

          // Returning the timeline lets SplitText kill/redo it cleanly if
          // autoSplit re-runs on a breakpoint change.
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
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <h1
          ref={headlineRef}
          className="col-span-4 text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black md:col-span-8 lg:col-span-5"
        >
          {getLocalizedText(headline, locale)}
        </h1>

        <div
          ref={paragraphsRef}
          className="col-span-4 mt-6 flex flex-col gap-6 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:mt-0"
        >
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]"
            >
              {getLocalizedText(paragraph, locale)}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

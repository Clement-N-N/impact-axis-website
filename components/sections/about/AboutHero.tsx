"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { AboutHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function AboutHero({
  data,
  locale,
}: {
  data: AboutHeroContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const fadeTargets = [eyebrowRef.current, paragraphRef.current].filter(
        Boolean,
      );
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

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              paragraphRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.2",
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
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-6">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
          <h1
            ref={headlineRef}
            className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black"
          >
            {getLocalizedText(data.headline, locale)}
          </h1>
        </div>

        <p
          ref={paragraphRef}
          className="text-impact-gray col-span-4 mt-4 text-[clamp(0.9375rem,1.05vw,1rem)] md:col-span-8 lg:col-span-4 lg:col-start-9 lg:mt-0"
        >
          {getLocalizedText(data.paragraph, locale)}
        </p>
      </Container>
    </section>
  );
}

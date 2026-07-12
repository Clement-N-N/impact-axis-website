"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { ourImpactContent } from "./data";
import { ImpactCard } from "./ImpactCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OurImpact({ locale }: { locale: Locale }) {
  const data = ourImpactContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const cardItems = cardsWrapperRef.current
        ? gsap.utils.toArray<HTMLElement>(cardsWrapperRef.current.children)
        : [];

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
            gsap.set(cardItems, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
          gsap.set(cardItems, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              cardItems,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
              "-=0.3",
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
    <section ref={sectionRef} className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-6">
            <div className="hidden h-full lg:col-span-1 lg:block">
              <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
            </div>

            <div className="lg:col-span-2 lg:col-start-2">
              <span ref={eyebrowRef} className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
                {getLocalizedText(data.eyebrow, locale)}
              </span>
            </div>

            <div className="mt-16 lg:col-span-5 lg:col-start-1">
              <h2 ref={headlineRef} className="text-[clamp(1.125rem,2vw,1.7rem)] font-medium leading-[1.3] text-black">
                {getLocalizedText(data.paragraph, locale)}
              </h2>
            </div>
          </div>
        </div>

        <div
          ref={cardsWrapperRef}
          className="col-span-4 grid grid-cols-1 gap-gutter md:col-span-8 md:grid-cols-2 lg:col-span-6 lg:col-start-7"
        >
          {data.metrics.map((metric) => (
            <ImpactCard key={metric.number} metric={metric} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}

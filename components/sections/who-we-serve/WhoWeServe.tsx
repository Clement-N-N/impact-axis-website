"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whoWeServeContent } from "./data";
import type { WhoWeServeContent } from "./types";
import { WhoWeServeCard } from "./WhoWeServeCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARD_COL_STARTS = ["lg:col-start-4", "lg:col-start-7", "lg:col-start-10"];

export function WhoWeServe({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: WhoWeServeContent;
}) {
  const data = propData ?? whoWeServeContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".js-who-we-serve-card");
      const targets = [eyebrowRef.current, ...cards].filter(
        (el): el is HTMLElement => !!el,
      );

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 20 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-2">
          <span ref={eyebrowRef} className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        {data.cards.map((card, index) => (
          <WhoWeServeCard
            key={card.number}
            card={card}
            locale={locale}
            className={CARD_COL_STARTS[index]}
          />
        ))}
      </Container>
    </section>
  );
}

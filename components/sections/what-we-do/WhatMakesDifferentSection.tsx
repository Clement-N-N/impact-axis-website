"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WhatMakesDifferentContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Cards in the language of `who-we-serve`, sized to their content.
 *
 * Each trait is a title, a line of description and a mark drawn to match the
 * existing `public/icons` set — 120x120, navy `#101B62` with the gold
 * `#F4C600`/`#FFDE75` gradient. `who-we-serve` fills a tall `2/3` portrait card
 * because it has a statistic to hold the space; these three have a single
 * sentence each, so the same ratio left most of the card empty.
 *
 * The description is shown outright rather than behind `group-hover` as
 * `who-we-serve` does, since a phone cannot reliably fire hover and that would
 * put the text out of reach for most visitors.
 */
export function WhatMakesDifferentSection({
  data,
  locale,
}: {
  data: WhatMakesDifferentContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current
        ? gsap.utils.toArray<HTMLElement>(cardsRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        introRef.current,
        ...cards,
      ].filter(Boolean);

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
              introRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.3",
            )
            .to(
              cards,
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
                stagger: 0.12,
              },
              "-=0.25",
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
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>

          <p
            ref={introRef}
            className="text-impact-gray mt-6 max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]"
          >
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="gap-gutter col-span-4 mt-12 grid grid-cols-1 md:col-span-8 md:grid-cols-3 lg:col-span-12"
        >
          {data.traits.map((trait, index) => (
            <div
              key={index}
              className="hover:bg-impact-yellow/10 flex flex-col gap-4 bg-[#F5F5F5] p-6 transition-colors duration-300 lg:gap-5 lg:p-7"
            >
              <Image
                src={trait.icon}
                alt=""
                width={120}
                height={120}
                className="h-12 w-12 lg:h-14 lg:w-14"
              />
              <h3 className="text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.25] font-medium text-black">
                {getLocalizedText(trait.title, locale)}
              </h3>
              <p className="text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-black">
                {getLocalizedText(trait.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

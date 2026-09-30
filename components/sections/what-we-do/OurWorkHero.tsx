"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurWorkHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export function OurWorkHero({
  data,
  locale,
}: {
  data: OurWorkHeroContent;
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
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
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
        <div className="col-span-4 md:col-span-8 lg:col-span-2">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-9 lg:col-start-4 lg:mt-0">
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h1>

          <div ref={bodyRef} className="mt-10 flex flex-col gap-6">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-impact-gray max-w-2xl text-[clamp(0.9375rem,1.15vw,1.0625rem)] leading-[1.7]"
              >
                {getLocalizedText(paragraph, locale)}
              </p>
            ))}

            <a
              href={data.cta.href}
              className="text-impact-blue group mt-2 inline-flex w-fit items-center gap-2 text-[clamp(0.9375rem,1.1vw,1rem)] font-medium"
            >
              {getLocalizedText(data.cta.label, locale)}
              <ArrowDownIcon
                weight="bold"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

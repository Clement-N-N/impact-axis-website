"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurApproachContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OurApproachSection({
  data,
  locale,
}: {
  data: OurApproachContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const stepItems = stepsRef.current
        ? gsap.utils.toArray<HTMLElement>(stepsRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        taglineRef.current,
        ...stepItems,
        closingRef.current,
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

          tl.to([eyebrowRef.current, taglineRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            // The three step cards are a repeated group, so they are staggered
            // as one sequence off this same trigger rather than each card
            // animating its own heading independently.
            .to(stepItems, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.1,
            })
            .to(
              closingRef.current,
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

        <div className="col-span-4 flex flex-col gap-2 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
          <p
            ref={taglineRef}
            className="text-impact-blue text-[clamp(0.9375rem,1.05vw,1rem)] font-medium"
          >
            {getLocalizedText(data.tagline, locale)}
          </p>
        </div>

        <h2
          ref={headlineRef}
          className="col-span-4 mt-6 text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.4] font-medium text-black md:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-0"
        >
          {getLocalizedText(data.headline, locale)}
        </h2>

        <div
          ref={stepsRef}
          className="gap-gutter col-span-4 mt-12 grid grid-cols-1 md:col-span-8 md:grid-cols-3 lg:col-span-12 lg:mt-16"
        >
          {data.steps.map((step) => (
            <article key={step.stepNumber} className="flex flex-col gap-5">
              <div className="mb-6 flex items-baseline gap-3 lg:mb-10">
                <span
                  className="text-border text-[clamp(1.5rem,2.2vw,2rem)] font-medium"
                  aria-hidden="true"
                >
                  {step.stepNumber}
                </span>
                <h3 className="text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium text-black">
                  {getLocalizedText(step.title, locale)}
                </h3>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={step.image.src}
                  alt={getLocalizedText(step.image.alt, locale)}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <p className="text-[clamp(1rem,1.15vw,1.125rem)] font-medium text-black">
                {getLocalizedText(step.subtitle, locale)}
              </p>
              <p className="text-impact-gray text-[clamp(0.875rem,1vw,0.9375rem)]">
                {getLocalizedText(step.description, locale)}
              </p>
            </article>
          ))}
        </div>

        <p
          ref={closingRef}
          className="col-span-4 mt-12 text-[clamp(1rem,1.4vw,1.25rem)] text-black md:col-span-8 lg:col-span-6 lg:col-start-5"
        >
          {getLocalizedText(data.closingLine, locale)}
        </p>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WhyPartnerContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function WhyPartnerSection({
  data,
  locale,
}: {
  data: WhyPartnerContent;
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
              bodyItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.1,
              },
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
    <section ref={sectionRef} className="pb-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div
          ref={bodyRef}
          className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0"
        >
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>

          {data.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-impact-gray mt-6 max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]"
            >
              {getLocalizedText(paragraph, locale)}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

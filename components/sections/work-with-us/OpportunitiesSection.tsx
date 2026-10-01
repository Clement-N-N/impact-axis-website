"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OpportunitiesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OpportunitiesSection({
  data,
  locale,
}: {
  data: OpportunitiesContent;
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
    <section ref={sectionRef} className="py-section bg-impact-blue w-full">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.25] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>

          <div ref={bodyRef} className="mt-8 flex flex-col gap-6">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7] text-white/70"
              >
                {getLocalizedText(paragraph, locale)}
              </p>
            ))}

            <div className="mt-2">
              <Button
                href={data.cta.href}
                variant="primary"
                icon={<ArrowRightIcon weight="bold" />}
              >
                {getLocalizedText(data.cta.label, locale)}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

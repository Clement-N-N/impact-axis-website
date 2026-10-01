"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { ImpactStatsContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Five figures, which divides badly into a grid. Two per row on a phone with
 * the last spanning the full width, three on a tablet, five across on desktop.
 */
export function ImpactStatsBand({
  data,
  locale,
}: {
  data: ImpactStatsContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const fadeTargets = [eyebrowRef.current, ...items].filter(Boolean);

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
              items,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.09,
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
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
        </div>

        <div
          ref={listRef}
          className="gap-gutter col-span-4 mt-12 grid grid-cols-2 md:col-span-8 md:grid-cols-3 lg:col-span-12 lg:mt-16 lg:grid-cols-5"
        >
          {data.stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-t border-white/20 pt-4 last:col-span-2 md:last:col-span-1 lg:pt-5"
            >
              <span className="text-impact-yellow text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none font-medium tabular-nums">
                {stat.value}
              </span>
              <span className="text-[clamp(0.8125rem,0.95vw,0.9375rem)] leading-[1.5] text-white/70">
                {getLocalizedText(stat.label, locale)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

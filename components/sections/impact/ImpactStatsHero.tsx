"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { ImpactHeroContent, ImpactStatsContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * The page opens on the evidence rather than describing it.
 *
 * About and Our Work both begin with the same white eyebrow/headline/paragraph
 * arrangement. Repeating it a third time made every page past the home page
 * read as one template, so this one states the figures immediately and does it
 * on navy. The statistics used to sit in a separate band further down; merging
 * them into the hero also removes a section rather than adding one.
 */
export function ImpactStatsHero({
  hero,
  stats,
  locale,
}: {
  hero: ImpactHeroContent;
  stats: ImpactStatsContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const bodyItems = bodyRef.current
        ? gsap.utils.toArray<HTMLElement>(bodyRef.current.children)
        : [];
      const statItems = statsRef.current
        ? gsap.utils.toArray<HTMLElement>(statsRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        ...bodyItems,
        ...statItems,
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
            )
            .to(
              statItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.08,
              },
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
    <section ref={sectionRef} className="pt-section bg-impact-blue w-full">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(hero.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-9 lg:col-start-4 lg:mt-0">
          <h1 className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.08] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(hero.headline, locale)}
            </span>
          </h1>

          <div ref={bodyRef} className="mt-8 flex flex-col gap-6">
            <p className="max-w-2xl text-[clamp(0.9375rem,1.15vw,1.0625rem)] leading-[1.7] text-white/70">
              {getLocalizedText(hero.paragraphs[0], locale)}
            </p>

            <div>
              <Button
                href={hero.cta.href}
                variant="white"
                icon={<ArrowDownIcon weight="bold" />}
              >
                {getLocalizedText(hero.cta.label, locale)}
              </Button>
            </div>
          </div>
        </div>

        {/* The figures close the hero rather than opening a section of their
            own. Two per row on a phone, the odd one spanning the full width. */}
        <div
          ref={statsRef}
          className="gap-gutter pb-section col-span-4 mt-16 grid grid-cols-2 md:col-span-8 md:grid-cols-3 lg:col-span-12 lg:mt-24 lg:grid-cols-5"
        >
          {stats.stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-t border-white/25 pt-4 last:col-span-2 md:last:col-span-1 lg:pt-5"
            >
              <span className="text-impact-yellow text-[clamp(1.875rem,3.6vw,3rem)] leading-none font-medium tabular-nums">
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

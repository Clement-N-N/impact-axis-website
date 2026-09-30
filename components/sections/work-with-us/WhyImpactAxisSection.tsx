"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { aboutPageContent } from "@/components/sections/about";
import type { ImpactStatEntry } from "@/sanity/home";
import type { Locale } from "@/i18n/routing";
import type { WhyImpactAxisContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Figures and the partner logos that back them.
 *
 * Both are borrowed rather than restated: the statistics come from the same
 * `homeImpact` singleton the home and Impact pages read, and the logos from
 * the About page's list, which mirrors the `partnerLogo` documents. Writing
 * either out again here would be a second place to update them.
 */
export function WhyImpactAxisSection({
  data,
  stats,
  locale,
}: {
  data: WhyImpactAxisContent;
  stats: ImpactStatEntry[];
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const statItems = statsRef.current
        ? gsap.utils.toArray<HTMLElement>(statsRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        introRef.current,
        ...statItems,
        logosRef.current,
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
              statItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.08,
              },
              "-=0.25",
            )
            .to(
              logosRef.current,
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

  const logos = aboutPageContent.partnership.logos;

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
            {getLocalizedText(data.paragraph, locale)}
          </p>
        </div>

        {stats.length > 0 ? (
          <div
            ref={statsRef}
            className="gap-gutter col-span-4 mt-12 grid grid-cols-2 md:col-span-8 md:grid-cols-3 lg:col-span-12 lg:mt-16 lg:grid-cols-5"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="border-border flex flex-col gap-2 border-t pt-4 last:col-span-2 md:last:col-span-1"
              >
                <span className="text-impact-blue text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none font-medium tabular-nums">
                  {stat.value}
                </span>
                <span className="text-impact-gray text-[clamp(0.8125rem,0.95vw,0.9375rem)] leading-[1.5]">
                  {getLocalizedText(stat.label, locale)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div
          ref={logosRef}
          className="col-span-4 mt-16 flex flex-col gap-8 md:col-span-8 lg:col-span-12 lg:mt-20"
        >
          <p className="text-impact-gray text-[clamp(0.875rem,1vw,0.9375rem)]">
            {getLocalizedText(data.logosCaption, locale)}
          </p>
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
            {logos.map((logo) => (
              <li key={logo.name} className="relative h-10 w-24 lg:h-12 lg:w-28">
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

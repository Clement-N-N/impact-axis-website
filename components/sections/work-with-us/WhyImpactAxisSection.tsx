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

        {/* The Impact page already sets these five out as an equal band.
            Here the first figure carries the claim at display size and the
            rest support it, so the same numbers do not arrive twice in the
            same shape. */}
        {stats.length > 0 ? (
          <div
            ref={statsRef}
            className="col-span-4 mt-14 md:col-span-8 lg:col-span-12 lg:mt-20"
          >
            <div className="gap-gutter grid grid-cols-1 lg:grid-cols-12">
              <div className="border-impact-blue flex flex-col gap-2 border-t-2 pt-5 lg:col-span-5">
                <span className="text-impact-blue text-[clamp(3.5rem,7vw,6rem)] leading-[0.9] font-medium tabular-nums">
                  {stats[0].value}
                </span>
                <span className="text-[clamp(0.9375rem,1.2vw,1.125rem)] leading-[1.4] text-black">
                  {getLocalizedText(stats[0].label, locale)}
                </span>
              </div>

              <ul className="gap-gutter grid grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-2 lg:self-end">
                {stats.slice(1).map((stat, index) => (
                  <li
                    key={index}
                    className="border-border flex flex-col gap-1 border-t pt-4"
                  >
                    <span className="text-[clamp(1.25rem,2vw,1.75rem)] leading-none font-medium tabular-nums text-black">
                      {stat.value}
                    </span>
                    <span className="text-impact-gray text-[clamp(0.75rem,0.9vw,0.875rem)] leading-[1.45]">
                      {getLocalizedText(stat.label, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div
          ref={logosRef}
          className="col-span-4 mt-16 md:col-span-8 lg:col-span-12 lg:mt-20"
        >
          <p className="text-impact-gray pb-8 text-[clamp(0.875rem,1vw,0.9375rem)] lg:pb-10">
            {getLocalizedText(data.logosCaption, locale)}
          </p>

          {/* Centred only below lg. The marks are fixed width, so on a narrow
              screen they pack from the left and leave the remainder empty, as
              though a column were missing. Desktop and tablet keep the
              left-aligned row they already had. */}
          <ul className="gap-gutter flex flex-wrap items-center justify-center lg:justify-start">
            {logos.map((logo) => (
              <li
                key={logo.name}
                className="border-border flex items-center justify-center border p-5"
              >
                <div className="relative h-10 w-24 lg:h-12 lg:w-28">
                  <Image
                    src={logo.logoUrl}
                    alt={logo.name}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

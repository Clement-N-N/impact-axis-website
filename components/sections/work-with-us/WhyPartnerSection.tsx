"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import {
  PARTNERSHIP_AUDIENCES,
  partnershipContent,
} from "@/components/sections/partnership";
import type { Locale } from "@/i18n/routing";
import type { WhyPartnerContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * The section says "Different partners. One shared outcome." — so it is drawn
 * that way rather than set as another headline over paragraphs.
 *
 * The four partner types stack on the left and converge, through curves, on a
 * single statement at the right. The curves are one inline SVG sized by the
 * grid, and they are decorative: the same four names are real text beside them,
 * so the meaning survives if the drawing never paints. Below `lg` the drawing
 * is dropped entirely and the list reads as a plain column, which is what a
 * narrow screen can actually show.
 */
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
  const listRef = useRef<HTMLUListElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const bodyItems = bodyRef.current
        ? gsap.utils.toArray<HTMLElement>(bodyRef.current.children)
        : [];
      const curves = pathsRef.current
        ? gsap.utils.toArray<SVGPathElement>(
            pathsRef.current.querySelectorAll("path"),
          )
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        ...items,
        ...bodyItems,
      ].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(curves, { opacity: 1, drawSVG: undefined });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });
          // Drawn by stroke offset rather than DrawSVG, which is a paid plugin.
          curves.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 1,
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
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
                duration: 0.45,
                ease: "power3.out",
                stagger: 0.09,
              },
              "-=0.3",
            )
            .to(
              curves,
              {
                strokeDashoffset: 0,
                duration: 0.9,
                ease: "power2.inOut",
                stagger: 0.08,
              },
              "-=0.25",
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
              "-=0.5",
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

  // Four starts down the left edge, all meeting one point on the right.
  const CURVES = [
    "M0 12 C 70 12, 110 50, 200 50",
    "M0 38 C 70 38, 120 50, 200 50",
    "M0 62 C 70 62, 120 50, 200 50",
    "M0 88 C 70 88, 110 50, 200 50",
  ];

  return (
    <section ref={sectionRef} className="pb-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
          <h2 className="mt-6 max-w-3xl text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.2] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
        </div>

        {/* many → */}
        <ul
          ref={listRef}
          className="col-span-4 mt-12 flex flex-col gap-4 md:col-span-8 lg:col-span-3 lg:mt-20 lg:justify-between lg:gap-0"
        >
          {PARTNERSHIP_AUDIENCES.map((slug) => (
            <li
              key={slug}
              className="border-border text-impact-gray border-l-2 pl-4 text-[clamp(0.875rem,1vw,0.9375rem)] lg:border-l-0 lg:border-none lg:pl-0"
            >
              {getLocalizedText(
                partnershipContent.audiences[slug].name,
                locale,
              )}
            </li>
          ))}
        </ul>

        {/* the convergence itself, wide screens only */}
        <div className="hidden lg:col-span-2 lg:mt-20 lg:flex lg:items-center">
          <svg
            ref={pathsRef}
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-[150px] w-full"
          >
            {CURVES.map((d, index) => (
              <path
                key={index}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-impact-yellow opacity-0"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>

        {/* → one */}
        <div
          ref={bodyRef}
          className="col-span-4 mt-10 flex flex-col gap-6 md:col-span-8 lg:col-span-7 lg:mt-20"
        >
          {data.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.5] text-black"
                  : "text-impact-gray text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]"
              }
            >
              {getLocalizedText(paragraph, locale)}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

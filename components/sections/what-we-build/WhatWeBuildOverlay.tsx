"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whatWeBuildContent } from "./data";
import type { WhatWeBuildOverlayContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function WhatWeBuildOverlay({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: WhatWeBuildOverlayContent;
}) {
  const overlay = propData ?? whatWeBuildContent.overlay;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Continuous scrub parallax on the background image — skipped entirely
      // under reduced motion rather than jumped to a static offset, since the
      // image already fully covers its frame at rest (no hidden/entrance state).
      if (!prefersReducedMotion) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }).to(
            self.lines,
            { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
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
    <section ref={sectionRef} className="relative w-full overflow-hidden h-[240px] lg:h-[400px]">
      <div ref={imageRef} className="absolute inset-x-0 -top-[15%] -bottom-[15%]">
        <Image src={overlay.backgroundImage} alt="" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 flex h-full w-full flex-col justify-center bg-overlay-dark/65">
        <div className="w-full border-t border-white/20" />
        <Container className="gap-gutter grid grid-cols-1 py-6 lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-2 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-white" />
          </div>

          <div className="h-full lg:col-span-4">
            <span ref={eyebrowRef} className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-white">
              {getLocalizedText(overlay.eyebrow, locale)}
            </span>
          </div>

          <div className="lg:col-span-6">
            <h2 ref={headlineRef} className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.2] text-white">
              {getLocalizedText(overlay.headline, locale)}
            </h2>
          </div>
        </Container>
      </div>
    </section>
  );
}

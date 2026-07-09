"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whatWeBuildContent } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WhatWeBuildOverlay({ locale }: { locale: Locale }) {
  const { overlay } = whatWeBuildContent;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden h-[400px]">
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
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-white">
              {getLocalizedText(overlay.eyebrow, locale)}
            </span>
          </div>

          <div className="lg:col-span-6">
            <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.2] text-white">
              {getLocalizedText(overlay.headline, locale)}
            </h2>
          </div>
        </Container>
      </div>
    </section>
  );
}

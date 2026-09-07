"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { AboutHeroContent } from "./types";

export function AboutHero({
  data,
  locale,
}: {
  data: AboutHeroContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [textRef.current, mediaRef.current];

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-var(--header-height))] w-full bg-impact-blue"
    >
      <div className="absolute inset-0 h-full w-full bg-overlay-dark/45" />

      <Container className="relative z-10 h-full grid grid-cols-1 gap-gutter py-12 lg:grid-cols-12 lg:min-h-[calc(100vh-var(--header-height))]">
        {/* Left Text Column — matches home hero typography & spacing */}
        <div
          ref={textRef}
          className="grid grid-cols-1 gap-gutter content-between lg:col-span-6 lg:h-full lg:grid-cols-6"
        >
          <h1 className="text-5xl !font-medium text-white w-[95%] lg:col-span-6">
            {getLocalizedText(data.headline, locale)}
          </h1>

          <p className="border-l-2 border-white/25 pl-3 text-base text-white lg:col-span-3 lg:col-start-3">
            {getLocalizedText(data.paragraph, locale)}
          </p>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-6">
            <Button
              href="#partner-section"
              variant="primary"
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            >
              {getLocalizedText(data.ctaPartner, locale)}
            </Button>
            <Button href="#why-we-exist" variant="outline-white">
              {getLocalizedText(data.ctaStory, locale)}
            </Button>
          </div>
        </div>

        {/* Right — Impact Axis Logo-shaped 5-bar masked image */}
        <div
          ref={mediaRef}
          className="relative flex items-center justify-center self-center lg:col-span-6 lg:h-full py-4"
        >
          {/* Subtle ambient glow behind the logo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#febb09]/15 via-blue-400/10 to-transparent blur-2xl pointer-events-none" />

          {/* SVG 5-bar Logo Mask Container */}
          <div className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-[816/1093] flex items-center justify-center">
            <svg
              viewBox="0 0 816 1093"
              className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.02]"
              aria-label="Impact Axis logo hero showcase"
            >
              <defs>
                <clipPath id="impactAxisLogoHeroClip">
                  {/* Bar 0 - Far Left */}
                  <path d="M 0 265 L 139 328 L 139 648 L 0 764 Z" />
                  {/* Bar 1 - Inner Left */}
                  <path d="M 169 220 L 308 135 L 308 958 L 169 873 Z" />
                  {/* Bar 2 - Center Axis (with top & bottom apex points) */}
                  <path d="M 338 100 L 408 0 L 478 100 L 478 992 L 408 1092 L 338 992 Z" />
                  {/* Bar 3 - Inner Right */}
                  <path d="M 508 135 L 647 220 L 647 873 L 508 958 Z" />
                  {/* Bar 4 - Far Right */}
                  <path d="M 677 328 L 816 265 L 816 764 L 677 648 Z" />
                </clipPath>
              </defs>

              {/* Seamless Hero Image masked directly inside the 5-bar logo */}
              <image
                href="/images/girls-1.jpg"
                x="0"
                y="0"
                width="816"
                height="1093"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#impactAxisLogoHeroClip)"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}

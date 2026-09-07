"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { PartnershipContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PartnershipSection({
  data,
  locale,
}: {
  data: PartnershipContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const bannersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const headerTargets = [eyebrowRef.current, headlineRef.current, subtitleRef.current].filter(Boolean);
      const otherTargets = [logosRef.current, bannersRef.current].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set([...headerTargets, ...otherTargets], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(headerTargets, { opacity: 0, y: 20 });
      gsap.to(headerTargets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.set(otherTargets, { opacity: 0, y: 25 });
      gsap.to(otherTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: logosRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Double list for smooth infinite mobile marquee loop
  const marqueeLogos = [...data.partnerLogos, ...data.partnerLogos];

  return (
    <section
      ref={sectionRef}
      id="partner-section"
      className="w-full bg-white py-16 text-black border-b border-border md:py-24 lg:py-28 overflow-hidden"
    >
      <Container>
        {/* NARRATIVE HEADER */}
        <div className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 mb-16 md:mb-20 items-start">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-black inline-block flex-shrink-0" />
              <span
                ref={eyebrowRef}
                className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black"
              >
                {getLocalizedText(data.eyebrow, locale)}
              </span>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-7">
            <h2
              ref={headlineRef}
              className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
            <p
              ref={subtitleRef}
              className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed"
            >
              {getLocalizedText(data.subtitle, locale)}
            </p>
          </div>
        </div>

        {/* LOGOS SHOWCASE: Full-bleed on Mobile, Clean Tiles on Desktop */}
        <div
          ref={logosRef}
          className="relative mb-20 md:mb-24 -mx-container sm:mx-0 border-y sm:border border-border bg-[#f4f6fa] py-4 sm:p-8 lg:p-10 shadow-xs overflow-hidden"
        >
          {/* MOBILE MARQUEE (< md) — Edge to edge full screen */}
          <div className="relative md:hidden w-full overflow-hidden">
            {/* Minimal edge fade gradients */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#f4f6fa] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#f4f6fa] to-transparent z-10" />

            <div className="animate-marquee flex items-center gap-3 py-1">
              {marqueeLogos.map((partner, idx) => {
                const isSquare = partner.name === "Canva for Nonprofits";

                return (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="relative h-20 w-36 flex-shrink-0 flex items-center justify-center border border-border/80 bg-white p-2.5 shadow-xs"
                    title={partner.name}
                  >
                    <div className="relative h-14 w-full flex items-center justify-center">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className={`object-contain ${isSquare ? "scale-125" : ""}`}
                        sizes="140px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP 5×2 OPTICALLY BALANCED TILES (>= md) */}
          <div className="hidden md:grid md:grid-cols-5 md:gap-4 lg:gap-5">
            {data.partnerLogos.map((partner) => {
              const isSquare = partner.name === "Canva for Nonprofits";

              return (
                <div
                  key={partner.name}
                  className="group relative flex h-24 lg:h-28 items-center justify-center border border-border/80 bg-white p-3 lg:p-4 shadow-xs transition-all duration-300 hover:border-[#101b62] hover:shadow-md"
                  title={partner.name}
                >
                  <div className="relative h-16 lg:h-18 w-full max-w-[155px] flex items-center justify-center">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      className={`object-contain transition-transform duration-300 group-hover:scale-105 ${
                        isSquare ? "scale-130 lg:scale-140" : ""
                      }`}
                      sizes="(max-width: 1024px) 20vw, 170px"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DUAL SPLIT ACTION BANNERS — Sharp Edges & High Contrast */}
        <div ref={bannersRef} className="grid grid-cols-1 md:grid-cols-2 shadow-xl border border-border">
          {/* Left Banner: Dark Navy Theme */}
          <div className="relative overflow-hidden bg-[#101b62] p-8 sm:p-12 text-white flex flex-col justify-between">
            <div className="relative z-10">
              <span className="mb-3 inline-block bg-[#febb09] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101b62]">
                {locale === "fr" ? "Organisations" : "Organizations"}
              </span>
              <h3 className="mb-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {getLocalizedText(data.leftBanner.headline, locale)}
              </h3>
              <p className="mb-8 text-base text-white/85 sm:text-lg leading-relaxed">
                {getLocalizedText(data.leftBanner.paragraph, locale)}
              </p>
            </div>

            <div className="relative z-10">
              <a
                href={`mailto:${data.rightBanner.email}`}
                className="inline-flex items-center gap-2 bg-white px-8 py-4 text-base font-bold text-[#101b62] transition-all hover:bg-[#febb09] shadow-md"
              >
                {getLocalizedText(data.leftBanner.ctaLabel, locale)}
              </a>
            </div>
          </div>

          {/* Right Banner: Warm Gold / Amber Accent Theme */}
          <div className="relative overflow-hidden bg-[#febb09] p-8 sm:p-12 text-[#101b62] flex flex-col justify-between">
            <div className="relative z-10">
              <span className="mb-3 inline-block bg-[#101b62] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {locale === "fr" ? "Mentors & Experts" : "Mentors & Experts"}
              </span>
              <h3 className="mb-4 text-2xl font-medium tracking-tight text-[#101b62] sm:text-3xl">
                {getLocalizedText(data.rightBanner.headline, locale)}
              </h3>
              <p className="mb-8 text-base text-[#101b62]/90 sm:text-lg leading-relaxed font-normal">
                {getLocalizedText(data.rightBanner.paragraph, locale)}
              </p>
            </div>

            <div className="relative z-10">
              <a
                href={`mailto:${data.rightBanner.email}`}
                className="inline-flex items-center gap-2 bg-[#101b62] px-8 py-4 text-base font-bold text-white transition-all hover:bg-black shadow-md"
              >
                <EnvelopeIcon weight="bold" className="h-5 w-5" />
                <span>{getLocalizedText(data.rightBanner.ctaLabel, locale)}</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

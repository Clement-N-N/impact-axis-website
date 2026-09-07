"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { JourneyCtaContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function JourneyCta({
  data,
  locale,
}: {
  data: JourneyCtaContent;
  locale: Locale;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cardRef.current, { opacity: 0, y: 30 });
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#f8f9fc] py-16 md:py-24 border-t border-border overflow-hidden"
    >
      <Container>
        {/* Full-width Floating CTA Card */}
        <div
          ref={cardRef}
          className="relative w-full overflow-hidden bg-[#101b62] p-8 sm:p-12 md:p-16 text-white border border-[#1b2a59] shadow-2xl"
        >
          {/* Subtle architectural background grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Ambient gradient glow */}
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-80 w-80 rounded-none bg-[#febb09]/15 blur-3xl" />
          <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 rounded-none bg-blue-400/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center">
            {/* Tag badge */}
            <div className="mb-6 inline-flex items-center border border-[#febb09]/40 bg-[#febb09]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#febb09]">
              {getLocalizedText(data.tag, locale)}
            </div>

            {/* Headline */}
            <h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-medium leading-[1.15] tracking-tight text-white mb-6">
              {getLocalizedText(data.headline, locale)}
            </h2>

            {/* Paragraph */}
            <p className="text-[clamp(1rem,1.25vw,1.15rem)] font-normal leading-relaxed text-white/80 max-w-2xl mb-10">
              {getLocalizedText(data.paragraph, locale)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/partner"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#febb09] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#101b62] transition-colors duration-200 hover:bg-[#e0a500] shadow-sm"
              >
                {getLocalizedText(data.ctaPartner, locale)}
              </Link>

              <Link
                href="/impact"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-white/15"
              >
                {getLocalizedText(data.ctaReports, locale)}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

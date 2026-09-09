"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FlagIcon, EyeIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { MissionVisionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MissionVisionSection({
  data,
  locale,
}: {
  data: MissionVisionContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const children = cardsRef.current ? Array.from(cardsRef.current.children) : [];

      if (prefersReducedMotion) {
        gsap.set(children, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(children, { opacity: 0, y: 30, scale: 0.98 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 text-black border-b border-border md:py-24 lg:py-28"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-[#febb09] inline-block flex-shrink-0" />
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
              {locale === "fr" ? "Notre Boussole Stratégique" : "Our Strategic Compass"}
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black">
            {locale === "fr"
              ? "Guider chaque action, chaque programme et chaque partenariat."
              : "Guiding every initiative, program, and partnership."}
          </h2>
        </div>

        {/* Dual High-Impact Architectural Cards with Interactive Hover Effects */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Mission Pillar — Dark Signature Navy with Rich Interactive Hover */}
          <div className="group relative overflow-hidden bg-[#101b62] p-8 sm:p-12 text-white border-2 border-[#101b62] shadow-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#febb09]/80 cursor-default">
            {/* Interactive Watermark Number */}
            <div className="pointer-events-none absolute right-4 top-2 text-[6.5rem] sm:text-[8rem] font-extrabold tracking-tighter text-white/[0.04] select-none leading-none transition-all duration-500 group-hover:text-white/[0.09] group-hover:scale-105">
              01
            </div>

            {/* Subtle interactive background glow on hover */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[#febb09]/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4">
                <span className="inline-block bg-[#febb09] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#101b62] shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {locale === "fr" ? "Notre Mission" : "Our Mission"}
                </span>
                <div className="flex h-11 w-11 items-center justify-center bg-white/10 text-[#febb09] transition-all duration-300 group-hover:bg-[#febb09] group-hover:text-[#101b62] group-hover:rotate-6 shadow-sm">
                  <FlagIcon weight="bold" className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mb-4 text-2xl sm:text-3xl font-medium leading-snug text-white transition-colors duration-300 group-hover:text-white">
                {getLocalizedText(data.missionTitle, locale)}
              </h3>

              <p className="text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed text-white/85">
                {getLocalizedText(data.missionBody, locale)}
              </p>
            </div>

            {/* Bottom Accent Bar — Expands on Hover */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
              <span className="h-1.5 w-12 bg-[#febb09] transition-all duration-500 group-hover:w-24" />
              <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">
                {locale === "fr" ? "Action & Transition" : "Action & Transition"}
              </span>
            </div>
          </div>

          {/* Vision Pillar — Rich Structured Card with Rich Interactive Hover */}
          <div className="group relative overflow-hidden bg-[#f8f9fc] p-8 sm:p-12 text-black border-2 border-[#101b62]/20 shadow-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#101b62] cursor-default">
            {/* Interactive Watermark Number */}
            <div className="pointer-events-none absolute right-4 top-2 text-[6.5rem] sm:text-[8rem] font-extrabold tracking-tighter text-[#101b62]/[0.05] select-none leading-none transition-all duration-500 group-hover:text-[#101b62]/[0.10] group-hover:scale-105">
              02
            </div>

            {/* Subtle interactive background glow on hover */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[#101b62]/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
                <span className="inline-block bg-[#101b62] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {locale === "fr" ? "Notre Vision" : "Our Vision"}
                </span>
                <div className="flex h-11 w-11 items-center justify-center bg-[#101b62] text-[#febb09] transition-all duration-300 group-hover:bg-[#febb09] group-hover:text-[#101b62] group-hover:rotate-6 shadow-sm">
                  <EyeIcon weight="bold" className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mb-4 text-2xl sm:text-3xl font-medium leading-snug text-black">
                {getLocalizedText(data.visionTitle, locale)}
              </h3>

              <p className="text-[clamp(1rem,1.25vw,1.125rem)] leading-relaxed text-black/85">
                {getLocalizedText(data.visionBody, locale)}
              </p>
            </div>

            {/* Bottom Accent Bar — Expands on Hover */}
            <div className="mt-8 pt-6 border-t border-black/10 flex items-center gap-3">
              <span className="h-1.5 w-12 bg-[#101b62] transition-all duration-500 group-hover:w-24" />
              <span className="text-xs uppercase tracking-widest text-black/60 font-semibold">
                {locale === "fr" ? "Horizon & Dignité" : "Long-term Horizon"}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

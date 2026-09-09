"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpenIcon, WrenchIcon, TreeStructureIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurApproachContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEP_ICONS = [BookOpenIcon, WrenchIcon, TreeStructureIcon];

export function OurApproachSection({
  data,
  locale,
}: {
  data: OurApproachContent;
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

      gsap.set(children, { opacity: 0, y: 24 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
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
      className="w-full bg-[#fcfcfd] py-16 text-black border-b border-border md:py-24 lg:py-28"
    >
      <Container>
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-black inline-block flex-shrink-0" />
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black mb-4">
            {getLocalizedText(data.headline, locale)}
          </h2>

          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-black/75 leading-relaxed">
            {getLocalizedText(data.subtitle, locale)}
          </p>
        </div>

        {/* 3 Step Action Pillars Grid — Sharp Edges & Architectural Polish */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {data.steps.map((step, index) => {
            const IconComponent = STEP_ICONS[index % STEP_ICONS.length];
            const borderColors = ["border-t-[#101b62]", "border-t-[#febb09]", "border-t-[#101b62]"];
            const iconBgColors = ["bg-[#101b62] text-white", "bg-[#febb09] text-[#101b62]", "bg-[#101b62] text-[#febb09]"];
            
            return (
              <div
                key={step.stepNumber}
                className={`group flex flex-col justify-between border border-border border-t-4 ${borderColors[index]} bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-border`}
              >
                <div>
                  <div className="mb-8 flex items-center justify-between border-b border-border/80 pb-5">
                    {/* Architectural step number */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">
                        / 03
                      </span>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center ${iconBgColors[index]} shadow-sm`}>
                      <IconComponent weight="bold" className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="mb-1.5 text-xl sm:text-2xl font-medium text-black">
                    {getLocalizedText(step.title, locale)}
                  </h3>
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#101b62]">
                    {getLocalizedText(step.subtitle, locale)}
                  </h4>
                  <p className="text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-black/85 font-normal">
                    {getLocalizedText(step.description, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Architectural Banner */}
        <div className="mt-12 border-l-4 border-[#101b62] border border-border bg-white p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-base sm:text-lg font-medium text-black leading-snug">
            {getLocalizedText(data.summaryBanner, locale)}
          </p>
          <span className="inline-block flex-shrink-0 bg-[#febb09] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#101b62]">
            {locale === "fr" ? "Méthode Intégrée" : "Integrated System"}
          </span>
        </div>
      </Container>
    </section>
  );
}

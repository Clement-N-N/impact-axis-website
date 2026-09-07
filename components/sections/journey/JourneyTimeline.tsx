"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { Milestone } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function JourneyTimeline({
  milestones,
  locale,
}: {
  milestones: Milestone[];
  locale: Locale;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        if (prefersReducedMotion) {
          gsap.set(item, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(item, { opacity: 0, y: 30 });
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#f8f9fc] py-20 lg:py-28 overflow-hidden">
      <Container>
        <div className="relative">
          {/* DESKTOP CENTRAL VERTICAL SPINE */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-12 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#febb09] via-[#101b62] to-[#febb09] z-0 pointer-events-none" />

          {/* MOBILE LEFT-ALIGNED VERTICAL SPINE */}
          <div className="md:hidden absolute left-6 top-6 bottom-8 w-0.5 bg-gradient-to-b from-[#febb09] via-[#101b62] to-[#febb09] z-0 pointer-events-none" />

          {/* MILESTONE ENTRIES */}
          <div className="space-y-16 sm:space-y-24 relative z-10">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0; // 0, 2, 4 -> Left card on desktop; 1, 3, 5 -> Right card on desktop
              const isLatest = index === milestones.length - 1; // Dynamic latest entry detection

              return (
                <div
                  key={item.year}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className="relative flex flex-col md:flex-row items-start md:items-center"
                >
                  {/* LEFT COLUMN (Content if even, Year Label if odd) */}
                  <div
                    className={`w-full md:w-1/2 pl-14 md:pl-0 ${
                      isEven
                        ? "md:pr-14 md:text-right order-2 md:order-1"
                        : "hidden md:flex md:pr-14 md:justify-end items-center order-1"
                    }`}
                  >
                    {isEven ? (
                      /* Card Content */
                      <div
                        className={`w-full border bg-white p-7 sm:p-9 shadow-xs transition-all duration-300 hover:shadow-md ${
                          isLatest
                            ? "border-2 border-[#febb09] shadow-sm"
                            : "border-border hover:border-[#101b62]"
                        }`}
                      >
                        {/* Header Badges */}
                        <div className="flex md:justify-end items-center gap-2.5 mb-3.5 flex-wrap">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                              isLatest
                                ? "bg-[#febb09] text-[#101b62]"
                                : "bg-[#101b62]/10 text-[#101b62]"
                            }`}
                          >
                            {getLocalizedText(item.badge, locale)}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                            {getLocalizedText(item.phase, locale)}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black mb-3">
                          {getLocalizedText(item.title, locale)}
                        </h2>

                        {/* Description */}
                        <p className="text-sm sm:text-base leading-relaxed text-impact-gray mb-6">
                          {getLocalizedText(item.description, locale)}
                        </p>

                        {/* Partner / Milestone Tags */}
                        <div className="pt-4 border-t border-border/70 flex flex-wrap md:justify-end gap-2 text-xs font-semibold text-[#101b62]">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#fafbfc] border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Left Year Label (for odd entries on desktop) */
                      <div className="text-right">
                        <span className="text-7xl lg:text-8xl font-bold text-black/15 tracking-tight select-none">
                          {item.year}
                        </span>
                        <p className="text-sm font-bold text-[#101b62] uppercase tracking-wider mt-1">
                          {getLocalizedText(item.yearSubtitle, locale)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CENTRAL NODE MARKER */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-auto flex items-center justify-center z-20">
                    <div
                      className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border-2 text-xs font-bold uppercase tracking-tight shadow-md transition-transform duration-300 hover:scale-110 ${
                        isLatest
                          ? "bg-[#febb09] border-[#101b62] text-[#101b62]"
                          : "bg-[#101b62] border-[#febb09] text-[#febb09]"
                      }`}
                    >
                      <span>{item.shortYear}</span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (Year Label if even, Content if odd) */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven
                        ? "hidden md:flex md:pl-14 items-center order-2"
                        : "pl-14 md:pl-14 order-2 md:order-2"
                    }`}
                  >
                    {isEven ? (
                      /* Right Year Label (for even entries on desktop) */
                      <div className="text-left">
                        <span
                          className={`text-7xl lg:text-8xl font-bold tracking-tight select-none ${
                            isLatest ? "text-[#febb09]/40" : "text-black/15"
                          }`}
                        >
                          {item.year}
                        </span>
                        <p className="text-sm font-bold text-[#101b62] uppercase tracking-wider mt-1">
                          {getLocalizedText(item.yearSubtitle, locale)}
                        </p>
                      </div>
                    ) : (
                      /* Card Content */
                      <div
                        className={`w-full border bg-white p-7 sm:p-9 shadow-xs transition-all duration-300 hover:shadow-md ${
                          isLatest
                            ? "border-2 border-[#febb09] shadow-sm"
                            : "border-border hover:border-[#101b62]"
                        }`}
                      >
                        {/* Header Badges */}
                        <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                              isLatest
                                ? "bg-[#febb09] text-[#101b62]"
                                : "bg-[#101b62]/10 text-[#101b62]"
                            }`}
                          >
                            {getLocalizedText(item.badge, locale)}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                            {getLocalizedText(item.phase, locale)}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black mb-3">
                          {getLocalizedText(item.title, locale)}
                        </h2>

                        {/* Description */}
                        <p className="text-sm sm:text-base leading-relaxed text-impact-gray mb-6">
                          {getLocalizedText(item.description, locale)}
                        </p>

                        {/* Partner / Milestone Tags */}
                        <div className="pt-4 border-t border-border/70 flex flex-wrap gap-2 text-xs font-semibold text-[#101b62]">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#fafbfc] border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

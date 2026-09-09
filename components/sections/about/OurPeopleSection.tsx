"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurPeopleContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OurPeopleSection({
  data,
  locale,
}: {
  data: OurPeopleContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [activeBio, setActiveBio] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const introTargets = [eyebrowRef.current, headlineRef.current, subtitleRef.current].filter(Boolean);
      const coreChildren = coreRef.current ? Array.from(coreRef.current.children) : [];
      const boardChildren = boardRef.current ? Array.from(boardRef.current.children) : [];

      if (prefersReducedMotion) {
        gsap.set([...introTargets, ...coreChildren, ...boardChildren], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(introTargets, { opacity: 0, y: 20 });
      gsap.to(introTargets, {
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

      gsap.set(coreChildren, { opacity: 0, y: 20 });
      gsap.to(coreChildren, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: coreRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.set(boardChildren, { opacity: 0, y: 20 });
      gsap.to(boardChildren, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: boardRef.current,
          start: "top 80%",
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

        {/* CORE TEAM SECTION: 4-Column Grid Below Narrative */}
        <div className="mb-16 md:mb-20">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
              {getLocalizedText(data.coreTeamHeader, locale)}
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-black/60">
              {getLocalizedText(data.coreTeamSubheader, locale)}
            </span>
          </div>

          <div ref={coreRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.coreTeam.map((member) => {
              const isBioActive = activeBio === member.name;

              return (
                <div
                  key={member.name}
                  onClick={() => setActiveBio(isBioActive ? null : member.name)}
                  className="group relative overflow-hidden border border-border shadow-xs cursor-pointer select-none transition-all duration-300 hover:shadow-md hover:border-[#101b62]"
                >
                  {/* Portrait photo — portrait aspect ratio */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#101b62]/10">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#101b62] text-[#febb09]">
                        <span className="text-2xl font-bold tracking-wider">{member.initials}</span>
                      </div>
                    )}

                    {/* Bio overlay — slides up on hover (desktop) or tap/active (mobile/touch) */}
                    <div
                      className={`absolute inset-0 flex flex-col justify-end transition-transform duration-300 ease-out bg-[#101b62]/90 p-4 ${
                        isBioActive
                          ? "translate-y-0"
                          : "translate-y-full group-hover:translate-y-0"
                      }`}
                    >
                      {isBioActive && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBio(null);
                          }}
                          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-none bg-white/10 text-white hover:bg-white/20 text-xs transition-colors"
                          aria-label="Close bio"
                        >
                          ✕
                        </button>
                      )}
                      <p className="text-xs text-white/90 leading-relaxed">
                        {getLocalizedText(member.bio, locale)}
                      </p>
                    </div>
                  </div>

                  {/* Info bar */}
                  <div className="bg-white border-t-2 border-t-[#febb09] px-4 py-3">
                    <h4 className="text-base font-medium text-black leading-tight">{member.name}</h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="inline-block bg-[#101b62]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#101b62]">
                        {getLocalizedText(member.role, locale)}
                      </span>
                      <span className="text-[11px] font-medium text-black/40 hover:text-[#101b62] sm:hidden">
                        {isBioActive
                          ? (locale === "fr" ? "Fermer" : "Close")
                          : (locale === "fr" ? "Bio" : "Bio")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ADVISORY BOARD SECTION: 2-Column Grid Below Core Team */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
              {getLocalizedText(data.advisoryBoardHeader, locale)}
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-black/60">
              {getLocalizedText(data.advisoryBoardSubheader, locale)}
            </span>
          </div>

          <div ref={boardRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.advisoryBoard.map((member) => (
              <div
                key={member.name}
                className="group border border-border border-l-4 border-l-[#101b62] bg-[#fafbfc] p-6 sm:p-7 shadow-xs transition-all duration-300 hover:bg-white hover:shadow-md hover:border-border hover:border-l-[#febb09] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden border border-border bg-[#101b62]/10 shadow-xs">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#101b62] text-[#febb09] text-sm font-bold">
                          {member.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-black">{member.name}</h4>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#101b62]">
                        {locale === "fr" ? "Conseiller Stratégique" : "Strategic Advisor"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[13px] sm:text-sm leading-relaxed text-black/85 font-normal">
                    {getLocalizedText(member.bio, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

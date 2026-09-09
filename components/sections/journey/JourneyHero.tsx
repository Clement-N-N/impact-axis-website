"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeftIcon, SparkleIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { JourneyHeroContent } from "./types";

export function JourneyHero({
  data,
  locale,
}: {
  data: JourneyHeroContent;
  locale: Locale;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [
        badgeRef.current,
        headlineRef.current,
        subtitleRef.current,
        backRef.current,
      ].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 20 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-[#101b62] py-20 text-white md:py-28 overflow-hidden border-b border-[#1b2a59]"
    >
      {/* Prominent architectural grid background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-none bg-[#febb09]/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-none bg-blue-500/15 blur-3xl" />

      <Container className="relative z-10 text-center">
        <div className="mx-auto max-w-4xl flex flex-col items-center">
          {/* Eyebrow badge matching website design standard */}
          <div
            ref={badgeRef}
            className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white"
          >
            <SparkleIcon weight="fill" className="h-3.5 w-3.5 text-[#febb09]" />
            <span className="text-[#febb09]">{getLocalizedText(data.badge, locale)}</span>
          </div>

          <h1
            ref={headlineRef}
            className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-medium leading-[1.12] tracking-tight text-white mb-6"
          >
            {getLocalizedText(data.headline, locale)}
          </h1>

          <p
            ref={subtitleRef}
            className="text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-relaxed text-white/80 max-w-2xl mx-auto mb-8"
          >
            {getLocalizedText(data.subtitle, locale)}
          </p>

          <div ref={backRef}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#febb09] hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              <ArrowLeftIcon weight="bold" className="h-4 w-4" />
              <span>{getLocalizedText(data.backLink, locale)}</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

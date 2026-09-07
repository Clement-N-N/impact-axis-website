"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WhyWeExistAboutContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WhyWeExistAbout({
  data,
  locale,
}: {
  data: WhyWeExistAboutContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [textRef.current, imageRef.current];

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 30 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.18,
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
      id="why-we-exist"
      className="w-full bg-white py-16 text-black border-b border-border md:py-24 lg:py-28"
    >
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12 items-center">
        {/* Text Column */}
        <div ref={textRef} className="col-span-4 lg:col-span-6 order-2 lg:order-1">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-black inline-block flex-shrink-0" />
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black mb-8">
            {getLocalizedText(data.headline, locale)}
          </h2>

          <div className="space-y-6 text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray leading-relaxed">
            <p>{getLocalizedText(data.paragraph1, locale)}</p>
            <p>{getLocalizedText(data.paragraph2, locale)}</p>

            <div className="border-l-4 border-[#febb09] bg-[#f8f9fc] p-6 text-[clamp(1rem,1.25vw,1.125rem)] font-medium text-black leading-snug">
              {getLocalizedText(data.callout, locale)}
            </div>
          </div>
        </div>

        {/* Visual Documentary Photo Column — Sharp Edges & High-Res Photo */}
        <div ref={imageRef} className="col-span-4 lg:col-span-6 order-1 lg:order-2 mb-8 lg:mb-0">
          <div className="relative">
            <div className="relative h-[440px] md:h-[500px] w-full overflow-hidden border border-border shadow-xl">
              <Image
                src="/images/alumni-1.jpg"
                alt="Impact Axis youth fellows in Cameroon"
                fill
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b62]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 border border-white/20 bg-[#101b62]/90 p-4 backdrop-blur-md text-white text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#febb09]">
                  {getLocalizedText(data.imageCaptionHeader, locale)}
                </span>
                <p className="text-white/90">
                  {getLocalizedText(data.imageCaptionBody, locale)}
                </p>
              </div>
            </div>
            {/* Sharp decorative gold accent outline */}
            <div className="absolute -bottom-3 -right-3 hidden h-full w-full border-2 border-[#febb09]/30 -z-10 sm:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}

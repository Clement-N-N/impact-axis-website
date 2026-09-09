"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurStoryContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OurStorySection({
  data,
  locale,
}: {
  data: OurStoryContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [imageRef.current, textRef.current];

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
      className="w-full bg-white py-16 text-black border-b border-border md:py-24 lg:py-28"
    >
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12 items-center">
        {/* Photo Column — Sharp Edges & High-Res Team Photo */}
        <div ref={imageRef} className="col-span-4 lg:col-span-5 mb-8 lg:mb-0">
          <div className="relative overflow-hidden border border-border shadow-xl">
            <div className="relative h-[480px] sm:h-[520px] w-full">
              <Image
                src="/images/team-1.jpg"
                alt="Impact Axis mentorship gathering in Cameroon"
                fill
                quality={90}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b62]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="mb-2 inline-block bg-[#febb09] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101a3a]">
                  {getLocalizedText(data.photoBadgeTag, locale)}
                </span>
                <p className="text-sm font-medium text-white">
                  {getLocalizedText(data.photoBadgeCaption, locale)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Column */}
        <div ref={textRef} className="col-span-4 lg:col-span-7">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-black inline-block flex-shrink-0" />
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black mb-8">
            {getLocalizedText(data.headline, locale)}
          </h2>

          <div className="mb-10 space-y-6 text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray leading-relaxed">
            <p>{getLocalizedText(data.paragraph1, locale)}</p>
            <p>{getLocalizedText(data.paragraph2, locale)}</p>
            <p>{getLocalizedText(data.paragraph3, locale)}</p>
            <p>{getLocalizedText(data.paragraph4, locale)}</p>
          </div>

          <div>
            <Link
              href="/about/journey"
              className="group inline-flex items-center gap-4 border-2 border-[#101b62]/15 bg-gray-50 p-4 sm:px-6 transition-all duration-300 hover:border-[#101b62] hover:bg-[#101b62]/5 shadow-sm cursor-pointer"
            >
              <span className="bg-[#101b62] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {getLocalizedText(data.timelineBadge, locale)}
              </span>
              <span className="text-sm font-bold text-[#101b62] group-hover:underline">
                {getLocalizedText(data.timelineText, locale)}
              </span>
              <ArrowRightIcon weight="bold" className="h-4 w-4 text-[#101b62] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

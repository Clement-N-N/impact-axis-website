"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurPrinciplesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OurPrinciplesSection({
  data,
  locale,
}: {
  data: OurPrinciplesContent;
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
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
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
        <div className="mb-16 max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-black inline-block flex-shrink-0" />
            <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black">
            {getLocalizedText(data.headline, locale)}
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {data.principles.map((item, index) => (
            <div
              key={getLocalizedText(item.title, locale)}
              className="border border-border border-l-4 border-l-[#101b62] bg-[#f8f9fc] p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border"
            >
              <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#101b62]">
                  {`0${index + 1} / PRINCIPLE`}
                </span>
                <span className="h-2 w-2 bg-[#febb09] inline-block" />
              </div>

              <h3 className="mb-4 text-xl sm:text-2xl font-medium text-black">
                {getLocalizedText(item.title, locale)}
              </h3>
              <p className="text-[clamp(0.9375rem,1.1vw,1rem)] leading-relaxed text-black/85 font-normal">
                {getLocalizedText(item.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

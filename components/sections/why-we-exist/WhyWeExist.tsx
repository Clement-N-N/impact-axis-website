"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whyWeExistContent } from "./data";
import type { WhyWeExistContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function WhyWeExist({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: WhyWeExistContent;
}) {
  const data = propData ?? whyWeExistContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Each paragraph reveals individually (staggered), not as one block.
      const paragraphItems = paragraphsRef.current
        ? gsap.utils.toArray<HTMLElement>(paragraphsRef.current.children)
        : [];

      if (!headlineRef.current) return;

      // Lines are revealed one after another (masked slide-up), matching the
      // Lenis/darkroom.engineering title treatment. `mask: "lines"` wraps
      // each line in its own overflow-hidden container automatically, and
      // SplitText preserves the full headline for screen readers via an
      // aria-label on the original element while the per-line spans are
      // aria-hidden.
      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
            gsap.set(paragraphItems, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
          gsap.set(paragraphItems, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(paragraphItems, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.18,
            });

          // Returning the timeline lets SplitText kill/redo it cleanly if
          // autoSplit re-runs on a breakpoint change.
          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 h-full md:col-span-8 lg:col-span-4">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-6">
          <h2
            ref={headlineRef}
            className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black"
          >
            {getLocalizedText(data.headline, locale)}
          </h2>
          <div ref={paragraphsRef} className="flex flex-col gap-6">
            <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
              {getLocalizedText(data.paragraphs[0], locale)}
            </p>
            <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
              {getLocalizedText(data.paragraphs[1], locale)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

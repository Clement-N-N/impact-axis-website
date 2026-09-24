"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { MissionVisionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function MissionVisionSection({
  data,
  locale,
}: {
  data: MissionVisionContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const missionRef = useRef<HTMLHeadingElement>(null);
  const visionRef = useRef<HTMLHeadingElement>(null);
  const bodiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const bodies = bodiesRef.current
        ? gsap.utils.toArray<HTMLElement>(
            bodiesRef.current.querySelectorAll("[data-fade]"),
          )
        : [];
      const fadeTargets = [eyebrowRef.current, ...bodies].filter(Boolean);
      const headings = [missionRef.current, visionRef.current].filter(
        (el): el is HTMLHeadingElement => Boolean(el),
      );
      if (headings.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(fadeTargets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(fadeTargets, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // Both column titles are headings, so both take the house masked
      // line-stagger rather than riding along in the fade.
      headings.forEach((heading, index) => {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 100 });
        tl.to(
          split.lines,
          { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
          index === 0 ? "-=0.3" : "-=0.5",
        );
      });

      tl.to(
        bodies,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.18,
        },
        "-=0.3",
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div
          ref={bodiesRef}
          className="gap-gutter col-span-4 mt-6 grid grid-cols-1 md:col-span-8 md:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:mt-0"
        >
          <div className="border-border flex flex-col gap-4 border-t pt-6">
            <h2
              ref={missionRef}
              className="text-[clamp(1.125rem,1.4vw,1.375rem)] font-medium text-black"
            >
              {getLocalizedText(data.missionTitle, locale)}
            </h2>
            <p
              data-fade
              className="text-impact-gray text-[clamp(0.9375rem,1.05vw,1rem)]"
            >
              {getLocalizedText(data.missionBody, locale)}
            </p>
          </div>

          <div className="border-border flex flex-col gap-4 border-t pt-6">
            <h2
              ref={visionRef}
              className="text-[clamp(1.125rem,1.4vw,1.375rem)] font-medium text-black"
            >
              {getLocalizedText(data.visionTitle, locale)}
            </h2>
            <p
              data-fade
              className="text-impact-gray text-[clamp(0.9375rem,1.05vw,1rem)]"
            >
              {getLocalizedText(data.visionBody, locale)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

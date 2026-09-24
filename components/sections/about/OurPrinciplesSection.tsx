"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurPrinciplesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OurPrinciplesSection({
  data,
  locale,
}: {
  data: OurPrinciplesContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        ...items,
        imageRef.current,
      ].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

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
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              imageRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.3",
            )
            .to(
              items,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.35",
            );

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
    <section ref={sectionRef} className="py-section bg-impact-blue w-full">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-white" aria-hidden="true" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-2">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-8 flex flex-col gap-10 md:col-span-8 lg:col-span-5 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>

          <div ref={listRef} className="flex flex-col">
            {data.principles.map((principle, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-t border-white/20 py-6"
              >
                <h3 className="text-[clamp(1rem,1.2vw,1.125rem)] font-medium text-white">
                  {getLocalizedText(principle.title, locale)}
                </h3>
                <p className="text-[clamp(0.875rem,1vw,0.9375rem)] text-white/70">
                  {getLocalizedText(principle.description, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={imageRef}
          className="relative col-span-4 mt-10 aspect-[4/3] w-full overflow-hidden md:col-span-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:aspect-auto lg:h-full"
        >
          <Image
            src={data.image.src}
            alt={getLocalizedText(data.image.alt, locale)}
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}

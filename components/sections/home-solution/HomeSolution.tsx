"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { homeSolutionContent } from "./data";
import type { HomeSolutionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function HomeSolution({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: HomeSolutionContent;
}) {
  const data = propData ?? homeSolutionContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Note: Button is deliberately excluded from these targets (section-animations skill).
      // Each paragraph reveals individually (staggered), not as one block.
      const paragraphItems = paragraphsRef.current
        ? gsap.utils.toArray<HTMLElement>(paragraphsRef.current.children)
        : [];
      const imageTarget = imageRef.current ? [imageRef.current] : [];

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
            gsap.set(paragraphItems, { opacity: 1, y: 0 });
            gsap.set(imageTarget, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
          gsap.set(paragraphItems, { opacity: 0, y: 20 });
          gsap.set(imageTarget, { opacity: 0, y: 20 });
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
            })
            .to(
              imageTarget,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.3",
            );

          // Returning the timeline lets SplitText kill/redo it cleanly if
          // autoSplit re-runs on a breakpoint change.
          return tl;
        },
      });

      if (!prefersReducedMotion) {
        gsap.fromTo(
          imageParallaxRef.current,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <div className="hidden h-full lg:col-span-1 lg:row-start-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-2 lg:row-start-1">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-9 lg:col-start-4 lg:row-start-1 mb-20">
          <h2
            ref={headlineRef}
            className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.3] text-black lg:text-[48px]"
          >
            {getLocalizedText(data.headline, locale)}
          </h2>
          <Button
            href={data.button.href}
            variant="primary-flush"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.button.label, locale)}
          </Button>
        </div>

        <div ref={paragraphsRef} className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-4 lg:col-start-4 lg:row-start-2">
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[0], locale)}
          </p>
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[1], locale)}
          </p>
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[2], locale)}
          </p>
        </div>

        <div
          ref={imageRef}
          className="relative col-span-4 aspect-[4/5] overflow-hidden md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-2"
        >
          <div ref={imageParallaxRef} className="absolute inset-x-0 -top-[15%] -bottom-[15%]">
            <Image
              src={data.image}
              alt={getLocalizedText(data.imageAlt, locale)}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

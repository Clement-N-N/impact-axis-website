"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { homeSolutionContent } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeSolution({ locale }: { locale: Locale }) {
  const data = homeSolutionContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Note: Button is deliberately excluded from these targets (section-animations skill).
      const targets = [
        eyebrowRef.current,
        headlineRef.current,
        paragraphsRef.current,
        imageRef.current,
      ].filter((el): el is HTMLElement => !!el);

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 20 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
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
            variant="primary"
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
          className="relative col-span-4 aspect-[4/5] md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-2"
        >
          <Image
            src={data.image}
            alt={getLocalizedText(data.imageAlt, locale)}
            fill
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}

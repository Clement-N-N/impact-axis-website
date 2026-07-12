"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BottomCtaBlock as BottomCtaBlockData } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function BottomCtaBlock({ block, locale }: { block: BottomCtaBlockData; locale: Locale }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Note: the Button below is deliberately excluded from these targets
  // (section-animations skill) — it renders instantly, never animated.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(self.lines, { yPercent: 100 });

          return gsap.to(self.lines, {
            yPercent: 0,
            duration: 0.6,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top 80%",
              once: true,
            },
          });
        },
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:w-1/2"
    >
      <Image src={block.image} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-[#191E20]/50">
        <div
          className="flex h-full w-full flex-col justify-between p-10"
          style={{ backgroundColor: `${block.accentColor}8C` }}
        >
          <h2 ref={headlineRef} className="max-w-md text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-[1.3] text-white">
            {getLocalizedText(block.title, locale)}
          </h2>
          <Button
            href={block.button.href}
            variant={block.buttonVariant}
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            className="w-fit"
          >
            {getLocalizedText(block.button.label, locale)}
          </Button>
        </div>
      </div>
    </div>
  );
}

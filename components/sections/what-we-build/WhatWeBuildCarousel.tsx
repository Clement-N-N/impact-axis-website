"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whatWeBuildContent } from "./data";
import { CarouselImageSwitcher } from "./CarouselImageSwitcher";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Matches HeroBackgroundSlideshow's own hold duration, for consistency.
const SLIDE_DURATION_SECONDS = 6;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function WhatWeBuildCarousel({ locale }: { locale: Locale }) {
  const { slides } = whatWeBuildContent;
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const activeSlide = slides[activeIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Entrance reveal for the section itself (image + panel) on first scroll
  // into view. This is separate from the AnimatePresence crossfade below,
  // which handles individual slide-to-slide content swaps.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set([imageWrapperRef.current, panelRef.current], { opacity: 0, y: 20 });
      gsap.to([imageWrapperRef.current, panelRef.current], {
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
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div
          ref={imageWrapperRef}
          className="relative col-span-4 aspect-[4/3] overflow-hidden md:col-span-8 lg:col-span-4 lg:aspect-[4/5]"
        >
          <CarouselImageSwitcher images={slides.map((slide) => slide.image)} activeIndex={activeIndex} />
        </div>

        <div
          ref={panelRef}
          className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-6 lg:col-start-7 h-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-6"
            >
              <h3 className="text-[clamp(1.5rem,2.375vw,2rem)] font-medium text-black lg:col-span-6">
                {getLocalizedText(activeSlide.headline, locale)}
              </h3>
              <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray lg:col-span-4">
                {getLocalizedText(activeSlide.description, locale)}
              </p>
              <Button
                href={activeSlide.button.href}
                variant="primary"
                icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
                className="w-fit lg:col-span-6"
              >
                {getLocalizedText(activeSlide.button.label, locale)}
              </Button>
            </motion.div>
          </AnimatePresence>

          <ul className="flex flex-col">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-current={isActive ? "true" : undefined}
                    className="relative w-full border-b border-black/10 py-3 text-left text-[clamp(0.875rem,1.125vw,1rem)] text-black"
                  >
                    {getLocalizedText(slide.legendLabel, locale)}
                    {isActive && prefersReducedMotion && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] w-full bg-black" />
                    )}
                    {isActive && !prefersReducedMotion && (
                      <motion.span
                        key={activeIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: SLIDE_DURATION_SECONDS, ease: "linear" }}
                        onAnimationComplete={() => setActiveIndex((current) => (current + 1) % slides.length)}
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-black"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

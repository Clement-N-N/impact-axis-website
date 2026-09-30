"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CarouselImageSwitcher } from "@/components/sections/what-we-build/CarouselImageSwitcher";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurFocusContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Matches WhatWeBuildCarousel, so both indexes advance at the same cadence.
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

/**
 * The four focus areas as an index, showing one description at a time.
 *
 * Reuses the device from `WhatWeBuildCarousel`: terse labels, an underline that
 * doubles as a progress bar and advances to the next entry when it completes,
 * and a crossfading panel. Listing all four descriptions at once put four dense
 * paragraphs on screen together, which is the opposite of how the rest of the
 * site reads.
 *
 * One deliberate difference: auto-advance stops once the reader picks an entry
 * themselves. Pulling the text away from someone who has just chosen it would be
 * hostile, and by then the cue that the list is interactive has landed.
 */
export function OurFocusSection({
  data,
  locale,
}: {
  data: OurFocusContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const activeArea = data.areas[activeIndex];

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const fadeTargets = [
        eyebrowRef.current,
        imageWrapperRef.current,
        panelRef.current,
      ].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (reduced) {
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
              [imageWrapperRef.current, panelRef.current],
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.08,
              },
              "-=0.3",
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

  const autoAdvance = !prefersReducedMotion && !userPicked;

  return (
    <section
      ref={sectionRef}
      id="focus"
      className="py-section w-full scroll-mt-24 bg-white"
    >
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
        </div>

        <div
          ref={imageWrapperRef}
          className="relative col-span-4 mt-10 aspect-[4/3] w-full overflow-hidden md:col-span-8 lg:col-span-4 lg:col-start-1 lg:mt-14 lg:aspect-[4/5]"
        >
          <CarouselImageSwitcher
            images={data.areas.map((area) => area.image.src)}
            activeIndex={activeIndex}
          />
        </div>

        <div
          ref={panelRef}
          className="col-span-4 mt-8 flex flex-col justify-between gap-8 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-14"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              className="flex flex-col gap-3"
            >
              <h3 className="text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.25] font-medium text-black">
                {getLocalizedText(activeArea.title, locale)}
              </h3>
              <p className="text-impact-blue text-[clamp(0.9375rem,1.15vw,1.0625rem)]">
                {getLocalizedText(activeArea.lead, locale)}
              </p>
              <p className="text-impact-gray max-w-xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]">
                {getLocalizedText(activeArea.description, locale)}
              </p>
            </motion.div>
          </AnimatePresence>

          <ul className="flex flex-col">
            {data.areas.map((area, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      setUserPicked(true);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className="relative w-full cursor-pointer border-b border-black/10 py-3 text-left text-[clamp(0.875rem,1.125vw,1rem)] text-black"
                  >
                    {getLocalizedText(area.title, locale)}
                    {isActive && !autoAdvance && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] w-full bg-black" />
                    )}
                    {isActive && autoAdvance && (
                      <motion.span
                        key={activeIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: SLIDE_DURATION_SECONDS,
                          ease: "linear",
                        }}
                        onAnimationComplete={() =>
                          setActiveIndex(
                            (current) => (current + 1) % data.areas.length,
                          )
                        }
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

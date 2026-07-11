"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HomeTestimonialsContent } from "./types";
import { TestimonialCard } from "./TestimonialCard";

// Matches WhatWeBuildCarousel's own hold duration, for consistency.
const SLIDE_DURATION_SECONDS = 6;
const CARD_STEP_PERCENT = 92;

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

export function TestimonialsCarousel({
  data,
  locale,
}: {
  data: HomeTestimonialsContent;
  locale: Locale;
}) {
  const { title, seeAllStoriesButton, testimonials } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const goToNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const goToPrev = () =>
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="w-full bg-[#090E35] py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-3 lg:h-full">
          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.3] text-[#99CCFF]">
            {getLocalizedText(title, locale)}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={goToPrev}
                className="flex h-[50px] w-[50px] items-center justify-center bg-[#99CCFF] text-[#090E35]"
              >
                <ArrowLeftIcon weight="bold" className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={goToNext}
                className="flex h-[50px] w-[50px] items-center justify-center bg-[#99CCFF] text-[#090E35]"
              >
                <ArrowRightIcon weight="bold" className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-[2px] w-full bg-white/15">
              {!prefersReducedMotion && (
                <motion.div
                  key={activeIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SLIDE_DURATION_SECONDS, ease: "linear" }}
                  onAnimationComplete={goToNext}
                  className="absolute inset-y-0 left-0 bg-[#99CCFF]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4 overflow-hidden md:col-span-8 lg:col-span-9 lg:col-start-4">
          <motion.div
            className="flex gap-gutter"
            animate={{ x: `-${activeIndex * CARD_STEP_PERCENT}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-[92%] shrink-0">
                <TestimonialCard
                  testimonial={testimonial}
                  locale={locale}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="col-span-4 flex justify-center pt-section md:col-span-8 lg:col-span-12">
          <Link
            href={seeAllStoriesButton.href}
            className="border border-white/30 px-8 py-3 text-sm text-white"
          >
            {getLocalizedText(seeAllStoriesButton.label, locale)}
          </Link>
        </div>
      </Container>
    </section>
  );
}

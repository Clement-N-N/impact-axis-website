"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { PhotoStripContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Each photo sits lower than the one before it, so the row reads as a single
// descending staircase. The steps must increase monotonically — an order like
// 0/8/4/12 puts the third photo back above the second and the line stops
// looking like a stair at all. Written as whole class names because Tailwind
// scans source text and never evaluates this file.
// Margin, not translate: the reveal animation writes an inline `transform` to
// each tile, which silently overrides a Tailwind `translate-y-*` class and
// flattened the staircase back to a straight line. Margin is untouched by
// GSAP, so the two can coexist.
const STAGGER_OFFSETS = [
  "lg:mt-0",
  "lg:mt-16",
  "lg:mt-32",
  "lg:mt-48",
] as const;

export function PhotoStrip({
  data,
  locale,
}: {
  data: PhotoStripContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // `sectionRef.current`, not `sectionRef`: gsap.context() expects an
    // element, and handing it the ref object is what produces the
    // "[browser] Invalid scope" warnings logged in gsap_animation_issues.md.
    const ctx = gsap.context(() => {}, sectionRef.current ?? undefined);

    // Every other section on this page builds its ScrollTrigger inside
    // SplitText's onSplit, which defers creation until fonts have settled.
    // This section has no heading to split, so its trigger would otherwise be
    // constructed immediately on mount — in the middle of the other sections'
    // triggers initialising and refreshing. Building a ScrollTrigger during
    // another one's refresh throws "Cannot read properties of undefined
    // (reading 'end')" from inside ScrollTrigger.init, which took down the
    // whole page on roughly one desktop load in three. One frame's delay puts
    // it after that storm.
    const frame = requestAnimationFrame(() => {
      ctx.add(() => {
        if (!sectionRef.current || !gridRef.current) return;

        const items = gsap.utils.toArray<HTMLElement>(gridRef.current.children);
        if (items.length === 0) return;

        if (prefersReducedMotion) {
          gsap.set(items, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, {
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
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-white py-12">
      <Container>
        {/* On the page's 12-column grid: four photos of three columns each,
            filling the full width. Two per row on mobile so faces stay large
            enough to read; the stepped offsets only apply from lg, where all
            four sit in one row. */}
        <div
          ref={gridRef}
          className="gap-gutter grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12"
        >
          {data.images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={`relative aspect-[4/3] w-full self-start overflow-hidden md:col-span-4 lg:col-span-3 lg:aspect-[3/4] ${
                STAGGER_OFFSETS[index % STAGGER_OFFSETS.length]
              }`}
            >
              <Image
                src={image.src}
                alt={getLocalizedText(image.alt, locale)}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

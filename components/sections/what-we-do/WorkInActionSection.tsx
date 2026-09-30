"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WorkInActionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function WorkInActionSection({
  data,
  locale,
}: {
  data: WorkInActionContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const tiles = stripRef.current
        ? gsap.utils.toArray<HTMLElement>(stripRef.current.children)
        : [];
      const footerItems = footerRef.current
        ? gsap.utils.toArray<HTMLElement>(footerRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        ...tiles,
        ...footerItems,
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
              tiles,
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.3",
            )
            .to(
              footerItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.1,
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

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-2">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-8 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
        </div>

        {/* Horizontal scroll rather than a JS carousel: the strip is
            photography with no per-slide interaction, so native overflow is
            lighter and behaves correctly on touch without extra state. */}
        <div
          ref={stripRef}
          className="gap-gutter col-span-4 mt-12 flex snap-x snap-mandatory overflow-x-auto pb-4 md:col-span-8 lg:col-span-12"
        >
          {data.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] w-[78%] shrink-0 snap-start overflow-hidden sm:w-[48%] lg:w-[32%]"
            >
              <Image
                src={image.src}
                alt={getLocalizedText(image.alt, locale)}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 78vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div
          ref={footerRef}
          className="col-span-4 mt-6 flex flex-col gap-5 md:col-span-8 lg:col-span-8 lg:col-start-4"
        >
          <p className="text-impact-gray max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]">
            {getLocalizedText(data.caption, locale)}
          </p>

          <Link
            href={data.cta.href}
            className="text-impact-blue group inline-flex w-fit items-center gap-2 text-[clamp(0.9375rem,1.1vw,1rem)] font-medium"
          >
            {getLocalizedText(data.cta.label, locale)}
            <ArrowRightIcon
              weight="bold"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

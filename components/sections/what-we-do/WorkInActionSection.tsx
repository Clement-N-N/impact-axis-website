"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/sections/parallax-image";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WorkInActionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * A single full-bleed parallax band rather than a scroller of thumbnails.
 *
 * An image strip here read as a decorative dump: four captioned photographs
 * that duplicated the carousel device already used by `what-we-build`, and cost
 * four large downloads on mobile to say one thing. One moving image says it
 * better, reuses the existing `ParallaxImage`, and is a quarter of the payload.
 */
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
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const footerItems = footerRef.current
        ? gsap.utils.toArray<HTMLElement>(footerRef.current.children)
        : [];
      const fadeTargets = [eyebrowRef.current, ...footerItems].filter(Boolean);

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
              footerItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.25",
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
    <section ref={sectionRef} className="pt-section w-full bg-white">
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
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
        </div>
      </Container>

      <div className="mt-12">
        {/* ParallaxImage crops with `object-cover`, so a tall frame turns a wide
            photograph into a narrow vertical slice on a phone. The height climbs
            with the viewport instead of starting tall. */}
        <ParallaxImage
          src={data.image.src}
          heightClass="h-[38vh] sm:h-[50vh] lg:h-[70vh]"
          padded={false}
          reveal
        />
      </div>

      <Container className="gap-gutter pb-section grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div
          ref={footerRef}
          className="col-span-4 mt-10 flex flex-col gap-5 md:col-span-8 lg:col-span-8 lg:col-start-4"
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

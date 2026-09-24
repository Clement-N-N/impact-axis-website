"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { AboutImageBandContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Full-bleed photograph with the section caption laid over it.
 *
 * The scroll-scrubbed parallax matches `ParallaxImage`, which the home page
 * already uses for its full-bleed photographs — same `yPercent: -30 → 30` over
 * the section's full travel, same inset so the image always overflows the
 * frame it is being moved inside. `ParallaxImage` itself is not reused because
 * it has no slot for overlaid content, and giving it one would change it for
 * the home page too.
 */
export function AboutImageBand({
  data,
  locale,
}: {
  data: AboutImageBandContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // `sectionRef.current`, not the ref object — see gsap_animation_issues.md
    // on the "[browser] Invalid scope" warnings.
    const ctx = gsap.context(() => {}, sectionRef.current ?? undefined);

    // Deferred one frame for the same reason as PhotoStrip: this section has
    // no heading to split, so without the delay its ScrollTriggers would be
    // constructed while the other sections' triggers are still initialising,
    // which throws from inside ScrollTrigger.init.
    const frame = requestAnimationFrame(() => {
      ctx.add(() => {
        if (!sectionRef.current) return;

        if (prefersReducedMotion) {
          gsap.set([imageRef.current, captionRef.current], {
            opacity: 1,
            yPercent: 0,
            y: 0,
          });
          return;
        }

        // Scrubbed parallax, matching ParallaxImage on the home page.
        gsap.fromTo(
          imageRef.current,
          { yPercent: -30 },
          {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.set(captionRef.current, { opacity: 0, y: 20 });
        gsap.to(captionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
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
    <section ref={sectionRef} className="w-full bg-white">
      <div className="relative h-[38vh] w-full overflow-hidden lg:h-[52vh]">
        {/* Overflows the frame top and bottom by the same 18% ParallaxImage
            uses, so the scrubbed travel never exposes an edge. */}
        <div ref={imageRef} className="absolute inset-x-0 -top-[18%] -bottom-[18%]">
          <Image
            src={data.image.src}
            alt={getLocalizedText(data.image.alt, locale)}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        {/* Scrim so the caption keeps its contrast wherever the photograph is
            light. Bottom-weighted because the caption sits at the bottom. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          aria-hidden="true"
        />
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <div className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
            <div className="hidden lg:col-span-1 lg:block">
              <div
                className="mt-[0.6vw] h-[8px] w-[8px] bg-white"
                aria-hidden="true"
              />
            </div>
            <p
              ref={captionRef}
              className="col-span-4 text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium text-white md:col-span-8 lg:col-span-8"
            >
              {getLocalizedText(data.caption, locale)}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}

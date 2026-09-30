"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import {
  PARTNERSHIP_AUDIENCES,
  partnershipContent,
} from "@/components/sections/partnership";
import type { Locale } from "@/i18n/routing";
import type { WaysToWorkContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * The four audiences as an index into the pages that already exist.
 *
 * Names and headlines come from `partnershipContent`, the same source the
 * `/work-with-us/<slug>` pages render from, so this cannot fall out of step
 * with them. The source copy repeats each audience's full three paragraphs
 * here as well, which would have duplicated four live pages word for word —
 * the headline is what a reader needs to choose where to go.
 */
export function WaysToWorkSection({
  data,
  locale,
}: {
  data: WaysToWorkContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const fadeTargets = [eyebrowRef.current, ...items].filter(Boolean);

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
              items,
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

        {/* Numerals at display size are the layout, not decoration. Each
            audience is a full-width row rather than a card in a grid, so the
            set reads as a numbered index and the type does the work. */}
        <ol
          ref={listRef}
          className="col-span-4 mt-12 flex flex-col md:col-span-8 lg:col-span-12 lg:mt-16"
        >
          {PARTNERSHIP_AUDIENCES.map((slug, index) => {
            const audience = partnershipContent.audiences[slug];
            return (
              <li key={slug}>
                <Link
                  href={`/work-with-us/${slug}`}
                  className="group border-border hover:border-impact-blue flex flex-col gap-3 border-t py-8 transition-colors duration-300 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-6 lg:py-10"
                >
                  <span className="text-impact-gray/35 group-hover:text-impact-yellow text-[clamp(2.5rem,6vw,5rem)] leading-[0.85] font-medium tabular-nums transition-colors duration-300 lg:col-span-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium text-black lg:col-span-4">
                    {getLocalizedText(audience.name, locale)}
                  </h3>

                  <p className="text-impact-gray text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.6] lg:col-span-5">
                    {getLocalizedText(audience.headline, locale)}
                  </p>

                  <span className="text-impact-blue inline-flex items-center gap-2 text-[0.875rem] font-medium lg:col-span-1 lg:justify-end">
                    <span className="lg:sr-only">
                      {getLocalizedText(data.cardCtaLabel, locale)}
                    </span>
                    <ArrowRightIcon
                      weight="bold"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

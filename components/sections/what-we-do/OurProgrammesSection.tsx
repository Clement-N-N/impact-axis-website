"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurProgrammesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * A programme index that tracks where the reader is, built for phones first.
 *
 * On a phone it is a sticky row of numbered labels sitting under the header,
 * reading like a segmented control, so the "one of three" orientation is
 * present on the screens most visitors use. From `lg` up the same index becomes
 * a sticky column beside the programmes. The wrapper is `lg:contents` so the
 * nav and the list are one containing block on mobile — which is what lets the
 * row stay stuck while the programmes scroll past — and become independent grid
 * items on wide screens.
 *
 * Sticky is deliberately CSS rather than ScrollTrigger's `pin`. Pin wraps the
 * element, switches it to fixed positioning and inserts a spacer sized from
 * page height, and page height here settles late: the photography is
 * multi-megabyte and mobile browser chrome collapses on scroll. Sticky needs no
 * measurement and cannot be wrong about height.
 *
 * ScrollTrigger only highlights the active entry. If it never runs, every
 * label, image and paragraph is still visible and scrolling is unaffected.
 */
export function OurProgrammesSection({
  data,
  locale,
}: {
  data: OurProgrammesContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const articles = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];

      articles.forEach((article, index) => {
        ScrollTrigger.create({
          trigger: article,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index);
          },
        });

        if (prefersReducedMotion) return;

        gsap.set(article, { opacity: 0, y: 24 });
        gsap.to(article, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: article, start: "top 85%", once: true },
        });
      });

      const fadeTargets = [eyebrowRef.current, introRef.current].filter(Boolean);
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
              introRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
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
    <section
      ref={sectionRef}
      id="programmes"
      className="py-section bg-impact-blue w-full scroll-mt-24"
    >
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
          <p
            ref={introRef}
            className="mt-6 max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7] text-white/70"
          >
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        {/* Desktop only. On a phone a sticky bar competing with the site header
            read as clutter, and the programme headings below already carry the
            same information in reading order. */}
        <nav
          aria-label={getLocalizedText(data.eyebrow, locale)}
          className="hidden lg:col-span-3 lg:col-start-1 lg:mt-20 lg:block lg:self-start lg:sticky lg:top-[calc(var(--spacing-header)+6rem)]"
        >
          <ol className="flex flex-col">
              {data.programmes.map((programme, index) => {
                const isActive = activeIndex === index;
                return (
                  <li key={programme.id}>
                    <a
                      href={`#${programme.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={clsx(
                        "group flex items-baseline gap-3 border-t py-4 transition-colors duration-300",
                        isActive ? "border-t-white/40" : "border-t-white/20",
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[0.6875rem] tabular-nums transition-colors duration-300",
                          isActive ? "text-impact-yellow" : "text-white/40",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={clsx(
                          "text-[clamp(0.875rem,1.1vw,1rem)] transition-colors duration-300",
                          isActive
                            ? "text-white"
                            : "text-white/45 group-hover:text-white/75",
                        )}
                      >
                        {getLocalizedText(programme.title, locale)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div
            ref={listRef}
            className="col-span-4 mt-10 flex flex-col gap-20 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-20 lg:gap-28"
          >
            {data.programmes.map((programme, index) => (
              <article
                key={programme.id}
                id={programme.id}
                className="flex scroll-mt-32 flex-col gap-5 lg:scroll-mt-24"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[3/2]">
                  <Image
                    src={programme.image.src}
                    alt={getLocalizedText(programme.image.alt, locale)}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  {/* The number belongs to the programme, not to a photograph,
                      so it sits with the title rather than stamped on the
                      image — which also leaves the image free to become a set. */}
                  <h3 className="flex items-baseline gap-3 text-[clamp(1.25rem,2vw,1.75rem)] font-medium text-white">
                    <span className="text-impact-yellow text-[0.75em] tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {getLocalizedText(programme.title, locale)}
                  </h3>
                  <p className="text-impact-yellow text-[clamp(0.9375rem,1.15vw,1.0625rem)]">
                    {getLocalizedText(programme.tagline, locale)}
                  </p>
                  <p className="max-w-2xl text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-white/70">
                    {getLocalizedText(programme.description, locale)}
                  </p>

                  {programme.cta ? (
                    <Link
                      href={programme.cta.href}
                      className="text-impact-yellow group mt-2 inline-flex w-fit items-center gap-2 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium"
                    >
                      {getLocalizedText(programme.cta.label, locale)}
                      <ArrowRightIcon
                        weight="bold"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
      </Container>
    </section>
  );
}

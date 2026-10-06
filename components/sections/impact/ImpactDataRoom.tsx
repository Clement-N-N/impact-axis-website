"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowDownIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Odometer } from "@/components/sections/work-with-us/Odometer";
import type { Locale } from "@/i18n/routing";
import type { ImpactStatEntry } from "@/sanity/home";
import type { Report } from "@/sanity/reports";
import type { ImpactHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** "65%" -> 65; anything that isn't a percentage -> null. */
const percent = (value: string) => {
  const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*%$/);
  return m ? Math.min(100, Number(m[1])) : null;
};

/**
 * Impact page opener, "data room" style: headline and the way into the
 * reports, then the headline figures as a bento. One figure is featured as a
 * large navy tile whose digits roll in; percentages can be drawn as a ring or
 * a ten-segment bar. Figures, visuals and the featured pick all come from the
 * "Impact Stats" document in Sanity (shared with the home page). Every value
 * is real text in the page; the drawings are decoration.
 */
export function ImpactDataRoom({
  hero,
  stats,
  latest,
  locale,
}: {
  hero: ImpactHeroContent;
  stats: ImpactStatEntry[];
  latest: Report | null;
  locale: Locale;
}) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const featuredIndex = Math.max(
    0,
    stats.findIndex((s) => s.featured),
  );
  const featured = stats[featuredIndex];
  const rest = stats.filter((_, i) => i !== featuredIndex);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, { type: "lines", mask: "lines" });
        gsap.from(split.lines, { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.1 });
      }
      gsap.from("[data-rise]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.2,
        clearProps: "transform,opacity",
      });
      const grid = section.querySelector("[data-grid]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: "top 85%", once: true } });
      tl.from("[data-tile]", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform,opacity",
      });
      section.querySelectorAll<SVGCircleElement>("[data-ring]").forEach((ring) => {
        tl.from(ring, { strokeDashoffset: 100, duration: 1.4, ease: "power3.out" }, 0.3);
      });
      tl.from("[data-seg]", { scaleX: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }, 0.4);
    }, section);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="impact-title"
      className="relative w-full overflow-hidden bg-white pt-[calc(var(--header-height)+clamp(2.5rem,6vw,5rem))] pb-[clamp(3rem,6vw,5rem)]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-40 -right-40 size-[34rem] rounded-full bg-[#fff3c4] blur-[120px]"
      />
      <Container className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[46rem] flex-col gap-4">
            <span data-rise className="text-sm font-semibold tracking-[0.14em] text-[#8a8ea3] uppercase">
              {t(hero.eyebrow)}
            </span>
            <h1
              id="impact-title"
              ref={headlineRef}
              className="text-impact-blue text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
            >
              {t(hero.headline)}
            </h1>
            <p data-rise className="max-w-[56ch] text-lg text-pretty text-black/70">
              {t(hero.intro)}
            </p>
          </div>
          <div data-rise className="flex flex-wrap gap-3 lg:shrink-0">
            {latest && (
              <a
                href={latest.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-impact-yellow text-impact-blue group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {t(hero.readLatest)}
                <ArrowUpRightIcon weight="bold" className="size-4 transition-transform group-hover:rotate-45" />
              </a>
            )}
            <a
              href="#reports"
              className="border-impact-blue text-impact-blue hover:bg-impact-blue inline-flex items-center gap-2 rounded-full border-[1.5px] px-6 py-3.5 font-semibold transition-colors hover:text-white focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {t(hero.browse)}
              <ArrowDownIcon weight="bold" className="size-4" />
            </a>
          </div>
        </div>

        {featured && (
          <ul
            data-grid
            className="mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-[1.35fr_1fr_1fr]"
          >
            <li
              data-tile
              className="bg-impact-blue relative isolate flex min-h-[18rem] flex-col justify-between gap-6 overflow-hidden rounded-[26px] p-7 text-white sm:col-span-2 md:p-9 lg:col-span-1 lg:row-span-2"
            >
              <span
                aria-hidden="true"
                className="absolute -right-24 -bottom-24 -z-10 size-80 rounded-full bg-[#74b9ff]/25 blur-[70px]"
              />
              <p className="max-w-[28ch] text-lg text-white/85">{t(featured.label)}</p>
              <div className="flex flex-col gap-3">
                <Odometer
                  value={featured.value}
                  className="text-impact-yellow text-[clamp(4rem,8vw,7.5rem)] font-bold tracking-[-0.045em]"
                />
                {featured.detail && (
                  <p className="max-w-[40ch] text-white/70 text-pretty">{t(featured.detail)}</p>
                )}
              </div>
            </li>

            {rest.map((stat) => {
              const p = percent(stat.value);
              const visual = p === null ? "number" : (stat.visual ?? "number");
              return (
                <li
                  key={stat.value + stat.label.en}
                  data-tile
                  className="flex min-h-[10.5rem] flex-col justify-between gap-4 rounded-[22px] bg-[#f4f6fc] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-impact-blue text-[clamp(2.25rem,3.4vw,3rem)] leading-none font-bold tracking-[-0.035em]">
                      {stat.value}
                    </span>
                    {visual === "ring" && p !== null && (
                      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-[4.5rem] shrink-0 -rotate-90">
                        <circle cx="20" cy="20" r="15.9155" fill="none" stroke="#dfe3ef" strokeWidth="5" />
                        <circle
                          data-ring
                          cx="20"
                          cy="20"
                          r="15.9155"
                          fill="none"
                          stroke="#f4c600"
                          strokeWidth="5"
                          strokeLinecap="round"
                          pathLength={100}
                          strokeDasharray="100"
                          strokeDashoffset={100 - p}
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-black/70 text-pretty">{t(stat.label)}</p>
                    {visual === "bar" && p !== null && (
                      <span aria-hidden="true" className="flex gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span
                            key={i}
                            data-seg
                            className={clsx(
                              "h-2.5 flex-1 origin-left rounded-[3px]",
                              i < Math.round(p / 10) ? "bg-impact-blue" : "bg-[#dfe3ef]",
                            )}
                          />
                        ))}
                      </span>
                    )}
                    {stat.detail && <p className="text-sm text-black/55">{t(stat.detail)}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}

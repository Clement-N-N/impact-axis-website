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
import type { ImpactMetric, OurImpactContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** The photo in the featured tile. Not used elsewhere on the home page. */
const FEATURE_IMAGE = {
  src: "/images/gallery/gwf-2024-43.jpg",
  alt: {
    en: "Six Goodwill Fellowship fellows standing shoulder to shoulder and smiling",
    fr: "Six fellows de la Goodwill Fellowship côte à côte, souriants",
  },
};

/** Brand looks for the four supporting tiles, in order. */
const TILES = [
  {
    bg: "bg-[linear-gradient(160deg,#ffeaa7_0%,#ffde75_55%,#f4c600_100%)]",
    bar: "bg-impact-blue",
  },
  {
    bg: "bg-[linear-gradient(160deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)]",
    bar: "bg-impact-blue",
  },
  {
    bg: "bg-[linear-gradient(160deg,#ffe0d6_0%,#fab1a0_50%,#f7886e_100%)]",
    bar: "bg-impact-blue",
  },
  { bg: "bg-[#f1f3fa]", bar: "bg-[#f7886e]" },
];

/** "$1.5M+" → { prefix "$", value 1.5, decimals 1, suffix "M+" }. */
function parseFigure(figure: string) {
  const m = figure.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const raw = m[2].replace(/,/g, "");
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { prefix: m[1], value, decimals, suffix: m[3] };
}

/** The $ figure leads the grid; otherwise the first figure does. */
function pickFeatured(metrics: ImpactMetric[]) {
  const i = metrics.findIndex((m) => m.number.includes("$"));
  return i === -1 ? 0 : i;
}

/**
 * Our Impact as brand-colour number tiles.
 *
 * The money figure gets the large navy tile with a photo; the other figures
 * sit in yellow, blue, peach and light tiles. As the grid scrolls in, tiles
 * rise in turn, every number counts up to its value, and percentage tiles
 * fill a bar to match. The final values are in the markup, so with
 * prefers-reduced-motion (or no JS) the numbers simply show.
 */
export function ImpactSection({
  data,
  locale,
}: {
  data: OurImpactContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const featuredIndex = pickFeatured(data.metrics);
  const featured = data.metrics[featuredIndex];
  const rest = data.metrics.filter((_, i) => i !== featuredIndex);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }

      const grid = section.querySelector<HTMLElement>("[data-grid]");
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", section);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: grid, start: "top 78%", once: true },
      });
      tl.from(tiles, {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });

      tiles.forEach((tile, i) => {
        const el = tile.querySelector<HTMLElement>("[data-figure]");
        const fig = el ? parseFigure(el.dataset.figure ?? "") : null;
        if (el && fig) {
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: fig.value,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = `${fig.prefix}${counter.v.toFixed(fig.decimals)}${fig.suffix}`;
              },
            },
            0.2 + i * 0.1,
          );
        }
        const bar = tile.querySelector<HTMLElement>("[data-bar]");
        if (bar)
          tl.from(
            bar,
            { scaleX: 0, duration: 1.4, ease: "power3.out" },
            0.35 + i * 0.1,
          );
      });

      const photo = section.querySelector<HTMLElement>("[data-photo]");
      if (photo)
        gsap.fromTo(
          photo,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  const percent = (n: string) => {
    const f = parseFigure(n);
    return f && f.suffix.startsWith("%") ? Math.min(f.value, 100) : null;
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-impact-title"
      className="py-section w-full bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="our-impact-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[42ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.subline, locale)}
          </p>
        </div>

        <ul
          data-grid
          className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:mt-14 lg:grid-cols-[1.3fr_1fr_1fr] lg:grid-rows-[minmax(15rem,auto)_minmax(15rem,auto)]"
        >
          {/* Featured figure. */}
          <li
            data-tile
            className="bg-impact-blue relative col-span-2 flex min-h-[26rem] flex-col overflow-hidden rounded-[24px] p-6 text-white md:rounded-[28px] md:p-8 lg:col-span-1 lg:row-span-2"
          >
            <div className="relative z-10">
              <p
                data-figure={featured.number}
                className="text-impact-yellow text-[clamp(4.5rem,9vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.045em] tabular-nums"
              >
                {featured.number}
              </p>
              <p className="mt-3 max-w-[20ch] text-lg leading-snug font-semibold text-pretty">
                {getLocalizedText(featured.label, locale)}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[58%] [mask-image:linear-gradient(to_top,#000_55%,transparent)]">
              <div data-photo className="absolute inset-0">
                <Image
                  src={FEATURE_IMAGE.src}
                  alt={getLocalizedText(FEATURE_IMAGE.alt, locale)}
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </li>

          {rest.map((metric, i) => {
            const look = TILES[i % TILES.length];
            const pct = percent(metric.number);
            return (
              <li
                key={`${metric.number}-${i}`}
                data-tile
                className={`text-impact-blue flex min-h-[11rem] flex-col rounded-[24px] p-5 md:min-h-[13rem] md:rounded-[28px] md:p-7 ${look.bg}`}
              >
                <p
                  data-figure={metric.number}
                  className="text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[0.9] font-bold tracking-[-0.04em] tabular-nums"
                >
                  {metric.number}
                </p>
                <p className="mt-3 max-w-[24ch] text-sm leading-snug font-semibold text-pretty md:text-base">
                  {getLocalizedText(metric.label, locale)}
                </p>
                {pct !== null && (
                  <div
                    aria-hidden="true"
                    className="bg-impact-blue/15 mt-auto h-2 overflow-hidden rounded-full pt-0"
                  >
                    <div
                      data-bar
                      className={`h-full origin-left rounded-full ${look.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end md:mt-8">
          <Link
            href="/impact"
            className="bg-impact-blue focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {getLocalizedText(data.reportCta, locale)}
            <ArrowRightIcon weight="bold" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

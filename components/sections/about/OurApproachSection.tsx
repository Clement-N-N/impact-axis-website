"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurApproachContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** One brand gradient per step card: yellow, blue, peach. */
const CARD_THEMES = [
  "bg-[linear-gradient(160deg,#ffeaa7_0%,#ffde75_55%,#f4c600_100%)]",
  "bg-[linear-gradient(160deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)]",
  "bg-[linear-gradient(160deg,#ffe0d6_0%,#fab1a0_55%,#f7886e_100%)]",
];

/**
 * The bridge: a shallow arc drawn as a quadratic curve in a 1000×80 box,
 * from (0, 64) up through the control point (500, -16) and back down to
 * (1000, 64). x is linear in t, so a point at fraction t sits at
 * left: t·100% and top: y(t)/80.
 */
const ARC = "M0 64 Q500 -16 1000 64";
const arcY = (t: number) =>
  (1 - t) ** 2 * 64 + 2 * (1 - t) * t * -16 + t ** 2 * 64;
/** Where the three steps sit along the bridge. */
const STOPS = [0.15, 0.5, 0.85];

/**
 * Our Approach: "building the bridge".
 *
 * A navy section with the three steps as wide cards on a track. On desktop
 * the section pins and scrolling slides the cards sideways, one step at a
 * time, while a glowing yellow arc underneath fills from Education towards
 * Meaningful work. Each step's point on the arc lights up as its card locks
 * in, and the closing line lands as the arc reaches the far end.
 *
 * Below lg, and under prefers-reduced-motion, nothing pins: the cards are a
 * sideways swipe, and the same bridge fills as you swipe through them.
 */
export function OurApproachSection({
  data,
  locale,
}: {
  data: OurApproachContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!section || !scroller || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-step-card]", section);
    const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", section);
    const fillPath = section.querySelector<SVGPathElement>("[data-fill]");
    const closing = section.querySelector<HTMLElement>("[data-closing]");
    const n = cards.length;

    /**
     * Paint the bridge for overall progress q (0–1). The first 80% moves
     * through the steps; the last 20% carries the arc on to the far end.
     */
    const paint = (q: number) => {
      const steps = Math.min(q / 0.8, 1);
      const fill =
        q < 0.8
          ? STOPS[0] + (STOPS[n - 1] - STOPS[0]) * steps
          : STOPS[n - 1] + (1 - STOPS[n - 1]) * ((q - 0.8) / 0.2);
      if (fillPath) fillPath.style.strokeDashoffset = String(1000 * (1 - fill));
      const active = Math.round(steps * (n - 1));
      cards.forEach((c, i) => (c.dataset.active = String(i === active)));
      nodes.forEach((node, i) => (node.dataset.lit = String(i <= active)));
      if (closing) closing.dataset.shown = String(q > 0.9);
    };

    // Swipe mode (mobile / reduced motion): progress follows the scroller.
    const onScroll = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 0) return paint(1);
      const f = scroller.scrollLeft / max;
      paint(f > 0.98 ? 1 : f * 0.8);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    paint(0);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      onScroll();
      return () => scroller.removeEventListener("scroll", onScroll);
    }

    let split: SplitText | undefined;
    const mm = gsap.matchMedia();
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
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
        });
      }

      // Desktop: pin and drive the track sideways with vertical scroll.
      mm.add("(min-width: 1024px)", () => {
        scroller.removeEventListener("scroll", onScroll);
        const distance = () => {
          // From the first card left-aligned to the last card right-aligned.
          const first = cards[0];
          const last = cards[n - 1];
          return (
            last.offsetLeft +
            last.offsetWidth -
            first.offsetLeft -
            scroller.clientWidth
          );
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.9}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => paint(self.progress),
          },
        });
        tl.to(track, { x: () => -distance(), duration: 0.8 }).to(
          {},
          { duration: 0.2 },
        );
        // Photos drift a little inside their cards as the track moves.
        tl.fromTo(
          section.querySelectorAll("[data-step-img]"),
          { xPercent: 8 },
          { xPercent: -8, duration: 0.8 },
          0,
        );
        return () => scroller.addEventListener("scroll", onScroll);
      });
    }, section);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-approach-title"
      className="bg-impact-blue relative w-full overflow-hidden text-white"
    >
      {/* Soft glow behind the bridge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80vw] -translate-x-1/2 rounded-full bg-[#f4c600]/10 blur-[100px]"
      />

      <Container className="py-section relative flex flex-col gap-10 lg:min-h-[100svh] lg:justify-center lg:gap-8 lg:pt-[calc(var(--header-height)+1.5rem)] lg:pb-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-5 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
                {getLocalizedText(data.eyebrow, locale)}
              </span>
              <span className="text-sm font-semibold text-[#ffde75]">
                {getLocalizedText(data.tagline, locale)}
              </span>
            </div>
            <h2
              id="our-approach-title"
              ref={headlineRef}
              className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.title, locale)}
            </h2>
          </div>
          <p className="max-w-[46ch] text-lg text-pretty text-white/75 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.headline, locale)}
          </p>
        </div>

        {/* Track: swipeable below lg (and with reduced motion); on desktop
            GSAP moves it with vertical scroll instead. */}
        <div
          ref={scrollerRef}
          className="-mx-4 snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto px-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-0 lg:motion-safe:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <ol ref={trackRef} className="flex gap-4 md:gap-6 lg:gap-8">
            {data.steps.map((step, i) => (
              <li
                key={step.stepNumber}
                data-step-card
                data-active={i === 0}
                className={`text-impact-blue relative grid w-[86vw] shrink-0 snap-center grid-cols-1 overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[active=false]:scale-[0.96] data-[active=false]:opacity-55 md:w-[70vw] md:grid-cols-2 lg:h-[clamp(20rem,calc(100svh-27rem),30rem)] lg:w-[min(58rem,64vw)] lg:rounded-[32px] ${
                  CARD_THEMES[i % CARD_THEMES.length]
                }`}
              >
                <div className="relative order-2 flex flex-col justify-between gap-6 p-6 md:order-1 md:p-9 lg:p-11">
                  <span
                    aria-hidden="true"
                    className="text-[5.5rem] leading-[0.8] font-extrabold text-transparent tabular-nums [-webkit-text-stroke:2px_rgb(16_27_98/0.25)] md:text-[8rem] lg:text-[9rem]"
                  >
                    {step.stepNumber}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-4xl leading-none font-semibold tracking-[-0.02em]">
                      <span className="sr-only">{step.stepNumber}. </span>
                      {getLocalizedText(step.title, locale)}
                    </h3>
                    <p className="text-lg leading-snug font-semibold text-pretty">
                      {getLocalizedText(step.subtitle, locale)}
                    </p>
                    <p className="text-impact-blue/80 max-w-[42ch] text-base text-pretty">
                      {getLocalizedText(step.description, locale)}
                    </p>
                  </div>
                </div>
                <div className="relative order-1 aspect-[16/10] overflow-hidden md:order-2 md:aspect-auto">
                  <div
                    data-step-img
                    className="absolute -inset-x-[10%] inset-y-0"
                  >
                    <Image
                      src={step.image.src}
                      alt={getLocalizedText(step.image.alt, locale)}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 36vw, (min-width: 768px) 42vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The bridge, from Education to Meaningful work. */}
        <div
          aria-hidden="true"
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-6 md:flex-nowrap md:gap-6 md:pt-0"
        >
          <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-white/70 uppercase md:text-sm">
            {getLocalizedText(data.bridgeStart, locale)}
          </span>
          <div className="relative order-first h-12 w-full md:order-none md:h-16 md:w-auto md:flex-1">
            <svg
              viewBox="0 0 1000 80"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible"
            >
              <defs>
                <linearGradient id="bridge-fill" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ffde75" />
                  <stop offset="100%" stopColor="#f4c600" />
                </linearGradient>
              </defs>
              <path
                d={ARC}
                fill="none"
                stroke="rgb(255 255 255 / 0.15)"
                strokeWidth={4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                data-fill
                d={ARC}
                pathLength={1000}
                fill="none"
                stroke="url(#bridge-fill)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={1000}
                strokeDashoffset={1000}
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-[0_0_10px_rgb(244_198_0/0.7)] transition-[stroke-dashoffset] duration-200"
              />
            </svg>
            {data.steps.map((step, i) => {
              const t = STOPS[i];
              return (
                <span
                  key={step.stepNumber}
                  data-node
                  data-lit={i === 0}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${t * 100}%`,
                    top: `${(arcY(t) / 80) * 100}%`,
                  }}
                >
                  <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-white/50 transition-colors duration-300 group-data-[lit=true]:text-white md:text-sm">
                    {getLocalizedText(step.title, locale)}
                  </span>
                  <span className="bg-impact-blue group-data-[lit=true]:border-impact-yellow group-data-[lit=true]:bg-impact-yellow block size-5 rounded-full border-2 border-white/40 transition-[background-color,border-color,box-shadow,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[lit=true]:scale-125 group-data-[lit=true]:shadow-[0_0_0_8px_rgb(244_198_0/0.2),0_0_24px_rgb(244_198_0/0.8)] md:size-6" />
                </span>
              );
            })}
          </div>
          <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-white/70 uppercase md:text-sm">
            {getLocalizedText(data.bridgeEnd, locale)}
          </span>
        </div>

        <p
          data-closing
          data-shown="false"
          className="max-w-[70ch] self-center text-center text-lg font-medium text-balance text-white transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[shown=false]:translate-y-3 data-[shown=false]:opacity-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 max-lg:!translate-y-0 max-lg:!opacity-100 md:text-xl"
        >
          {getLocalizedText(data.closingLine, locale)}
        </p>
      </Container>
    </section>
  );
}

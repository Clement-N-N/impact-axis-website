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

/** Ring geometry, in the SVG's 600×600 box. */
const C = 300;
const R = 250;
/** Node i sits i/n of the way round, clockwise from the top. */
const nodePos = (i: number, n: number) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return {
    left: ((C + R * Math.cos(a)) / 600) * 100,
    top: ((C + R * Math.sin(a)) / 600) * 100,
  };
};

/**
 * Our Approach as "the loop".
 *
 * A navy section: on the left the heading and the active step's details, on
 * the right a ring joining Learn → Apply → Connect around a circular photo.
 * The section pins while you scroll: a yellow arc sweeps round the ring,
 * each step's node lights up as the arc reaches it, the centre photo and
 * the step details switch to match, and when the arc closes the loop back
 * at Learn the closing line lands.
 *
 * Phones pin just the ring and step details (the heading scrolls above).
 * Under prefers-reduced-motion nothing pins: the ring shows complete and
 * all three steps are listed.
 */
export function OurApproachSection({
  data,
  locale,
}: {
  data: OurApproachContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const n = data.steps.length;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const arc = section.querySelector<SVGCircleElement>("[data-arc]");
    const marked = gsap.utils.toArray<HTMLElement>("[data-step]", section);
    const closing = section.querySelector<HTMLElement>("[data-closing]");

    /** Paint the loop for progress q (0–1): arc, nodes, photo, details. */
    const paint = (q: number) => {
      const fill = Math.min(q / 0.9, 1);
      if (arc) arc.style.strokeDashoffset = String(1000 * (1 - fill));
      const active = Math.min(Math.floor(fill * n), n - 1);
      marked.forEach((el) => {
        const i = Number(el.dataset.step);
        el.dataset.active = String(i === active);
        el.dataset.lit = String(i <= active);
      });
      if (closing) closing.dataset.shown = String(fill >= 0.995);
    };

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

      // The ring swings into place as the section arrives.
      gsap.from("[data-ring]", {
        scale: 0.85,
        opacity: 0,
        rotation: -30,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });

      paint(0);
      const pin = (trigger: Element) =>
        ScrollTrigger.create({
          trigger,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => paint(self.progress),
        });
      mm.add("(min-width: 1024px)", () => {
        pin(section);
      });
      mm.add("(max-width: 1023px)", () => {
        pin(stage);
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, [locale, n]);

  return (
    // GSAP wraps the pinned <section> in a pin-spacer. This plain wrapper is
    // what React removes on navigation, so it never tries to detach the
    // section from a parent that is no longer its parent (removeChild error).
    <div>
      <section
        ref={sectionRef}
        aria-labelledby="our-approach-title"
        className="bg-impact-blue relative w-full overflow-hidden text-white"
      >
        {/* Soft glow behind the ring. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-10%] size-[70vw] max-w-[60rem] -translate-y-1/2 rounded-full bg-[#f4c600]/[0.07] blur-[120px]"
        />

        <Container className="py-section relative grid grid-cols-1 gap-12 lg:h-[100svh] lg:min-h-[34rem] lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-[var(--header-height)] lg:pb-[clamp(3rem,8svh,5rem)]">
          <div className="flex flex-col gap-6 lg:col-span-6 lg:gap-[clamp(0.75rem,2.2svh,1.5rem)]">
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
              className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance lg:text-[clamp(2.25rem,min(4vw,7svh),4.25rem)]"
            >
              {getLocalizedText(data.title, locale)}
            </h2>
            <p className="max-w-[52ch] text-lg text-pretty text-white/75 lg:text-[clamp(1rem,2.2svh,1.125rem)]">
              {getLocalizedText(data.headline, locale)}
            </p>

            {/* Step details, desktop: one at a time in the same spot. */}
            <div className="hidden border-t border-white/15 lg:mt-1 lg:grid lg:gap-8 lg:pt-[clamp(1rem,3svh,2rem)] lg:motion-safe:gap-0">
              {data.steps.map((step, i) => (
                <StepDetails
                  key={step.stepNumber}
                  index={i}
                  step={step}
                  locale={locale}
                />
              ))}
            </div>
          </div>

          {/* Stage: the ring (and, on phones, the step details under it). */}
          <div
            ref={stageRef}
            className="flex flex-col items-center gap-8 max-lg:motion-safe:min-h-[100svh] max-lg:motion-safe:justify-center max-lg:motion-safe:pt-[var(--header-height)] lg:col-span-6"
          >
            <div
              data-ring
              className="relative aspect-square w-[min(78vw,24rem)] lg:w-[min(40vw,36rem,calc(100svh-var(--header-height)-9rem))]"
            >
              <svg
                viewBox="0 0 600 600"
                aria-hidden="true"
                className="absolute inset-0 size-full overflow-visible"
              >
                <defs>
                  <linearGradient id="loop-arc" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffde75" />
                    <stop offset="100%" stopColor="#f4c600" />
                  </linearGradient>
                </defs>
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="rgb(255 255 255 / 0.14)"
                  strokeWidth={3}
                />
                <circle
                  data-arc
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="url(#loop-arc)"
                  strokeWidth={5}
                  strokeLinecap="round"
                  pathLength={1000}
                  strokeDasharray={1000}
                  transform={`rotate(-90 ${C} ${C})`}
                  className="drop-shadow-[0_0_10px_rgb(244_198_0/0.6)] [stroke-dashoffset:1000] motion-reduce:[stroke-dashoffset:0]"
                />
              </svg>

              {/* Centre photo, one per step, crossfading. */}
              <div className="absolute inset-[19%] overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
                {data.steps.map((step, i) => (
                  <div
                    key={step.stepNumber}
                    data-step={i}
                    data-active={i === 0}
                    className="absolute inset-0 transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[active=false]:scale-110 data-[active=false]:opacity-0"
                  >
                    <Image
                      src={step.image.src}
                      alt={getLocalizedText(step.image.alt, locale)}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 24vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Nodes. */}
              {data.steps.map((step, i) => {
                const { left, top } = nodePos(i, n);
                return (
                  <span
                    key={step.stepNumber}
                    aria-hidden="true"
                    data-step={i}
                    data-lit={i === 0}
                    data-active={i === 0}
                    className="bg-impact-blue data-[lit=true]:border-impact-yellow data-[active=true]:bg-impact-yellow data-[active=true]:text-impact-blue motion-reduce:border-impact-yellow absolute flex size-[24%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-white/25 text-center transition-[background-color,border-color,color,box-shadow,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[active=true]:scale-110 data-[active=true]:shadow-[0_0_0_10px_rgb(244_198_0/0.18),0_0_40px_rgb(244_198_0/0.5)]"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <span className="text-[0.65rem] font-semibold tabular-nums opacity-70 md:text-xs">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-semibold sm:text-sm md:text-lg">
                      {getLocalizedText(step.title, locale)}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Step details, phones. */}
            <div className="grid w-full gap-8 motion-safe:gap-0 lg:hidden">
              {data.steps.map((step, i) => (
                <StepDetails
                  key={step.stepNumber}
                  index={i}
                  step={step}
                  locale={locale}
                />
              ))}
            </div>
          </div>

          <p
            data-closing
            data-shown="false"
            className="text-xl font-medium text-balance text-white transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[shown=false]:translate-y-3 data-[shown=false]:opacity-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 max-lg:!translate-y-0 max-lg:!opacity-100 lg:absolute lg:inset-x-0 lg:bottom-[clamp(1rem,3svh,2rem)] lg:text-center lg:text-[clamp(1rem,2.4svh,1.25rem)]"
          >
            {getLocalizedText(data.closingLine, locale)}
          </p>
        </Container>
      </section>
    </div>
  );
}

/** Number, subtitle and description for one step. With motion, all three
 *  share one grid cell and only the active one shows. */
function StepDetails({
  index,
  step,
  locale,
}: {
  index: number;
  step: OurApproachContent["steps"][number];
  locale: Locale;
}) {
  return (
    <article
      data-step={index}
      data-active={index === 0}
      className="flex flex-col gap-3 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:data-[active=false]:pointer-events-none motion-safe:data-[active=false]:translate-y-4 motion-safe:data-[active=false]:opacity-0"
    >
      <span className="text-sm font-semibold tracking-[0.12em] text-[#ffde75] uppercase tabular-nums">
        {step.stepNumber} — {getLocalizedText(step.title, locale)}
      </span>
      <h3 className="text-2xl leading-snug font-semibold text-balance md:text-3xl lg:text-[clamp(1.375rem,3.4svh,1.875rem)]">
        {getLocalizedText(step.subtitle, locale)}
      </h3>
      <p className="max-w-[56ch] text-base text-pretty text-white/80 lg:text-[clamp(0.9375rem,2svh,1rem)]">
        {getLocalizedText(step.description, locale)}
      </p>
    </article>
  );
}

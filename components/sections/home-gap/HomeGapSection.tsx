"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HomeGapContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "The gap closes": why we exist and what we do, in one section.
 *
 * Desktop: a navy half holds the problem and four gaps; a warm half holds
 * the solution and the four answers. The section pins and each scroll step
 * strikes out a gap and lights its answer while a counter on the seam
 * counts them closed. When all four are closed the navy half narrows, the
 * warm half takes the room and the button lands.
 *
 * Below lg nothing pins: each gap card strikes through and reveals its
 * answer as it scrolls into view. The markup is the finished state, so
 * under prefers-reduced-motion everything simply shows as closed.
 */
export function HomeGapSection({
  data,
  locale,
}: {
  data: HomeGapContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const total = data.pairs.length;
  const counterText = (n: number) =>
    getLocalizedText(data.counter, locale)
      .replace("{n}", String(n))
      .replace("{total}", String(total));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const desk = section.querySelector<HTMLElement>("[data-desk]");
        if (!desk) return;
        const left = desk.querySelector<HTMLElement>("[data-left]");
        const gaps = gsap.utils.toArray<HTMLElement>("[data-gap]", desk);
        const answers = gsap.utils.toArray<HTMLElement>("[data-answer]", desk);
        const button = desk.querySelector<HTMLElement>("[data-button]");
        const counter = counterRef.current;

        gsap.set(
          gaps.map((g) => g.querySelector("[data-strike]")),
          {
            scaleX: 0,
          },
        );
        gsap.set(answers, { opacity: 0.22, x: -28 });
        gsap.set(
          answers.map((a) => a.querySelector("[data-badge]")),
          { backgroundColor: "#fdf0bf", color: "rgb(16 27 98 / 0.4)" },
        );
        gsap.set(button, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (!counter) return;
              const closed = Math.min(
                total,
                Math.floor((self.progress / 0.8) * total + 0.25),
              );
              counter.textContent = counterText(closed);
              counter.dataset.done = String(closed === total);
            },
          },
        });

        gaps.forEach((gap, i) => {
          const at = i;
          tl.to(
            gap.querySelector("[data-strike]"),
            { scaleX: 1, duration: 0.5 },
            at,
          )
            .to(gap, { opacity: 0.4, duration: 0.5 }, at)
            .to(answers[i], { opacity: 1, x: 0, duration: 0.6 }, at + 0.2)
            .to(
              answers[i].querySelector("[data-badge]"),
              { backgroundColor: "#f4c600", color: "#101b62", duration: 0.4 },
              at + 0.25,
            );
        });
        tl.to(
          left,
          { width: "38%", duration: 0.9, ease: "power2.inOut" },
          total + 0.2,
        )
          .to(button, { opacity: 1, y: 0, duration: 0.5 }, total + 0.6)
          .to({}, { duration: 0.4 });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-pair]", section)
          .forEach((pair) => {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: pair, start: "top 80%", once: true },
            });
            tl.from(pair.querySelector("[data-strike]"), {
              scaleX: 0,
              duration: 0.5,
              ease: "power2.out",
            }).from(
              pair.querySelector("[data-answer]"),
              { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" },
              0.25,
            );
          });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
    };
    // counterText depends only on locale and data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, total]);

  const pairs = data.pairs.map((p) => ({
    gap: getLocalizedText(p.gap, locale),
    answer: getLocalizedText(p.answer, locale),
  }));
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-gap-problem"
      className="relative w-full overflow-hidden"
    >
      {/* Desktop. */}
      <div data-desk className="hidden h-[100svh] min-h-[36rem] lg:flex">
        <div
          data-left
          className="bg-impact-blue relative z-10 flex w-1/2 shrink-0 flex-col pt-[calc(var(--header-height)+clamp(1rem,3.5svh,3.5rem))] pr-[clamp(2rem,4vw,4rem)] pb-[clamp(1.25rem,4svh,4rem)] pl-[max(1.5rem,calc((100vw-90rem)/2+1.5rem))] text-white"
        >
          <span className="text-sm font-semibold tracking-[0.14em] text-[#f7886e] uppercase">
            {getLocalizedText(data.problemEyebrow, locale)}
          </span>
          <h2
            id="home-gap-problem"
            className="mt-4 max-w-[18ch] text-[clamp(1.6rem,min(2.9vw,4.9svh),3.25rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance"
          >
            {getLocalizedText(data.problem, locale)}
          </h2>
          <ul className="mt-auto flex flex-col gap-[clamp(0.4rem,1.2svh,0.875rem)] pt-[clamp(1rem,3svh,2rem)]">
            {pairs.map((p, i) => (
              <li
                key={i}
                data-gap
                className="relative flex h-[clamp(2.75rem,6.6svh,4.5rem)] items-center justify-end rounded-[18px] border border-dashed border-white/25 bg-white/[0.05] px-6 text-[clamp(0.95rem,2.2svh,1.3rem)] font-semibold text-white/60"
              >
                <span className="relative">
                  {p.gap}
                  <span
                    data-strike
                    aria-hidden="true"
                    className="absolute inset-x-0 top-1/2 h-[2px] origin-right -translate-y-1/2 rounded-full bg-[#f7886e]"
                  />
                </span>
              </li>
            ))}
          </ul>

          {/* Counter on the seam. */}
          <span
            ref={counterRef}
            aria-hidden="true"
            data-done="true"
            className="bg-impact-yellow text-impact-blue absolute top-1/2 right-0 z-20 translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-4 text-xs font-bold tracking-[0.2em] whitespace-nowrap uppercase shadow-[0_10px_30px_-10px_rgb(244_198_0/0.8)] [writing-mode:vertical-rl] data-[done=true]:shadow-[0_0_0_8px_rgb(244_198_0/0.25),0_10px_30px_-10px_rgb(244_198_0/0.8)]"
          >
            {counterText(total)}
          </span>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col bg-[linear-gradient(160deg,#ffffff_0%,#fff6d6_100%)] pt-[calc(var(--header-height)+clamp(1rem,3.5svh,3.5rem))] pr-[max(1.5rem,calc((100vw-90rem)/2+1.5rem))] pb-[clamp(1.25rem,4svh,4rem)] pl-[clamp(2.5rem,5vw,5rem)]">
          <span className="text-sm font-semibold tracking-[0.14em] text-[#b88d00] uppercase">
            {getLocalizedText(data.solutionEyebrow, locale)}
          </span>
          <p className="text-impact-blue mt-4 max-w-[26ch] text-[clamp(1.6rem,min(2.9vw,4.9svh),3.25rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            {getLocalizedText(data.solution, locale)}
          </p>
          <div className="mt-auto flex flex-col gap-[clamp(0.75rem,2.4svh,1.75rem)] pt-[clamp(1rem,3svh,2rem)]">
            <ul className="flex flex-col gap-[clamp(0.4rem,1.2svh,0.875rem)]">
              {pairs.map((p, i) => (
                <li
                  key={i}
                  data-answer
                  className="text-impact-blue flex h-[clamp(2.75rem,6.6svh,4.5rem)] items-center gap-4 rounded-[18px] bg-white px-5 text-[clamp(0.95rem,2.2svh,1.3rem)] font-semibold shadow-[0_14px_30px_-18px_rgb(16_27_98/0.4)]"
                >
                  <span
                    data-badge
                    aria-hidden="true"
                    className="bg-impact-yellow text-impact-blue inline-flex size-[clamp(1.75rem,4.4svh,2.25rem)] shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums"
                  >
                    {num(i)}
                  </span>
                  {p.answer}
                </li>
              ))}
            </ul>
            <div data-button>
              <Link
                href={data.button.href}
                className="bg-impact-blue focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {getLocalizedText(data.button.label, locale)}
                <ArrowRightIcon weight="bold" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets. */}
      <div className="lg:hidden">
        <div className="bg-impact-blue py-14 text-white md:py-20">
          <Container>
            <span className="text-sm font-semibold tracking-[0.14em] text-[#f7886e] uppercase">
              {getLocalizedText(data.problemEyebrow, locale)}
            </span>
            <p className="mt-4 text-[clamp(1.75rem,6vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance">
              {getLocalizedText(data.problem, locale)}
            </p>
          </Container>
        </div>
        <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fff6d6_100%)] py-14 md:py-20">
          <Container className="flex flex-col gap-8">
            <div>
              <span className="text-sm font-semibold tracking-[0.14em] text-[#b88d00] uppercase">
                {getLocalizedText(data.solutionEyebrow, locale)}
              </span>
              <p className="text-impact-blue mt-4 text-[clamp(1.5rem,5vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance">
                {getLocalizedText(data.solution, locale)}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {pairs.map((p, i) => (
                <li
                  key={i}
                  data-pair
                  className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_14px_30px_-18px_rgb(16_27_98/0.4)]"
                >
                  <span
                    data-gap-text
                    className="text-impact-blue/45 relative w-fit text-sm font-semibold"
                  >
                    {p.gap}
                    <span
                      data-strike
                      aria-hidden="true"
                      className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 rounded-full bg-[#f7886e]"
                    />
                  </span>
                  <span
                    data-answer
                    className="text-impact-blue flex items-center gap-3 text-lg font-semibold"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-impact-yellow inline-flex size-8 shrink-0 items-center justify-center rounded-full"
                    >
                      <CheckIcon weight="bold" className="size-4" />
                    </span>
                    {p.answer}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={data.button.href}
              className="bg-impact-blue focus-visible:outline-impact-blue inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {getLocalizedText(data.button.label, locale)}
              <ArrowRightIcon weight="bold" className="size-4" />
            </Link>
          </Container>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurProgrammesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Card themes, one per programme: brand navy, then the yellow and blue
 * brand gradients from globals.css.
 */
const THEMES = [
  {
    card: "bg-impact-blue text-white",
    tagline: "text-impact-yellow",
    body: "text-white/80",
    number: "[-webkit-text-stroke:2px_rgb(255_255_255/0.22)]",
    pill: "border-white/25 text-white/80",
  },
  {
    card: "bg-[linear-gradient(160deg,#ffeaa7_0%,#ffde75_55%,#f4c600_100%)] text-impact-blue",
    tagline: "text-impact-blue",
    body: "text-impact-blue/80",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.22)]",
    pill: "border-impact-blue/25 text-impact-blue/80",
  },
  {
    card: "bg-[linear-gradient(160deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)] text-impact-blue",
    tagline: "text-impact-blue",
    body: "text-impact-blue/80",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.22)]",
    pill: "border-impact-blue/25 text-impact-blue/80",
  },
];

/**
 * "How we bring this to life": the three programmes as full-width cards
 * that stack on top of each other as you scroll.
 *
 * Each card is `position: sticky`, offset a little lower than the one
 * before, so the earlier cards peek out above like a deck. Scroll-linked
 * (GSAP, scrubbed): as the next card slides over, the one beneath shrinks
 * back and darkens; each card's photo settles from a zoom as it arrives,
 * its giant outlined number drifts, and its title rises out of a mask.
 *
 * Under prefers-reduced-motion the cards still stack (that is layout, not
 * animation) but nothing scales, darkens, zooms or rises.
 */
export function OurProgrammesSection({
  data,
  locale,
}: {
  data: OurProgrammesContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-prog-card]",
        section,
      );

      const rise = (el: Element | null, trigger: Element) => {
        if (!el) return;
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 110 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger, start: "top 75%", once: true },
        });
      };

      rise(headlineRef.current, section);

      cards.forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-prog-inner]");
        const shade = card.querySelector<HTMLElement>("[data-prog-shade]");
        const img = card.querySelector<HTMLElement>("[data-prog-img]");
        const num = card.querySelector<HTMLElement>("[data-prog-num]");
        const next = cards[i + 1];

        rise(card.querySelector("[data-prog-title]"), card);

        // Photo settles from a zoom, number drifts, as the card arrives.
        gsap.fromTo(
          img,
          { scale: 1.25 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 25%",
              scrub: 0.8,
            },
          },
        );
        gsap.fromTo(
          num,
          { yPercent: 40 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 20%",
              scrub: 0.8,
            },
          },
        );

        // Pushed back under the next card: shrink and darken.
        if (next && inner && shade) {
          gsap.to(inner, {
            scale: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 30%",
              scrub: 0.6,
            },
          });
          gsap.to(shade, {
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 30%",
              scrub: 0.6,
            },
          });
        }
      });
    }, section);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="programmes"
      className="py-section relative w-full scroll-mt-[var(--header-height)] bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg text-pretty text-black/70 lg:col-span-4 lg:col-start-9 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        <ol className="mt-14 flex flex-col gap-[14vh] pb-[6vh] lg:mt-20">
          {data.programmes.map((programme, i) => {
            const theme = THEMES[i % THEMES.length];
            return (
              <li
                key={programme.id}
                id={programme.id}
                data-prog-card
                className="sticky scroll-mt-[calc(var(--header-height)+1rem)]"
                style={{
                  top: `calc(var(--header-height) + 1rem + ${i * 1.25}rem)`,
                }}
              >
                <article
                  data-prog-inner
                  className={`relative grid origin-top grid-cols-1 overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgb(16_27_98/0.5)] md:grid-cols-2 lg:min-h-[min(34rem,calc(100svh-var(--header-height)-6rem))] ${theme.card}`}
                >
                  {/* Text */}
                  <div className="relative z-10 order-2 flex flex-col justify-between gap-8 p-7 md:order-1 md:p-10 lg:p-14">
                    <span
                      data-prog-num
                      aria-hidden="true"
                      className={`pointer-events-none absolute -top-4 right-2 text-[7rem] leading-none font-black text-transparent tabular-nums select-none md:-top-8 md:right-4 md:text-[11rem] ${theme.number}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold tracking-wide tabular-nums ${theme.pill}`}
                    >
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(data.programmes.length).padStart(2, "0")}
                    </span>
                    <div className="relative flex flex-col gap-4">
                      <h3
                        data-prog-title
                        className="text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance"
                      >
                        {getLocalizedText(programme.title, locale)}
                      </h3>
                      <p
                        className={`text-xl leading-snug font-semibold text-pretty ${theme.tagline}`}
                      >
                        {getLocalizedText(programme.tagline, locale)}
                      </p>
                      <p
                        className={`max-w-[42ch] text-base text-pretty ${theme.body}`}
                      >
                        {getLocalizedText(programme.description, locale)}
                      </p>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="relative order-1 aspect-[16/10] overflow-hidden md:order-2 md:aspect-auto">
                    <div data-prog-img className="absolute inset-0">
                      <Image
                        src={programme.image.src}
                        alt={getLocalizedText(programme.image.alt, locale)}
                        fill
                        quality={90}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Darkens as the next card covers this one. */}
                  <div
                    data-prog-shade
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 bg-[#070c2e] opacity-0"
                  />
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

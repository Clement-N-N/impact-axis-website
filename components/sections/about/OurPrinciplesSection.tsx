"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurPrinciplesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** One look per pillar: the yellow, blue and peach brand gradients, then a
 *  white pillar so the row ends on a light note. */
const PILLARS = [
  {
    bg: "bg-[linear-gradient(180deg,#ffeaa7_0%,#ffde75_45%,#f4c600_100%)]",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.28)]",
  },
  {
    bg: "bg-[linear-gradient(180deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)]",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.28)]",
  },
  {
    bg: "bg-[linear-gradient(180deg,#ffe0d6_0%,#fab1a0_50%,#f7886e_100%)]",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.28)]",
  },
  {
    bg: "bg-white outline outline-[1.5px] -outline-offset-[1.5px] outline-[#e3e6f2]",
    number: "[-webkit-text-stroke:2px_rgb(16_27_98/0.2)]",
  },
];

/**
 * Our Principles as "pillars holding the beam".
 *
 * The heading sits on a navy beam; the four principles are pillars standing
 * beneath it. As the section scrolls in, the pillars rise out of the ground
 * one after another, each settling against the beam, which gives a slight
 * dip as it takes the weight. With all four up, a line lands on the beam:
 * "Four principles hold up everything we do."
 *
 * Phones stack the pillars and raise each one as it reaches the viewport.
 * Under prefers-reduced-motion everything renders in its final state.
 */
export function OurPrinciplesSection({
  data,
  locale,
}: {
  data: OurPrinciplesContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const beam = section.querySelector<HTMLElement>("[data-beam]");
      const line = section.querySelector<HTMLElement>("[data-beam-line]");
      const pillars = gsap.utils.toArray<HTMLElement>("[data-pillar]");

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

      mm.add("(min-width: 768px)", () => {
        gsap.set(pillars, { yPercent: 104 });
        gsap.set(line, { opacity: 0, y: 12 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pillars[0]?.parentElement ?? section,
            start: "top 80%",
            once: true,
          },
        });
        pillars.forEach((p, i) => {
          const at = i * 0.28;
          tl.to(p, { yPercent: 0, duration: 0.95, ease: "back.out(1.15)" }, at);
          // The beam takes the weight as each pillar meets it.
          if (beam)
            tl.fromTo(
              beam,
              { y: 0 },
              {
                y: 5,
                duration: 0.12,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
              },
              at + 0.55,
            );
        });
        if (line)
          tl.to(line, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      });

      mm.add("(max-width: 767px)", () => {
        pillars.forEach((p) =>
          gsap.from(p, {
            yPercent: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: p, start: "top 88%", once: true },
          }),
        );
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-principles-title"
      className="py-section w-full bg-[linear-gradient(180deg,#ffffff_0%,#f4f6fc_100%)]"
    >
      <Container>
        {/* The beam. */}
        <div
          data-beam
          className="bg-impact-blue relative z-10 flex flex-col gap-6 rounded-[28px] px-6 py-8 text-white shadow-[0_30px_60px_-30px_rgb(16_27_98/0.7)] md:flex-row md:items-end md:justify-between md:rounded-[32px] md:px-10 md:py-10"
        >
          <div className="flex flex-col items-start gap-4">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="our-principles-title"
              ref={headlineRef}
              className="text-5xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p
            data-beam-line
            className="max-w-[30ch] text-base text-pretty text-white/70 md:pb-2 md:text-right md:text-lg"
          >
            {getLocalizedText(data.beamLine, locale)}
          </p>
        </div>

        {/* The pillars. Clipped at the bottom only, so they rise out of the
            "ground" while their shadows still show at the sides. */}
        <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 md:[clip-path:inset(-4rem_-4rem_0_-4rem)] lg:grid-cols-4">
          {data.principles.map((principle, i) => {
            const look = PILLARS[i % PILLARS.length];
            return (
              <li key={i} data-pillar className="flex">
                <article
                  className={`text-impact-blue group flex w-full flex-col gap-10 rounded-[12px_12px_28px_28px] p-7 transition-[translate,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgb(16_27_98/0.5)] hover:saturate-[1.15] md:min-h-[24rem] md:p-8 lg:min-h-[clamp(24rem,52svh,32rem)] ${look.bg}`}
                >
                  <span
                    aria-hidden="true"
                    className={`text-[4.5rem] leading-[0.8] font-extrabold text-transparent tabular-nums md:text-[5.5rem] ${look.number}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-auto flex flex-col gap-3">
                    <h3 className="text-[1.625rem] leading-tight font-semibold tracking-[-0.02em] text-balance">
                      {getLocalizedText(principle.title, locale)}
                    </h3>
                    <p className="text-impact-blue/80 text-base text-pretty">
                      {getLocalizedText(principle.description, locale)}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

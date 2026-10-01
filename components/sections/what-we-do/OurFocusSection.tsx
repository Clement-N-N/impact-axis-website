"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurFocusContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** Resting offsets for photos underneath the top card: a fanned hand. */
const FAN = [
  { rotation: -2, x: 0, y: 0 },
  { rotation: 4, x: 18, y: 10 },
  { rotation: -6, x: -16, y: 18 },
  { rotation: 8, x: 22, y: 26 },
];

/**
 * "Our Focus" as a scroll story.
 *
 * Desktop: the heading, a 01–04 counter and a fanned photo stack stay
 * pinned on the left while the four focus areas scroll past on the right.
 * As each area reaches the middle of the screen it becomes active: the top
 * photo is dealt away to reveal the next, the counter ticks over, the other
 * areas dim, and a yellow progress rail fills. The first area's skills pop
 * in as chips.
 *
 * Mobile: nothing is pinned; each area shows its own photo and rises in as
 * it scrolls into view. Under prefers-reduced-motion everything renders in
 * its final state.
 */
export function OurFocusSection({
  data,
  locale,
}: {
  data: OurFocusContent;
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
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", section);
      const popChips = () =>
        gsap.to(chips, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2.4)",
          stagger: 0.07,
          overwrite: true,
        });
      gsap.set(chips, { scale: 0.4, opacity: 0 });

      // Heading: lines rise out of their masks as the section arrives.
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
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }

      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-stack-card]",
          section,
        );
        const items = gsap.utils.toArray<HTMLElement>("[data-area]", section);
        const digits = gsap.utils.toArray<HTMLElement>("[data-digit]", section);
        const fill = section.querySelector<HTMLElement>("[data-rail-fill]");
        let active = -1;

        const show = (current: number, instant = false) => {
          const d = instant ? 0 : 1;
          cards.forEach((card, i) => {
            const depth = i - current; // 0 top, >0 underneath, <0 dealt away
            const vars =
              depth < 0
                ? { x: "-125%", y: -40, rotation: -24, opacity: 0, scale: 0.96 }
                : {
                    ...FAN[Math.min(depth, FAN.length - 1)],
                    opacity: 1,
                    scale: 1 - depth * 0.04,
                  };
            gsap.to(card, {
              ...vars,
              zIndex: 10 - depth,
              duration: 0.9 * d,
              ease: "expo.out",
              overwrite: true,
            });
          });
          digits.forEach((digit, i) =>
            gsap.to(digit, {
              yPercent: (i - current) * 100,
              duration: 0.6 * d,
              ease: "power3.out",
              overwrite: true,
            }),
          );
          items.forEach((item, i) =>
            gsap.to(item, {
              opacity: i === current ? 1 : 0.28,
              duration: 0.4 * d,
              overwrite: true,
            }),
          );
        };

        show(0, true);
        active = 0;
        ScrollTrigger.create({
          trigger: items[0],
          start: "top 70%",
          once: true,
          onEnter: popChips,
        });

        items.forEach((item, i) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive && active !== i) {
                active = i;
                show(i);
              }
            },
          }),
        );

        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: items[0],
              start: "top 55%",
              endTrigger: items[items.length - 1],
              end: "bottom 55%",
              scrub: 0.6,
            },
          },
        );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-area]", section)
          .forEach((item) => {
            gsap.from(item, {
              y: 40,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%", once: true },
            });
          });
        const first = section.querySelector("[data-area]");
        if (first)
          ScrollTrigger.create({
            trigger: first,
            start: "top 60%",
            once: true,
            onEnter: popChips,
          });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, []);

  const total = String(data.areas.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="focus"
      className="py-section relative w-full scroll-mt-[var(--header-height)] bg-white"
    >
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Pinned column (desktop): heading, counter and photo stack. */}
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
            <span className="bg-impact-yellow w-fit rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              ref={headlineRef}
              className="text-impact-blue text-4xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
            <p className="max-w-[44ch] text-base text-pretty text-black/70">
              {getLocalizedText(data.intro, locale)}
            </p>

            <div aria-hidden="true" className="relative mt-4 hidden lg:block">
              <div className="text-impact-blue absolute -top-2 right-0 z-20 flex items-baseline gap-1 font-semibold tabular-nums">
                <span className="relative inline-block h-[1em] overflow-hidden text-6xl leading-none">
                  <span className="invisible">00</span>
                  {data.areas.map((_, i) => (
                    <span key={i} data-digit className="absolute inset-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  ))}
                </span>
                <span className="text-xl text-black/30">/{total}</span>
              </div>
              <div className="relative mt-16 aspect-[4/3] w-[86%]">
                {data.areas.map((area, i) => (
                  <div
                    key={i}
                    data-stack-card
                    className="absolute inset-0 overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_20px_40px_-20px_rgb(16_27_98/0.45)] outline outline-1 -outline-offset-1 outline-black/10"
                    style={{ zIndex: 10 - i }}
                  >
                    <Image
                      src={area.image.src}
                      alt=""
                      fill
                      quality={90}
                      sizes="(min-width: 1536px) 560px, 36vw"
                      style={{ objectPosition: area.imagePosition ?? "center" }}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The four areas, with a progress rail on desktop. */}
        <div className="relative lg:col-span-7 lg:pt-6">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 hidden w-[3px] rounded-full bg-black/5 lg:block"
          >
            <div
              data-rail-fill
              className="bg-impact-yellow h-full w-full origin-top rounded-full"
            />
          </div>
          <ol className="flex flex-col gap-14 lg:gap-0 lg:pl-12">
            {data.areas.map((area, i) => (
              <li
                key={i}
                data-area
                className="flex flex-col gap-4 lg:min-h-[60vh] lg:justify-center"
              >
                {/* Mobile photo (desktop uses the pinned stack). */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] outline outline-1 -outline-offset-1 outline-black/10 lg:hidden">
                  <Image
                    src={area.image.src}
                    alt={getLocalizedText(area.image.alt, locale)}
                    fill
                    quality={90}
                    sizes="100vw"
                    style={{ objectPosition: area.imagePosition ?? "center" }}
                    className="object-cover"
                  />
                </div>
                <span className="text-impact-blue text-sm font-semibold tabular-nums lg:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-impact-blue text-3xl leading-tight font-semibold text-balance">
                  {getLocalizedText(area.title, locale)}
                </h3>
                <p className="max-w-[52ch] text-lg text-pretty text-black/75">
                  {getLocalizedText(area.description, locale)}
                </p>
                {area.chips && (
                  <ul className="flex max-w-[52ch] flex-wrap gap-2">
                    {area.chips.map((chip, c) => (
                      <li
                        key={c}
                        data-chip
                        className="border-impact-blue/15 bg-impact-blue/[0.04] text-impact-blue rounded-full border px-4 py-2 text-sm font-medium"
                      >
                        {getLocalizedText(chip, locale)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

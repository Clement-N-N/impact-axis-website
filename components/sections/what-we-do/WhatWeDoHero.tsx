"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { WhatWeDoDirection, WhatWeDoHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const YELLOW = "#f4c600"; // impact-yellow

/** Card backgrounds: the brand gradient tokens from globals.css. */
const CARD_BG = [
  "bg-[linear-gradient(180deg,#ffeaa7_0%,#ffde75_100%)]", // --gradient-yellow
  "bg-[linear-gradient(180deg,#fab1a0_0%,#f7886e_100%)]", // --gradient-peach
  "bg-[linear-gradient(180deg,#a9d3ff_0%,#74b9ff_100%)]", // --gradient-blue, lightened
];

/** Rounded quadrilateral with a slanted left edge, as in the design. */
const PHOTO_SHAPE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M14 0 H90 Q100 0 100 10 V90 Q100 100 90 100 H34 Q26 100 23 93 L1 12 Q-1 0 14 0 Z" fill="black"/></svg>',
)}")`;

/**
 * What We Do hero: headline and intro over three colour-blocked
 * "directions" cards, with brand-yellow curves sweeping behind.
 *
 * Entrance (on load, it is the top of the page):
 *   1. the curves draw themselves in;
 *   2. the headline rises line by line out of a mask, the intro follows;
 *   3. the cards are dealt in like a fanned hand: each drops in tilted and
 *      lands flat, one after another;
 *   4. each photo wipes up inside its slanted frame as its card lands;
 *   5. the arrow buttons spin in.
 * On scroll (desktop), the three cards drift at slightly different rates,
 * and the curves at a slower one, for depth. On hover, a card lifts, its
 * photo zooms and the arrow turns navy (CSS, so it is interruptible).
 *
 * Under prefers-reduced-motion everything renders in its final state.
 * Below lg the cards become a swipeable row with a scroll progress bar.
 */
export function WhatWeDoHero({
  data,
  locale,
}: {
  data: WhatWeDoHeroContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const curvesRef = useRef<SVGSVGElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Mobile/tablet: scroll progress bar under the swipeable row.
  useEffect(() => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;
    const update = () => {
      const visible = row.clientWidth / row.scrollWidth;
      const max = row.scrollWidth - row.clientWidth;
      const progress = max > 0 ? row.scrollLeft / max : 0;
      bar.style.width = `${Math.min(1, visible) * 100}%`;
      bar.style.transform = `translateX(${progress * (1 / visible - 1) * 100}%)`;
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let split: SplitText | undefined;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(
        "path",
        curvesRef.current,
      );
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);
      const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", section);
      const photoImgs = gsap.utils.toArray<HTMLElement>(
        "[data-photo-img]",
        section,
      );
      const arrows = gsap.utils.toArray<HTMLElement>("[data-arrow]", section);
      const tilts = [-7, 2.5, 8];

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1. Curves draw in (pathLength=1000, see markup).
      gsap.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "power2.inOut",
          stagger: 0.25,
        },
        0,
      );

      // 2. Headline lines rise out of their masks; the intro follows.
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(split.lines, { yPercent: 110 });
        tl.to(
          split.lines,
          { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 },
          0.15,
        );
      }
      gsap.set(introRef.current, { opacity: 0, y: 20 });
      tl.to(
        introRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.55,
      );

      // 3. Cards dealt in, tilted, landing flat.
      cards.forEach((card, i) =>
        gsap.set(card, {
          y: 140,
          rotation: tilts[i] ?? 0,
          scale: 0.9,
          opacity: 0,
          transformOrigin: "50% 100%",
        }),
      );
      tl.to(
        cards,
        {
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.3,
          stagger: 0.14,
        },
        0.6,
      );

      // 4. Photos wipe up inside their frames as each card lands.
      gsap.set(photos, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(photoImgs, { scale: 1.35 });
      tl.to(
        photos,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          stagger: 0.14,
        },
        0.95,
      );
      tl.to(photoImgs, { scale: 1, duration: 1.6, stagger: 0.14 }, 0.95);

      // 5. Arrow buttons spin in.
      gsap.set(arrows, { scale: 0, rotation: -120 });
      tl.to(
        arrows,
        {
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: 0.14,
        },
        1.35,
      );

      // Desktop: depth on scroll.
      mm.add("(min-width: 1024px)", () => {
        const rates = [-4, -9, -6];
        cards.forEach((card, i) =>
          gsap.to(card, {
            yPercent: rates[i] ?? -5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          }),
        );
        gsap.to(curvesRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-white pt-16 pb-14 lg:pt-24 lg:pb-20"
    >
      {/* Curves run through the open gap between headline and intro, then
          slip behind the cards; they never cross text. */}
      <svg
        ref={curvesRef}
        aria-hidden="true"
        viewBox="0 0 400 640"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-[57%] -z-10 hidden h-[34rem] w-[10%] lg:block"
      >
        <path
          pathLength={1000}
          d="M60 -20 C 260 120, 330 320, 300 660"
          stroke={YELLOW}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          pathLength={1000}
          d="M380 -20 C 200 140, 40 260, 90 360 C 130 440, 260 420, 250 340 C 240 270, 120 300, 110 420 C 100 520, 160 600, 200 660"
          stroke={YELLOW}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1
            ref={headlineRef}
            className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance lg:col-span-7"
          >
            {getLocalizedText(data.headline, locale)}
          </h1>
          <p
            ref={introRef}
            className="max-w-[40ch] text-base text-pretty text-black/75 lg:col-span-4 lg:col-start-9 lg:pb-2"
          >
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        <div
          ref={rowRef}
          className="-mx-6 mt-12 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-6 pt-2 pb-4 md:-mx-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {data.directions.map((direction, i) => (
            <DirectionCard
              key={direction.href}
              direction={direction}
              index={i}
              locale={locale}
            />
          ))}
        </div>

        {/* Scroll progress for the swipeable row (below lg). */}
        <div
          aria-hidden="true"
          className="mx-auto mt-6 h-1.5 w-full max-w-3xl overflow-hidden rounded-full bg-black/5 lg:hidden"
        >
          <div
            ref={barRef}
            className="bg-impact-blue h-full w-1/3 rounded-full"
          />
        </div>
      </Container>
    </section>
  );
}

function DirectionCard({
  direction,
  index,
  locale,
}: {
  direction: WhatWeDoDirection;
  index: number;
  locale: Locale;
}) {
  // The middle card flips its layout (text on top), as in the design.
  const textTop = index === 1;
  const number = String(index + 1).padStart(2, "0");

  const text = (
    <div>
      <span className="text-impact-blue mb-3 inline-block rounded-full border border-current px-2.5 py-0.5 text-xs font-semibold tabular-nums">
        {number}
      </span>
      <h2 className="text-impact-blue text-2xl leading-tight font-semibold">
        {getLocalizedText(direction.title, locale)}
      </h2>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-pretty text-black/75">
        {getLocalizedText(direction.body, locale)}
      </p>
    </div>
  );

  const arrow = (
    <span
      data-arrow
      className="text-impact-blue group-hover:bg-impact-blue grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-[background-color,color] duration-200 group-hover:text-white"
    >
      <ArrowUpRight
        aria-hidden="true"
        strokeWidth={2}
        className="size-5 transition-[rotate] duration-200 ease-out group-hover:rotate-45 motion-reduce:transition-none"
      />
    </span>
  );

  const photo = (
    <div
      className="relative aspect-[4/3] w-[54%] shrink-0"
      style={{
        maskImage: PHOTO_SHAPE,
        WebkitMaskImage: PHOTO_SHAPE,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    >
      <div data-photo className="absolute inset-0 overflow-hidden">
        <div data-photo-img className="absolute inset-0">
          <Image
            src={direction.image.src}
            alt={getLocalizedText(direction.image.alt, locale)}
            fill
            preload={index === 0}
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 32vw, 48vw"
            className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-[1.07] motion-reduce:transition-none"
          />
        </div>
      </div>
    </div>
  );

  const className = `group relative flex min-h-[20rem] w-[86%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[32px] p-6 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgb(16_27_98/0.45)] focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-4 sm:w-[60%] lg:w-auto motion-reduce:hover:translate-y-0 ${CARD_BG[index] ?? CARD_BG[0]}`;

  const content = textTop ? (
    <>
      {text}
      <div className="mt-6 flex items-end justify-between gap-4">
        {arrow}
        {photo}
      </div>
    </>
  ) : (
    <>
      <div className="flex items-start justify-between gap-4">
        {arrow}
        {photo}
      </div>
      <div className="mt-6">{text}</div>
    </>
  );

  // In-page anchors are plain links; routes go through the locale-aware Link.
  return direction.href.startsWith("#") ? (
    <a data-card href={direction.href} className={className}>
      {content}
    </a>
  ) : (
    <Link data-card href={direction.href} className={className}>
      {content}
    </Link>
  );
}

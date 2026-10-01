"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { PhotoStripContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Where the framing photos sit around the window at rest, and which way each
 * one drifts as the window opens (-1 left, 1 right). Whole class names so
 * Tailwind can see them.
 */
const FRAMES = [
  {
    pos: "left-[3%] top-[16%] w-[30vw] aspect-[3/4] md:w-[17vw]",
    dir: -1,
    tilt: -4,
  },
  {
    pos: "left-[9%] bottom-[9%] w-[34vw] aspect-[4/3] md:w-[15vw]",
    dir: -1,
    tilt: 3,
  },
  {
    pos: "right-[4%] top-[11%] w-[34vw] aspect-[4/3] md:w-[16vw]",
    dir: 1,
    tilt: 3,
  },
  {
    pos: "right-[8%] bottom-[12%] w-[30vw] aspect-[3/4] md:w-[17vw]",
    dir: 1,
    tilt: -3,
  },
];

/**
 * The transition from Mission & Vision into Our Approach: "the window".
 *
 * A small, rounded photo sits in the middle of the screen, framed by four
 * more photos like a pinned-up collage. The scene sticks while you scroll:
 * the window opens out to a full-bleed photo (settling from a zoom), the
 * framing photos drift off to the sides and fade, the image darkens at the
 * foot, and "Talent, put to work." rises in over it with a cue down into
 * Our Approach.
 *
 * Under prefers-reduced-motion the scene doesn't stick and shows its final
 * state: the full-bleed photo with the headline.
 */
export function PhotoStrip({
  data,
  locale,
}: {
  data: PhotoStripContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [hero, ...frames] = data.images;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const mm = gsap.matchMedia();

    // One frame's delay keeps this trigger out of the other sections' first
    // refresh (see the note that used to live here: building a ScrollTrigger
    // mid-refresh throws inside ScrollTrigger.init).
    const frame = requestAnimationFrame(() => {
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };
          const win = section.querySelector<HTMLElement>("[data-window]");
          const img = section.querySelector<HTMLElement>("[data-window-img]");
          const shade = section.querySelector<HTMLElement>("[data-shade]");
          const copy = section.querySelector<HTMLElement>("[data-copy]");
          const tiles = gsap.utils.toArray<HTMLElement>(
            "[data-frame]",
            section,
          );
          if (!win || !img || !shade || !copy || !headlineRef.current) return;

          split = SplitText.create(headlineRef.current, {
            type: "lines",
            mask: "lines",
          });

          const closed = desktop
            ? "inset(24% 31% 24% 31% round 28px)"
            : "inset(30% 14% 30% 14% round 22px)";
          gsap.set(win, { clipPath: closed });
          gsap.set(img, { scale: 1.3 });
          gsap.set(shade, { opacity: 0 });
          gsap.set(split.lines, { yPercent: 110 });
          gsap.set(copy.querySelectorAll("[data-fade]"), {
            opacity: 0,
            y: 16,
          });
          tiles.forEach((t, i) =>
            gsap.set(t, { rotation: FRAMES[i % FRAMES.length].tilt }),
          );

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          });

          tl.to(
            win,
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              duration: 1,
              ease: "power2.inOut",
            },
            0,
          )
            .to(img, { scale: 1, duration: 1.2, ease: "power2.out" }, 0)
            .to(
              tiles,
              {
                x: (i) =>
                  FRAMES[i % FRAMES.length].dir * window.innerWidth * 0.35,
                y: (i) => (i % 2 ? 60 : -60),
                rotation: (i) => FRAMES[i % FRAMES.length].tilt * 3,
                scale: 0.85,
                opacity: 0,
                duration: 0.8,
                ease: "power2.in",
              },
              0.05,
            )
            .to(shade, { opacity: 1, duration: 0.5 }, 0.7)
            .to(
              split.lines,
              {
                yPercent: 0,
                duration: 0.45,
                stagger: 0.12,
                ease: "power3.out",
              },
              0.85,
            )
            .to(
              copy.querySelectorAll("[data-fade]"),
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.1,
                ease: "power2.out",
              },
              1.05,
            )
            .to({}, { duration: 0.4 }); // hold on the finished frame
        },
      );
    });

    return () => {
      cancelAnimationFrame(frame);
      mm.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="photo-strip-headline"
      className="relative w-full bg-white motion-safe:h-[230svh] md:motion-safe:h-[260svh]"
    >
      <div className="relative h-[85svh] overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh]">
        {/* Framing photos (decorative; the window photo carries the alt). */}
        <div aria-hidden="true" className="motion-reduce:hidden">
          {frames.map((image, i) => (
            <div
              key={image.src}
              data-frame
              className={`absolute overflow-hidden rounded-[18px] shadow-[0_24px_48px_-24px_rgb(16_27_98/0.45)] outline outline-1 -outline-offset-1 outline-black/10 md:rounded-[24px] ${
                FRAMES[i % FRAMES.length].pos
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                quality={90}
                sizes="(min-width: 768px) 18vw, 34vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* The window: opens from a rounded card to full bleed. */}
        <div data-window className="absolute inset-0 overflow-hidden">
          <div data-window-img className="absolute inset-0">
            <Image
              src={hero.src}
              alt={getLocalizedText(hero.alt, locale)}
              fill
              quality={90}
              // Cover on a tall phone screen needs the photo ~1.7x the viewport height wide.
              sizes="(orientation: portrait) 170vh, 100vw"
              className="object-cover"
            />
          </div>
          <div
            data-shade
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.85)_0%,rgb(7_12_46/0.45)_40%,transparent_75%)]"
          />
        </div>

        <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-10 md:pb-16">
          <div data-copy className="flex flex-col items-start gap-5 md:gap-6">
            <span
              data-fade
              className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black"
            >
              {getLocalizedText(data.kicker, locale)}
            </span>
            <h2
              id="photo-strip-headline"
              ref={headlineRef}
              className="text-[clamp(2.75rem,8vw,8.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-white"
            >
              {getLocalizedText(data.headlineLead, locale)}{" "}
              <span className="text-impact-yellow">
                {getLocalizedText(data.headlineAccent, locale)}
              </span>
            </h2>
            <span
              data-fade
              aria-hidden="true"
              className="inline-flex size-12 animate-bounce items-center justify-center rounded-full border border-white/40 text-white motion-reduce:animate-none"
            >
              <ArrowDownIcon weight="bold" className="size-5" />
            </span>
          </div>
        </Container>
      </div>
    </section>
  );
}

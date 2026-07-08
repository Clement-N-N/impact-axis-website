"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Image from "next/image";
import clsx from "clsx";
import { ICON_MORPH_CYCLE, ICON_MORPH_PATHS, type HeadlineIconName } from "./icon-morph-paths";

export type { HeadlineIconName };

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

export type ChipColor =
  | "impact-yellow"
  | "impact-blue"
  | "icon-blue"
  | "icon-green"
  | "icon-peach"
  | "icon-purple"
  | "black"
  | "white";

const CHIP_COLOR_STYLES: Record<ChipColor, string> = {
  "impact-yellow": "bg-impact-yellow text-black",
  "impact-blue": "bg-impact-blue text-white",
  "icon-blue": "bg-icon-blue text-white",
  "icon-green": "bg-icon-green text-white",
  "icon-peach": "bg-icon-peach text-white",
  "icon-purple": "bg-icon-purple text-white",
  black: "bg-black text-white",
  white: "bg-white text-black",
};

export type HeadlineSegment =
  | { text: string }
  | { text: string; emphasis: true }
  | { chip: "icon"; icons: HeadlineIconName[]; color: ChipColor; width?: string; height?: string }
  | { chip: "icon-static"; icons: HeadlineIconName[]; color: ChipColor; width?: string; height?: string }
  | { chip: "image"; src: string | string[]; width?: string; height?: string };

const DEFAULT_CHIP_SIZE = "1.3em";
const IMAGE_INTERVAL_MS = 3000;

const ICON_HOLD_DURATION = 1.6;
const ICON_MORPH_DURATION = 1.0;

function useIconMorphCycle(pathRef: React.RefObject<SVGPathElement | null>, startIndex: number) {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    for (let step = 0; step < ICON_MORPH_CYCLE.length; step++) {
      const target = ICON_MORPH_CYCLE[(startIndex + step + 1) % ICON_MORPH_CYCLE.length];
      tl.to(pathRef.current, {
        morphSVG: { shape: ICON_MORPH_PATHS[target], map: "complexity", type: "rotational" },
        duration: ICON_MORPH_DURATION,
        ease: "power2.inOut",
      }, `+=${ICON_HOLD_DURATION}`);
    }

    return () => {
      tl.kill();
    };
  }, [pathRef, startIndex]);
}

function IconChip({
  icons,
  color,
  width = DEFAULT_CHIP_SIZE,
  height = DEFAULT_CHIP_SIZE,
}: {
  icons: HeadlineIconName[];
  color: ChipColor;
  width?: string;
  height?: string;
}) {
  const chipRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const startIndex = Math.max(ICON_MORPH_CYCLE.indexOf(icons[0]), 0);

  useEffect(() => {
    const morph = gsap.to(chipRef.current, {
      borderRadius: "50%",
      rotate: 20,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      morph.kill();
    };
  }, []);

  useIconMorphCycle(pathRef, startIndex);

  return (
    <span
      ref={chipRef}
      className={clsx(
        "relative ml-3 inline-flex shrink-0 items-center justify-center rounded-[28%] align-middle",
        CHIP_COLOR_STYLES[color],
      )}
      style={{ width, height }}
    >
      <svg viewBox="0 0 32 32" className="h-full w-full p-[22%]" fill="currentColor" aria-hidden="true">
        <path ref={pathRef} d={ICON_MORPH_PATHS[ICON_MORPH_CYCLE[startIndex]]} />
      </svg>
    </span>
  );
}

function StaticIconChip({
  icons,
  color,
  width = DEFAULT_CHIP_SIZE,
  height = DEFAULT_CHIP_SIZE,
}: {
  icons: HeadlineIconName[];
  color: ChipColor;
  width?: string;
  height?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const startIndex = Math.max(ICON_MORPH_CYCLE.indexOf(icons[0]), 0);

  useIconMorphCycle(pathRef, startIndex);

  return (
    <span
      className={clsx(
        "relative mx-1 inline-flex shrink-0 items-center justify-center rounded-[4vw] align-middle",
        CHIP_COLOR_STYLES[color],
      )}
      style={{ width, height }}
    >
      <svg viewBox="0 0 32 32" className="h-full w-full p-[16%]" fill="currentColor" aria-hidden="true">
        <path ref={pathRef} d={ICON_MORPH_PATHS[ICON_MORPH_CYCLE[startIndex]]} />
      </svg>
    </span>
  );
}

function ImageChip({
  src,
  width,
  height,
}: {
  src: string | string[];
  width?: string;
  height?: string;
}) {
  const images = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, IMAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <span
      className="relative mx-1 inline-block shrink-0 overflow-hidden rounded-[4vw] align-middle"
      style={{ width, height }}
    >
      <Image src={images[index]} alt="" fill className="object-cover" />
    </span>
  );
}

export function HeadlineWithIcons({
  segments,
}: {
  segments: HeadlineSegment[];
}) {
  return (
    <>
      {segments.map((segment, index) => {
        if ("chip" in segment) {
          if (segment.chip === "icon") {
            return (
              <IconChip
                key={index}
                icons={segment.icons}
                color={segment.color}
                width={segment.width}
                height={segment.height}
              />
            );
          }
          if (segment.chip === "icon-static") {
            return (
              <StaticIconChip
                key={index}
                icons={segment.icons}
                color={segment.color}
                width={segment.width}
                height={segment.height}
              />
            );
          }
          return (
            <ImageChip
              key={index}
              src={segment.src}
              width={segment.width}
              height={segment.height}
            />
          );
        }
        if ("emphasis" in segment) {
          return (
            <span key={index} className="font-normal italic">
              {segment.text}
            </span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </>
  );
}

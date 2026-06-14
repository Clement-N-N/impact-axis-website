"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import clsx from "clsx";
import {
  EcosystemIcon,
  FundersIcon,
  PartnersIcon,
  TalentedIcon,
} from "@/components/icons";

const ICONS = {
  partners: PartnersIcon,
  funders: FundersIcon,
  ecosystem: EcosystemIcon,
  talented: TalentedIcon,
} as const;

export type HeadlineIconName = keyof typeof ICONS;

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
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const morph = gsap.to(chipRef.current, {
      borderRadius: "50%",
      rotate: 20,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    let cycle: gsap.core.Timeline | undefined;
    if (icons.length > 1) {
      gsap.set(iconRefs.current.slice(1), { opacity: 0, scale: 0.6 });
      cycle = gsap.timeline({ repeat: -1 });
      iconRefs.current.forEach((_, index) => {
        const next = iconRefs.current[(index + 1) % icons.length];
        const current = iconRefs.current[index];
        cycle!
          .to(current, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.inOut" }, `+=1`)
          .to(next, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.inOut" }, "<");
      });
    }

    return () => {
      morph.kill();
      cycle?.kill();
    };
  }, [icons]);

  return (
    <span
      ref={chipRef}
      className={clsx(
        "relative ml-3 inline-flex shrink-0 items-center justify-center rounded-[28%] align-middle",
        CHIP_COLOR_STYLES[color],
      )}
      style={{ width, height }}
    >
      {icons.map((name, index) => {
        const Icon = ICONS[name];
        return (
          <span
            key={name}
            ref={(el) => {
              iconRefs.current[index] = el;
            }}
            className="absolute inset-0 flex items-center justify-center p-[22%]"
          >
            <Icon className="h-full w-full" />
          </span>
        );
      })}
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
  const wrapperRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wiggles = iconRefs.current.map((el) =>
      el
        ? gsap.to(el, {
            rotate: 15,
            scale: 1.12,
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        : undefined,
    );

    let cycle: gsap.core.Timeline | undefined;
    if (icons.length > 1) {
      gsap.set(wrapperRefs.current.slice(1), { opacity: 0, scale: 0.6 });
      cycle = gsap.timeline({ repeat: -1 });
      wrapperRefs.current.forEach((_, index) => {
        const next = wrapperRefs.current[(index + 1) % icons.length];
        const current = wrapperRefs.current[index];
        cycle!
          .to(current, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.inOut" }, `+=1`)
          .to(next, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.inOut" }, "<");
      });
    }

    return () => {
      wiggles.forEach((wiggle) => wiggle?.kill());
      cycle?.kill();
    };
  }, [icons]);

  return (
    <span
      className={clsx(
        "relative mx-1 inline-flex shrink-0 items-center justify-center rounded-[4vw] align-middle",
        CHIP_COLOR_STYLES[color],
      )}
      style={{ width, height }}
    >
      {icons.map((name, index) => {
        const Icon = ICONS[name];
        return (
          <span
            key={name}
            ref={(el) => {
              wrapperRefs.current[index] = el;
            }}
            className="absolute inset-0 flex items-center justify-center p-[16%]"
          >
            <span
              ref={(el) => {
                iconRefs.current[index] = el;
              }}
              className="inline-block h-full w-full"
            >
              <Icon className="h-full w-full" />
            </span>
          </span>
        );
      })}
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

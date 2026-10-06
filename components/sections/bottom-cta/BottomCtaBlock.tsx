"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { bottomCtaChrome } from "./data";
import type { BottomCtaBlock as BottomCtaBlockData } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Closing call to action: a compact navy band (one line, one promise, one
 * button) instead of a full-width photo banner. The photo shrinks to a round
 * thumbnail beside the headline. On scroll the band opens from a slightly
 * inset clip, the headline lines rise and the thumbnail pops; reduced motion
 * shows it all at rest. Buttons never animate in.
 */
export function BottomCtaBlock({ block, locale }: { block: BottomCtaBlockData; locale: Locale }) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const bandRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const headline = headlineRef.current;
    if (!band || !headline) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(headline, { type: "lines", mask: "lines" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: band, start: "top 85%", once: true },
      });
      tl.from(band, {
        clipPath: "inset(12% 6% round 28px)",
        duration: 0.9,
        ease: "power3.out",
        clearProps: "clipPath",
      })
        .from(split.lines, { yPercent: 110, duration: 0.7, ease: "power4.out", stagger: 0.1 }, 0.15)
        .from("[data-thumb]", { scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.25)
        .from("[data-note]", { y: 12, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.4);
    }, band);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <Container>
      <div
        ref={bandRef}
        className="bg-impact-blue relative isolate flex flex-col gap-6 overflow-hidden rounded-[28px] px-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(1.75rem,3.5vw,2.75rem)] text-white md:flex-row md:items-center md:justify-between md:gap-10"
      >
        {/* Brand glows. */}
        <span
          aria-hidden="true"
          className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-[#74b9ff]/25 blur-[80px]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-[#f4c600]/15 blur-[80px]"
        />

        <div className="flex items-center gap-5">
          <div
            data-thumb
            className="relative hidden size-[clamp(4rem,6vw,5.5rem)] shrink-0 overflow-hidden rounded-full ring-4 ring-white/15 sm:block"
          >
            <Image src={block.image} alt="" fill sizes="88px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <h2
              id="bottom-cta-title"
              ref={headlineRef}
              className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance"
            >
              {t(block.title)}
            </h2>
            <p data-note className="text-[clamp(0.95rem,1.1vw,1.0625rem)] text-white/75 text-pretty">
              {t(bottomCtaChrome.note)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <Link
            href={block.button.href}
            className="bg-impact-yellow text-impact-blue group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.8)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t(block.button.label)}
            <ArrowRightIcon
              weight="bold"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href={bottomCtaChrome.secondary.href}
            className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t(bottomCtaChrome.secondary.label)}
          </Link>
        </div>
      </div>
    </Container>
  );
}

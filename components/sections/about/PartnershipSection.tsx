"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { PartnerLogo, PartnershipContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** Ask Sanity's CDN for a logo-sized source rather than the original. */
const sized = (url: string) =>
  url.includes("?") ? url : `${url}?w=480&fit=max&auto=format`;

const LABELS = {
  pause: { en: "Pause partner logos", fr: "Mettre en pause les logos" },
  play: { en: "Play partner logos", fr: "Relancer les logos" },
};

function LogoCard({ logo }: { logo: PartnerLogo }) {
  return (
    <li className="group/logo flex h-28 w-52 shrink-0 flex-col items-center justify-center gap-3 rounded-[20px] bg-white px-6 outline outline-1 -outline-offset-1 outline-black/[0.07] transition-[box-shadow,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgb(16_27_98/0.45)] md:h-32 md:w-60">
      <div className="relative h-12 w-full grayscale transition-[filter,opacity] duration-500 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 md:h-14 [@media(hover:hover)]:opacity-70">
        <Image
          src={sized(logo.logoUrl)}
          alt=""
          fill
          sizes="240px"
          className="object-contain"
        />
      </div>
      <span className="text-impact-blue/60 text-center text-xs font-medium">
        {logo.name}
      </span>
    </li>
  );
}

/**
 * One marquee row. The list is rendered twice back to back and the track
 * slides by half its width, so the loop is seamless; the second copy is
 * hidden from assistive tech so each partner is announced once.
 */
function MarqueeRow({
  logos,
  reverse = false,
  duration,
}: {
  logos: PartnerLogo[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] py-2">
      <div
        className="flex w-max gap-4 group-hover/row:[animation-play-state:paused] group-data-[paused=true]/section:[animation-play-state:paused] motion-reduce:!animate-none md:gap-5"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 gap-4 md:gap-5"
          >
            {logos.map((logo) => (
              <LogoCard key={`${copy}-${logo.name}`} logo={logo} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Partnership: the heading and intro, then the partners as two rows of
 * logo cards gliding in opposite directions (paused on hover, with a
 * pause control for WCAG 2.2.2), and a navy call-to-action panel to close
 * the page. Logos sit in greyscale and come to colour on hover.
 *
 * Under prefers-reduced-motion the rows don't move; each becomes a
 * wrapped grid of every partner instead.
 */
export function PartnershipSection({
  data,
  locale,
}: {
  data: PartnershipContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [paused, setPaused] = useState(false);

  const rowA = data.logos.filter((_, i) => i % 2 === 0);
  const rowB = data.logos.filter((_, i) => i % 2 === 1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitText | undefined;
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
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }
      gsap.from("[data-rise]", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      data-paused={paused}
      aria-labelledby="partnership-title"
      className="group/section py-section w-full overflow-hidden bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="partnership-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[46ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>
      </Container>

      {/* Logos: full-bleed rows. */}
      <div data-rise className="mt-12 flex flex-col gap-3 md:mt-16 md:gap-4">
        <div className="motion-reduce:hidden">
          <MarqueeRow logos={rowA} duration={38} />
          <MarqueeRow logos={rowB} duration={44} reverse />
        </div>
        <Container className="hidden motion-reduce:block">
          <ul className="flex flex-wrap justify-center gap-4">
            {data.logos.map((logo) => (
              <LogoCard key={logo.name} logo={logo} />
            ))}
          </ul>
        </Container>
        <Container className="flex justify-end motion-reduce:hidden">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={getLocalizedText(
              paused ? LABELS.play : LABELS.pause,
              locale,
            )}
            className="text-impact-blue border-impact-blue/15 hover:border-impact-blue/40 focus-visible:outline-impact-blue inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {paused ? (
              <PlayIcon weight="fill" className="size-4" />
            ) : (
              <PauseIcon weight="fill" className="size-4" />
            )}
          </button>
        </Container>
      </div>

      {/* Closing call to action. */}
      <Container className="mt-12 md:mt-16">
        <div
          data-rise
          className="bg-impact-blue relative isolate overflow-hidden rounded-[28px] px-6 py-10 text-white md:rounded-[36px] md:px-12 md:py-14 lg:px-16"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-[#74b9ff]/25 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-[#a9d3ff]/15 blur-[90px]"
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <h3 className="text-4xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance">
                {getLocalizedText(data.ctaHeadline, locale)}
              </h3>
              <p className="max-w-[58ch] text-lg text-pretty text-white/75">
                {getLocalizedText(data.ctaParagraph, locale)}
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Button
                href={data.cta.href}
                variant="primary"
                icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
              >
                {getLocalizedText(data.cta.label, locale)}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

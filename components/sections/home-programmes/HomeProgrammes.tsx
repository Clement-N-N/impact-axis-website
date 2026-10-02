"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { whatWeDoPageContent } from "@/components/sections/what-we-do/data";
import type { Locale } from "@/i18n/routing";
import { homeProgrammesCopy as copy } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Home: a preview of the three programmes, each linking to its place on
 * What We Do.
 *
 * Desktop: three photo panels side by side. The active one (hover or
 * keyboard focus; the first by default) widens, comes into full colour and
 * shows its tagline, description and link, while the others narrow and
 * fall back to black and white. Phones and tablets stack the cards, all in
 * colour with their full text, so nothing is hidden behind a hover and
 * nothing scrolls sideways.
 *
 * Panels rise and their photos wipe in as the section arrives; under
 * prefers-reduced-motion they render in place.
 */
export function HomeProgrammes({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);
  const programmes = whatWeDoPageContent.programmes.programmes;
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);

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
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", section);
      gsap.from(panels, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: panels[0], start: "top 85%", once: true },
      });
      gsap.from(
        panels.map((p) => p.querySelector("[data-photo]")),
        {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.2,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: panels[0], start: "top 85%", once: true },
        },
      );
    }, section);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-programmes-title"
      className="py-section w-full bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {t(copy.eyebrow)}
            </span>
            <h2
              id="home-programmes-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {t(copy.headline)}
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {t(copy.intro)}
          </p>
        </div>

        <ul className="mt-10 flex flex-col gap-4 lg:mt-14 lg:h-[clamp(30rem,72svh,40rem)] lg:flex-row lg:gap-4">
          {programmes.map((p, i) => {
            const on = i === active;
            return (
              <li
                key={p.id}
                data-panel
                data-on={on}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative min-h-[26rem] overflow-hidden rounded-[24px] text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-[30rem] lg:min-h-0 lg:flex-1 lg:rounded-[28px] lg:data-[on=true]:flex-[2.3]"
              >
                <div data-photo className="absolute inset-0">
                  <Image
                    src={p.image.src}
                    alt={t(p.image.alt)}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-[filter,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:scale-105 lg:grayscale lg:group-data-[on=true]:scale-100 lg:group-data-[on=true]:grayscale-0"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.92)_0%,rgb(7_12_46/0.45)_45%,rgb(7_12_46/0.05)_75%)]"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
                  <span className="text-sm font-semibold tracking-[0.12em] text-[#ffde75] uppercase tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance md:text-4xl">
                    {t(p.title)}
                  </h3>
                  {/* Details: always shown below lg; on desktop only for the
                      open panel, so narrow panels stay clean. */}
                  <div className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:opacity-0 lg:group-data-[on=true]:grid-rows-[1fr] lg:group-data-[on=true]:opacity-100">
                    <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
                      <p className="text-lg leading-snug font-semibold text-pretty text-[#ffde75]">
                        {t(p.tagline)}
                      </p>
                      <p className="max-w-[46ch] text-base text-pretty text-white/85">
                        {t(p.description)}
                      </p>
                      <Link
                        href={`/what-we-do#${p.id}`}
                        className="bg-impact-yellow text-impact-blue mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {t(copy.cta)}
                        <span className="sr-only">: {t(p.title)}</span>
                        <ArrowRightIcon weight="bold" className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end md:mt-8">
          <Link
            href="/what-we-do"
            className="text-impact-blue hover:text-impact-blue/70 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t(copy.all)}
            <ArrowRightIcon weight="bold" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

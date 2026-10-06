"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText, type HeroVariantProps, type LearningEarningHeroContent } from "./types";

/** How long each rolling word (and its photo) stays before the next. */
const WORD_MS = 2400;

const REDUCED = {
  get: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
};

/**
 * "From learning to earning." The last word rolls through doing, building and
 * leading before landing on earning, and the full-bleed photo changes with
 * it; once it lands a yellow underline draws in and everything holds.
 *
 * Below the headline, two path cards split the audience (young people go to
 * the programmes, organisations to partnering), then a proof strip. The h1
 * holds the whole sentence for screen readers and search; the rolling words
 * are decoration. With reduced motion it shows the final word and photo
 * straight away.
 */
export function LearningEarningHero({ data, locale }: HeroVariantProps<LearningEarningHeroContent>) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const last = data.words.length - 1;
  const [step, setStep] = useState(0);
  const reduced = useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
  const index = reduced ? last : step;
  const landed = index === last;

  // Roll the word until it lands on the last one, then hold.
  useEffect(() => {
    if (reduced || step >= last) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? WORD_MS + 600 : WORD_MS);
    return () => window.clearTimeout(id);
  }, [reduced, step, last]);

  // Entrance.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        clearProps: "transform,opacity",
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="bg-impact-blue relative isolate w-full overflow-hidden lg:min-h-[max(40rem,calc(100svh-var(--header-height)))]"
    >
      {/* Photos: one per word, crossfading, with a slow push-in. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {data.words.map((w, i) => (
          <div
            key={w.image}
            className={clsx(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
              w.flip && "-scale-x-100",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={w.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectPosition: w.position ?? "center" }}
              className={clsx(
                "object-cover transition-transform ease-out motion-reduce:transition-none",
                i === index ? "scale-[1.08] duration-[9000ms]" : "scale-100 duration-[1200ms]",
              )}
            />
          </div>
        ))}
      </div>
      {/* Navy wash: solid behind the text, opening up towards the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_27_98/0.55)_0%,rgb(16_27_98/0.8)_45%,#101b62_100%)] lg:bg-[linear-gradient(90deg,#101b62_0%,rgb(16_27_98/0.88)_38%,rgb(16_27_98/0.35)_70%,rgb(16_27_98/0.2)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 hidden h-48 bg-[linear-gradient(0deg,rgb(16_27_98/0.85),transparent)] lg:block"
      />

      <Container className="flex h-full flex-col justify-between gap-10 pt-[clamp(3.5rem,9vw,7rem)] pb-8 lg:min-h-[inherit] lg:gap-12 lg:pt-[clamp(4rem,9vh,7rem)] lg:pb-10">
        <div className="flex max-w-[56rem] flex-col gap-6 lg:gap-7">
          <h1 id="hero-title" className="sr-only">
            {t(data.headline)}
          </h1>
          <p
            data-rise
            aria-hidden="true"
            className="text-[clamp(2.75rem,7.2vw,6.25rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-white"
          >
            <span className="block">{t(data.lead)}</span>
            {/* Every word sits in one grid cell, so the line is always as wide
                as the longest and nothing below it shifts as they roll. */}
            <span className="-mt-[0.18em] grid h-[1.36em] w-fit overflow-hidden leading-[1.36]">
              {data.words.map((w, i) => (
                <span
                  key={w.image}
                  className={clsx(
                    "text-impact-yellow col-start-1 row-start-1 whitespace-nowrap transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    i === index
                      ? "translate-y-0 opacity-100"
                      : i < index
                        ? "-translate-y-full opacity-0"
                        : "translate-y-full opacity-0",
                  )}
                >
                  <span className="relative">
                    {t(w.text)}
                    {i === last && (
                      <span
                        className={clsx(
                          "bg-impact-yellow absolute right-[0.3em] bottom-[0.02em] left-0 h-[0.07em] origin-left rounded-full transition-transform delay-500 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          landed ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    )}
                  </span>
                </span>
              ))}
            </span>
          </p>

          <p data-rise className="max-w-[36ch] text-[clamp(1.0625rem,1.5vw,1.3125rem)] leading-relaxed text-pretty text-white/85">
            {t(data.description)}
          </p>

          {/* Word progress: which step of the journey the photo shows. */}
          <ol data-rise aria-hidden="true" className="flex gap-1.5">
            {data.words.map((w, i) => (
              <li
                key={w.image}
                className={clsx(
                  "h-1 rounded-full transition-[width,background-color] duration-700",
                  i === index ? "bg-impact-yellow w-10" : i < index ? "w-4 bg-white/60" : "w-4 bg-white/25",
                )}
              />
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          <ul className="grid max-w-[46rem] grid-cols-1 gap-3 sm:grid-cols-2">
            {data.paths.map((path, i) => (
              <li key={path.href} data-rise>
                <Link
                  href={path.href}
                  className={clsx(
                    "group flex h-full items-center justify-between gap-4 rounded-[20px] px-6 py-5 transition-[background-color,translate,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:-translate-y-0.5",
                    i === 0
                      ? "bg-impact-yellow text-impact-blue shadow-[0_18px_40px_-18px_rgb(244_198_0/0.8)]"
                      : "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15",
                  )}
                >
                  <span className="flex flex-col gap-1">
                    <span className={clsx("text-sm font-medium", i === 0 ? "text-impact-blue/75" : "text-white/70")}>
                      {t(path.kicker)}
                    </span>
                    <span className="text-lg leading-tight font-semibold">{t(path.label)}</span>
                  </span>
                  <span
                    className={clsx(
                      "grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1",
                      i === 0 ? "bg-impact-blue text-white" : "text-impact-blue bg-white",
                    )}
                  >
                    <ArrowRightIcon weight="bold" className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <dl data-rise className="grid grid-cols-3 border-t border-white/20 pt-5 sm:max-w-[46rem]">
            {data.proof.map((p, i) => (
              <div
                key={p.value}
                className={clsx("flex flex-col-reverse justify-end gap-1 pr-3", i > 0 && "border-l border-white/20 pl-3 sm:pl-6")}
              >
                <dt className="text-xs leading-snug text-white/70 sm:text-sm">{t(p.label)}</dt>
                <dd className="text-[clamp(1.375rem,2.4vw,2rem)] leading-none font-bold tracking-[-0.03em] text-white">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

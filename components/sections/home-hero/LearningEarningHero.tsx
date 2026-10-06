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
 * "From learning to earning." The last word sits in a tilted yellow box and
 * rolls through doing, building and leading before landing on earning; the
 * box resizes to each word and the full-bleed photo changes with it, then
 * everything holds.
 *
 * Along the bottom: two glass path cards that split the audience (young
 * people go to the programmes, organisations to partnering) and a card of
 * headline figures. The h1 holds the whole sentence for screen readers and
 * search; the rolling words are decoration. With reduced motion it shows the
 * final word and photo straight away.
 */
export function LearningEarningHero({ data, locale }: HeroVariantProps<LearningEarningHeroContent>) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const last = data.words.length - 1;
  const [step, setStep] = useState(0);
  const reduced = useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
  const index = reduced ? last : step;
  const boxRef = useRef<HTMLSpanElement>(null);

  // Roll the word until it lands on the last one, then hold.
  useEffect(() => {
    if (reduced || step >= last) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? WORD_MS + 600 : WORD_MS);
    return () => window.clearTimeout(id);
  }, [reduced, step, last]);

  // Size the yellow box to the current word, so it glides between widths.
  // Set on the element directly; re-measured when the font size changes.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = () => {
      const word = box.querySelector<HTMLElement>(`[data-word="${index}"]`);
      if (word) box.style.width = `${word.offsetWidth}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [index]);

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
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_18_70/0.6)_0%,rgb(11_18_70/0.82)_50%,rgb(11_18_70/0.95)_100%)] lg:bg-[linear-gradient(90deg,rgb(11_18_70/0.93)_0%,rgb(11_18_70/0.72)_45%,rgb(11_18_70/0.18)_100%)]"
      />

      <Container className="flex h-full flex-col justify-between gap-10 pt-[clamp(3rem,8vw,6rem)] pb-8 lg:min-h-[inherit] lg:gap-12 lg:pt-[clamp(3.5rem,8vh,6rem)] lg:pb-12">
        <div className="flex max-w-[66rem] flex-col">
          <h1 id="hero-title" className="sr-only">
            {t(data.headline)}
          </h1>
          <p
            data-rise
            className="text-impact-yellow text-[11.5px] font-bold tracking-[0.1em] uppercase sm:text-sm sm:tracking-[0.14em]"
          >
            {t(data.eyebrow)}
          </p>
          <p
            data-rise
            aria-hidden="true"
            className="mt-4 text-[clamp(2.5rem,8.2vw,8.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-white"
          >
            <span className="block">{t(data.lead)}</span>
            <span className="mt-[0.06em] flex items-center gap-[0.22em]">
              {t(data.connector) && <span>{t(data.connector)}</span>}
              {/* The words share one box; only the current one is in flow,
                  the rest wait above or below it, clipped. */}
              <span className="bg-impact-yellow text-impact-blue inline-block -rotate-[1.5deg] rounded-[0.19em] px-[0.19em] py-[0.02em]">
                <span
                  ref={boxRef}
                  className="relative block overflow-hidden leading-[1.14] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  {data.words.map((w, i) => (
                    <span
                      key={w.image}
                      data-word={i}
                      className={clsx(
                        "block w-max whitespace-nowrap transition-[translate,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] [transition-duration:700ms,350ms]",
                        i === index
                          ? "relative translate-y-0 opacity-100"
                          : clsx("absolute top-0 left-0 opacity-0", i < index ? "-translate-y-[115%]" : "translate-y-[115%]"),
                      )}
                    >
                      {t(w.text)}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </p>

          <p
            data-rise
            className="mt-6 max-w-[38ch] text-[clamp(1.0625rem,1.45vw,1.25rem)] leading-relaxed text-pretty text-white/85 lg:mt-10"
          >
            {t(data.description)}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr] xl:gap-3.5">
          {data.paths.map((path) => (
            <li key={path.href} data-rise>
              <Link
                href={path.href}
                className="group flex h-full flex-col gap-1 rounded-[20px] border border-white/20 bg-white/10 px-[22px] py-5 text-white backdrop-blur-md transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="text-[13px] text-white/70">{t(path.kicker)}</span>
                <span className="text-[1.375rem] leading-tight font-semibold tracking-[-0.01em]">
                  {t(path.title)}
                </span>
                <span className="text-impact-yellow mt-2 inline-flex items-center gap-1.5 font-bold">
                  {t(path.label)}
                  <ArrowRightIcon
                    weight="bold"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
          <li data-rise className="md:col-span-2 xl:col-span-1">
            <dl className="border-impact-yellow/25 bg-impact-yellow/12 grid h-full grid-cols-3 content-center items-start gap-4 rounded-[20px] border px-[22px] py-5 backdrop-blur-md">
              {data.proof.map((p) => (
                <div key={p.value} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-xs leading-snug text-white/75">{t(p.label)}</dt>
                  <dd className="text-impact-yellow text-[clamp(1.5rem,2.3vw,2.125rem)] leading-none font-bold tracking-[-0.03em]">
                    {p.value}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        </ul>
      </Container>
    </section>
  );
}

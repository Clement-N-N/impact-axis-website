"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { PartnerLogoMarquee } from "@/components/sections/partners/PartnerLogoMarquee";
import type { Locale } from "@/i18n/routing";
import { hubContent as c } from "./hub-data";
import { Odometer } from "./Odometer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type L = { en: string; fr: string };
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const audienceHref = (a: string) => `/work-with-us/${a}`;

/** Masked line rise for a heading, run once when `trigger` reaches 78%. */
function useLineRise(
  ref: React.RefObject<HTMLElement | null>,
  trigger: React.RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const split = SplitText.create(el, { type: "lines", mask: "lines" });
    const ctx = gsap.context(() => {
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: trigger.current ?? el,
          start: "top 78%",
          once: true,
        },
      });
    });
    return () => {
      ctx.revert();
      split.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* -------------------------------------------------------------------------- */

/**
 * Hero: the headline, then the four audiences as photo cards.
 *
 * On arrival the cards are dealt from a fanned deck in the middle into
 * their places. On desktop each card tilts toward the pointer in 3D while
 * its photo drifts the other way and a soft glare follows the cursor; the
 * tags slide up and the arrow turns.
 */
export function HubAudienceHero({ locale }: { locale: Locale }) {
  const t = (v: L) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headlineRef, sectionRef, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-deal]", section);
      const grid = section.querySelector<HTMLElement>("[data-grid]");
      if (!grid) return;
      const g = grid.getBoundingClientRect();
      gsap.from(cards, {
        x: (i, el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          return g.left + g.width / 2 - (r.left + r.width / 2);
        },
        y: 80,
        rotation: (i) => (i - 1.5) * 7,
        scale: 0.86,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.09,
        delay: 0.35,
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 10,
      rotateX: -py * 10,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 900,
    });
    gsap.to(el.querySelector("[data-img]"), {
      x: -px * 18,
      y: -py * 18,
      duration: 0.6,
      ease: "power3.out",
    });
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const onLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    gsap.to(el.querySelector("[data-img]"), {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hub-title"
      className="w-full overflow-hidden bg-white pt-[calc(var(--header-height)+clamp(2rem,5vw,4rem))] pb-14 md:pb-20"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-5 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
              {t(c.hero.eyebrow)}
            </span>
            <h1
              id="hub-title"
              ref={headlineRef}
              className="text-impact-blue text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-balance"
            >
              {t(c.hero.headline)}
            </h1>
          </div>
          <p className="max-w-[46ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-3">
            {t(c.hero.intro)}
          </p>
        </div>

        <h2 className="sr-only">{t(c.hero.pick)}</h2>
        <ul
          data-grid
          className="mt-10 grid grid-cols-1 gap-4 [perspective:1200px] sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {c.cards.map((card, i) => (
            <li key={card.audience} data-deal>
              <Link
                href={audienceHref(card.audience)}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                className="group focus-visible:outline-impact-blue relative block h-[clamp(22rem,52svh,30rem)] overflow-hidden rounded-[28px] text-white shadow-[0_24px_50px_-28px_rgb(16_27_98/0.6)] [transform-style:preserve-3d] focus-visible:outline-3 focus-visible:outline-offset-4"
              >
                <div data-img className="absolute -inset-5">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    quality={90}
                    preload={i < 2}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.94)_0%,rgb(7_12_46/0.45)_45%,rgb(7_12_46/0.05)_75%)]"
                />
                {/* Glare that follows the pointer. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,30%),rgb(255_255_255/0.22),transparent_45%)] group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="bg-impact-yellow text-impact-blue absolute top-5 right-5 inline-flex size-11 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45"
                >
                  <ArrowUpRightIcon weight="bold" className="size-5" />
                </span>
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                  <span className="text-xs font-semibold tracking-[0.14em] text-[#ffde75] uppercase">
                    {t(card.label)}
                  </span>
                  <span className="text-[1.6rem] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
                    {t(card.promise)}
                  </span>
                  <span className="text-sm text-white/80">{t(card.line)}</span>
                  <span className="mt-1 flex flex-wrap gap-1.5 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                    {card.tags.map((tag) => (
                      <span
                        key={tag.en}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                      >
                        {t(tag)}
                      </span>
                    ))}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Track record: rolling figures over a hairline grid, then the logos. */
export function HubProof({
  locale,
  stats,
}: {
  locale: Locale;
  stats: { value: string; label: L }[];
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headlineRef, sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hub-proof-title"
      className="w-full overflow-hidden bg-[#f4f6fc] py-16 md:py-24"
    >
      <Container>
        <div className="flex flex-col items-start gap-5">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(c.proof.eyebrow)}
          </span>
          <h2
            id="hub-proof-title"
            ref={headlineRef}
            className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            {t(c.proof.headline)}
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-black/[0.08] lg:mt-14 lg:grid-cols-4">
          {stats.slice(0, 4).map((s, i) => (
            <li
              key={s.value}
              className="flex flex-col gap-3 bg-[#f4f6fc] p-6 md:p-8"
            >
              <Odometer
                value={s.value}
                delay={i * 0.12}
                className="text-impact-blue text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-[-0.04em]"
              />
              <span className="max-w-[22ch] text-sm font-semibold text-pretty text-black/60 md:text-base">
                {t(s.label)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-impact-blue/60 mt-12 mb-6 text-center text-sm font-semibold tracking-[0.12em] uppercase">
          {t(c.proof.logos)}
        </p>
      </Container>
      <PartnerLogoMarquee locale={locale} rows={1} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * How we partner: four steps on a line that draws itself with the scroll.
 * Each node fills and its step lifts in as the line reaches it. A huge
 * outlined step number drifts in the background.
 */
export function HubSteps({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headlineRef, sectionRef, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced()) return;
    const ctx = gsap.context(() => {
      const track = section.querySelector<HTMLElement>("[data-track]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top 80%",
          end: "top 35%",
          scrub: 0.6,
        },
      });
      const axis = window.matchMedia("(min-width: 768px)").matches
        ? "scaleX"
        : "scaleY";
      tl.fromTo(
        "[data-line]",
        { [axis]: 0 },
        { [axis]: 1, ease: "none", duration: steps.length },
        0,
      );
      steps.forEach((s, i) => {
        tl.from(
          s.querySelector("[data-node]"),
          { scale: 0.3, backgroundColor: "rgb(16 27 98)", duration: 0.4 },
          i,
        ).from(
          s.querySelector("[data-body]"),
          { y: 24, opacity: 0, duration: 0.6 },
          i,
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={compact ? undefined : "hub-steps-title"}
      aria-label={compact ? t(c.steps.eyebrow) : undefined}
      className={`bg-impact-blue relative w-full overflow-hidden text-white ${
        compact ? "py-14 md:py-20" : "py-section"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] size-[40rem] rounded-full bg-[#74b9ff]/15 blur-[120px]"
      />
      <Container className="relative">
        <div className="flex flex-col items-start gap-5">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(c.steps.eyebrow)}
          </span>
          {!compact && (
            <h2
              id="hub-steps-title"
              ref={headlineRef}
              className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {t(c.steps.headline)}
            </h2>
          )}
        </div>
        <ol
          data-track
          className="relative mt-12 grid grid-cols-1 gap-10 pl-10 md:grid-cols-4 md:gap-6 md:pt-14 md:pl-0"
        >
          {/* The line: vertical on phones, horizontal from md. */}
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-[0.6875rem] w-[3px] rounded-full bg-white/15 md:top-[0.6875rem] md:right-0 md:bottom-auto md:left-0 md:h-[3px] md:w-auto"
          />
          <span
            data-line
            aria-hidden="true"
            className="bg-impact-yellow absolute top-1 bottom-1 left-[0.6875rem] w-[3px] origin-top rounded-full shadow-[0_0_14px_rgb(244_198_0/0.7)] md:top-[0.6875rem] md:right-0 md:bottom-auto md:left-0 md:h-[3px] md:w-auto md:origin-left"
          />
          {c.steps.items.map((s, i) => (
            <li key={s.title.en} data-step className="relative">
              <span
                data-node
                aria-hidden="true"
                className="bg-impact-yellow absolute top-0 -left-10 size-[1.625rem] rounded-full border-[5px] border-[#101b62] md:-top-14 md:left-0"
              />
              <div data-body className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#ffde75] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold">{t(s.title)}</h3>
                <p className="max-w-[30ch] text-base text-pretty text-white/75">
                  {t(s.body)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const FLIP_FACES = [
  "bg-[linear-gradient(160deg,#ffeaa7_0%,#ffde75_55%,#f4c600_100%)]",
  "bg-[linear-gradient(160deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)]",
  "bg-[linear-gradient(160deg,#ffe0d6_0%,#fab1a0_50%,#f7886e_100%)]",
  "bg-[#eef1f9]",
];

/**
 * "Start with an outcome": four example partnerships as cards that flip in
 * 3D on hover or focus, from a colour face to a photo with the detail and
 * a link. Touch screens (and reduced motion) show both faces stacked.
 */
export function HubExamples({ locale }: { locale: Locale }) {
  const t = (v: L) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headlineRef, sectionRef, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-ex]", {
        y: 60,
        rotateX: -25,
        opacity: 0,
        transformPerspective: 900,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-ex]", start: "top 85%", once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hub-ex-title"
      className="py-section w-full bg-white"
    >
      <Container>
        <div className="flex flex-col items-start gap-5">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(c.examples.eyebrow)}
          </span>
          <h2
            id="hub-ex-title"
            ref={headlineRef}
            className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            {t(c.examples.headline)}
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {c.examples.items.map((ex, i) => (
            <li key={ex.title.en} data-ex className="[perspective:1200px]">
              <Link
                href={audienceHref(ex.audience)}
                className="group focus-visible:outline-impact-blue relative block rounded-[26px] focus-visible:outline-3 focus-visible:outline-offset-4 [@media(hover:hover)]:h-[19rem]"
              >
                <div className="relative h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none [@media(hover:hover)]:group-hover:[transform:rotateY(180deg)] [@media(hover:hover)]:group-focus-visible:[transform:rotateY(180deg)]">
                  {/* Front. */}
                  <div
                    className={`text-impact-blue flex h-full flex-col rounded-[26px] p-6 [backface-visibility:hidden] ${FLIP_FACES[i % FLIP_FACES.length]} [@media(hover:none)]:rounded-b-none`}
                  >
                    <span className="text-xs font-semibold tracking-[0.14em] uppercase opacity-65">
                      {t(ex.label)}
                    </span>
                    <span className="mt-auto pt-16 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-balance [@media(hover:none)]:pt-6">
                      {t(ex.title)}
                    </span>
                  </div>
                  {/* Back: flipped into view on hover; stacked below on touch. */}
                  <div className="relative overflow-hidden rounded-[26px] text-white [backface-visibility:hidden] [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-0 [@media(hover:hover)]:[transform:rotateY(180deg)] [@media(hover:none)]:rounded-t-none">
                    <Image
                      src={ex.image}
                      alt=""
                      fill
                      quality={85}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.92),rgb(7_12_46/0.35))]"
                    />
                    <div className="relative flex h-full min-h-[11rem] flex-col justify-end gap-3 p-6">
                      <span className="text-base text-pretty text-white/90">
                        {t(ex.body)}
                      </span>
                      <span className="text-impact-yellow inline-flex items-center gap-1.5 text-sm font-semibold">
                        {t(c.examples.explore)}
                        <ArrowRightIcon weight="bold" className="size-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Closing call to action: a navy panel with a light that follows the
 * pointer and a magnetic button.
 */
export function HubClosing({ locale }: { locale: Locale }) {
  const t = (v: L) => getLocalizedText(v, locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  useLineRise(headlineRef, panelRef, [locale]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const magnet = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const release = (e: PointerEvent<HTMLAnchorElement>) =>
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });

  return (
    <section
      aria-labelledby="hub-close-title"
      className="w-full bg-white pb-[clamp(3.5rem,8vw,6rem)]"
    >
      <Container>
        <div
          ref={panelRef}
          onPointerMove={onMove}
          className="bg-impact-blue relative isolate overflow-hidden rounded-[32px] px-6 py-12 text-white md:rounded-[40px] md:px-14 md:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(28rem_circle_at_var(--mx,80%)_var(--my,20%),rgb(116_185_255/0.35),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-16 -z-10 size-80 rounded-full bg-[#f4c600]/15 blur-[90px]"
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <h2
                id="hub-close-title"
                ref={headlineRef}
                className="text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance"
              >
                {t(c.closing.headline)}
              </h2>
              <p className="max-w-[52ch] text-lg text-pretty text-white/75">
                {t(c.closing.body)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-end">
              <Link
                href="/contact"
                onPointerMove={magnet}
                onPointerLeave={release}
                className="bg-impact-yellow text-impact-blue inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold shadow-[0_18px_40px_-16px_rgb(244_198_0/0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t(c.closing.cta)}
                <ArrowRightIcon weight="bold" className="size-4" />
              </Link>
              <p className="text-sm text-white/60">{t(c.closing.note)}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

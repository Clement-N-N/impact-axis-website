"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { hubContent } from "@/components/sections/work-with-us/hub-data";
import { Odometer } from "@/components/sections/work-with-us/Odometer";
import type { Locale } from "@/i18n/routing";
import { audiencePages, audienceShared as s } from "./audience-data";
import { PARTNERSHIP_AUDIENCES, type PartnershipAudience } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type L = { en: string; fr: string };
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const OPTION_LOOKS = [
  "bg-[linear-gradient(160deg,#ffeaa7_0%,#ffde75_55%,#f4c600_100%)]",
  "bg-[linear-gradient(160deg,#cfe6ff_0%,#a9d3ff_50%,#74b9ff_100%)]",
  "bg-[linear-gradient(160deg,#ffe0d6_0%,#fab1a0_50%,#f7886e_100%)]",
  "bg-[#eef1f9]",
];

/**
 * Audience hero: headline beside a photo that opens from a rounded window,
 * with the audience's headline figure pinned on it, rolling into place.
 */
export function AudienceHero({
  audience,
  locale,
}: {
  audience: PartnershipAudience;
  locale: Locale;
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const p = audiencePages[audience];
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.1,
        });
      }
      gsap.from("[data-rise]", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.35,
      });
      gsap.fromTo(
        "[data-window]",
        { clipPath: "inset(18% 22% 18% 22% round 40px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 32px)",
          duration: 1.5,
          ease: "expo.inOut",
          delay: 0.2,
        },
      );
      gsap.from("[data-window] img", {
        scale: 1.3,
        duration: 2,
        ease: "expo.out",
        delay: 0.2,
      });
      gsap.from("[data-badge]", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        delay: 1.2,
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale, audience]);

  return (
    <section
      ref={ref}
      aria-labelledby="aud-title"
      className="w-full overflow-hidden bg-white pt-[calc(var(--header-height)+clamp(1.5rem,4vw,3rem))] pb-14 md:pb-20"
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <Link
            href="/work-with-us"
            data-rise
            className="text-impact-blue/60 hover:text-impact-blue text-sm font-semibold transition-colors"
          >
            ← {t(s.crumb)}
          </Link>
          <span
            data-rise
            className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black"
          >
            {t(p.label)}
          </span>
          <h1
            id="aud-title"
            ref={headlineRef}
            className="text-impact-blue text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
          >
            {t(p.headline)}
          </h1>
          <p
            data-rise
            className="max-w-[48ch] text-lg text-pretty text-black/70"
          >
            {t(p.intro)}
          </p>
          <div data-rise className="flex flex-wrap gap-3 pt-2">
            <a
              href="#aud-form"
              className="bg-impact-yellow text-impact-blue focus-visible:outline-impact-blue group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t(p.cta)}
              <ArrowDownIcon
                weight="bold"
                className="size-4 transition-transform group-hover:translate-y-0.5"
              />
            </a>
            <Link
              href="/impact"
              className="text-impact-blue focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold transition-colors hover:border-black/25 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t(s.impact)}
            </Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div
            data-window
            className="relative aspect-[4/3] overflow-hidden rounded-[32px] lg:aspect-[5/5.2]"
          >
            <Image
              src={p.image.src}
              alt={t(p.image.alt)}
              fill
              preload
              quality={90}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            data-badge
            className="text-impact-blue absolute -bottom-5 left-5 rounded-[20px] bg-white px-5 py-4 shadow-[0_24px_50px_-20px_rgb(16_27_98/0.55)] md:left-8"
          >
            <Odometer
              value={p.badge.value}
              delay={1.3}
              className="text-[clamp(2rem,3.4vw,2.75rem)] font-bold tracking-[-0.03em]"
            />
            <p className="mt-1 text-sm font-semibold text-black/60">
              {t(p.badge.label)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Ways to partner: four option cards that spring in and react to the
 * pointer with a spotlight and a lift.
 */
export function AudienceOptions({
  audience,
  locale,
}: {
  audience: PartnershipAudience;
  locale: Locale;
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const p = audiencePages[audience];
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-opt]", {
        y: 70,
        rotation: (i) => (i % 2 ? 3 : -3),
        opacity: 0,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [audience]);

  const spot = (e: PointerEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      aria-labelledby="aud-opt-title"
      className="py-section w-full bg-white"
    >
      <Container>
        <div className="flex flex-col items-start gap-5">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(s.optionsEyebrow)}
          </span>
          <h2
            id="aud-opt-title"
            className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            {t(p.optionsHeadline)}
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {p.options.map((o, i) => (
            <li
              key={o.title.en}
              data-opt
              onPointerMove={spot}
              className={`group text-impact-blue relative flex min-h-[15rem] flex-col overflow-hidden rounded-[26px] p-6 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-28px_rgb(16_27_98/0.6)] ${OPTION_LOOKS[i % OPTION_LOOKS.length]}`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(16rem_circle_at_var(--sx,50%)_var(--sy,50%),rgb(255_255_255/0.5),transparent_60%)] group-hover:opacity-100"
              />
              <span className="relative text-sm font-semibold tabular-nums opacity-55">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative mt-auto pt-10 text-2xl leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
                {t(o.title)}
              </h3>
              <p className="text-impact-blue/75 relative mt-2 text-sm text-pretty">
                {t(o.body)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** What you get: ticked promises that draw their checks, beside rolling figures. */
export function AudienceGets({
  audience,
  locale,
  stats,
}: {
  audience: PartnershipAudience;
  locale: Locale;
  stats: { value: string; label: L }[];
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const p = audiencePages[audience];
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      tl.from("[data-get]", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
      }).from(
        "[data-tick]",
        {
          scale: 0,
          rotation: -90,
          duration: 0.5,
          ease: "back.out(2.5)",
          stagger: 0.15,
        },
        0.15,
      );
      gsap.from("[data-stat]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [audience]);

  return (
    <section
      ref={ref}
      aria-labelledby="aud-get-title"
      className="bg-impact-blue relative w-full overflow-hidden py-16 text-white md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-[32rem] rounded-full bg-[#f4c600]/10 blur-[110px]"
      />
      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-5 lg:col-span-6">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(s.getEyebrow)}
          </span>
          <h2
            id="aud-get-title"
            className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            {t(p.getHeadline)}
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {p.gets.map((g) => (
              <li
                key={g.en}
                data-get
                className="flex items-start gap-4 text-lg text-white/90"
              >
                <span
                  data-tick
                  aria-hidden="true"
                  className="bg-impact-yellow text-impact-blue mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full"
                >
                  <CheckIcon weight="bold" className="size-4" />
                </span>
                {t(g)}
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid grid-cols-2 gap-3 lg:col-span-6">
          {stats.slice(0, 4).map((st, i) => (
            <li
              key={st.value}
              data-stat
              className="flex flex-col gap-2 rounded-[22px] bg-white/[0.07] p-6 outline outline-1 -outline-offset-1 outline-white/10"
            >
              <Odometer
                value={st.value}
                delay={i * 0.12}
                className="text-impact-yellow text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-[-0.035em]"
              />
              <span className="text-sm text-pretty text-white/70">
                {t(st.label)}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** The heading block that sits above the existing contact form. */
export function AudienceFormIntro({
  audience,
  locale,
}: {
  audience: PartnershipAudience;
  locale: Locale;
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const p = audiencePages[audience];
  return (
    <div
      id="aud-form"
      className="w-full scroll-mt-[var(--header-height)] bg-[#f4f6fc] pt-16 md:pt-24"
    >
      <Container className="flex flex-col items-start gap-4">
        <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
          {t(s.formEyebrow)}
        </span>
        <h2 className="text-impact-blue text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
          {t(p.formHeadline)}
        </h2>
        <p className="text-lg text-black/65">{t(s.reply)}</p>
      </Container>
    </div>
  );
}

/** Photo links to the other three audiences. */
export function AudienceAlso({
  audience,
  locale,
}: {
  audience: PartnershipAudience;
  locale: Locale;
}) {
  const t = (v: L) => getLocalizedText(v, locale);
  const others = PARTNERSHIP_AUDIENCES.filter((a) => a !== audience);
  const cards = hubContent.cards;
  return (
    <section aria-labelledby="aud-also" className="py-section w-full bg-white">
      <Container>
        <h2
          id="aud-also"
          className="text-impact-blue/60 text-sm font-semibold tracking-[0.12em] uppercase"
        >
          {t(s.also)}
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {others.map((a) => {
            const card = cards.find((c) => c.audience === a)!;
            return (
              <li key={a}>
                <Link
                  href={`/work-with-us/${a}`}
                  className="group focus-visible:outline-impact-blue relative block h-48 overflow-hidden rounded-[24px] text-white focus-visible:outline-3 focus-visible:outline-offset-4"
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    quality={85}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale transition-[filter,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.9),rgb(7_12_46/0.2))]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <span className="flex flex-col gap-1">
                      <span className="text-xs font-semibold tracking-[0.14em] text-[#ffde75] uppercase">
                        {t(card.label)}
                      </span>
                      <span className="text-xl leading-tight font-semibold text-balance">
                        {t(card.promise)}
                      </span>
                    </span>
                    <span className="bg-impact-yellow text-impact-blue inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRightIcon weight="bold" className="size-4" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/work-with-us"
          className="text-impact-blue mt-8 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          {t(s.crumb)}
          <ArrowRightIcon weight="bold" className="size-4" />
        </Link>
      </Container>
    </section>
  );
}

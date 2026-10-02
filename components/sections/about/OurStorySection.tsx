"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurStoryContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** How long each chapter stays up before the story moves on. */
const CHAPTER_MS = 8000;

const REDUCED = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Our Story as "year chapters": the five years from the annual report as
 * tabs, with one chapter (photo, name, headline, story) showing at a time.
 *
 * While the section is on screen the story plays on its own: a yellow bar
 * fills under the current year and the next chapter follows. It pauses on
 * hover, on keyboard focus, from the pause button, and for good once the
 * reader picks a year themselves. Changing chapter wipes the new photo in
 * and lifts the text up.
 *
 * The tabs are a proper tablist (arrow keys, Home/End); on phones the year
 * row scrolls sideways and the chapter can be swiped. Under
 * prefers-reduced-motion nothing plays or animates.
 */
export function OurStorySection({
  data,
  locale,
}: {
  data: OurStoryContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const first = useRef(true);

  const chapters = data.chapters;
  const total = chapters.length;
  const [active, setActive] = useState(0);
  /** Reader paused (button) or took over (picked a year). */
  const [stopped, setStopped] = useState(false);
  /** Hover/focus inside the section. */
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    prefersReducedMotion,
    () => false,
  );

  const playing = inView && !stopped && !held && !reduced;
  const t = (k: keyof OurStoryContent["controls"]) =>
    getLocalizedText(data.controls[k], locale);

  const go = (i: number, byReader = true) => {
    if (byReader) setStopped(true);
    setActive(((i % total) + total) % total);
  };

  // Only play while the section is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Heading rise.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (!headlineRef.current) return;
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
    }, section);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  // Chapter change: wipe the photo in, lift the text, keep the tab in view.
  useLayoutEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (row && tab && row.scrollWidth > row.clientWidth) {
      row.scrollTo({
        left: tab.offsetLeft - row.clientWidth / 2 + tab.offsetWidth / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const photo = photosRef.current?.querySelector<HTMLElement>(
      `[data-photo="${active}"]`,
    );
    if (photo) {
      gsap.fromTo(
        photo,
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
      );
      gsap.fromTo(
        photo.querySelector("img"),
        { scale: 1.15 },
        { scale: 1, duration: 1.4, ease: "expo.out" },
      );
    }
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.15,
        },
      );
    }
  }, [active]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = ((keys[e.key] % total) + total) % total;
    go(next);
    tabsRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)
      ?.focus();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const dx = e.clientX - start;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  const chapter = chapters[active];
  const label = getLocalizedText(data.chapterLabel, locale).replace(
    "{n}",
    String(active + 1).padStart(2, "0"),
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-story-title"
      className="py-section w-full bg-white"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
      }}
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="our-story-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[40ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        {/* Year tabs. */}
        <div className="relative -mx-4 mt-10 border-b border-black/10 md:mx-0 lg:mt-14">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={t("tabs")}
            className="flex [scrollbar-width:none] overflow-x-auto px-4 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {chapters.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.year}
                  type="button"
                  role="tab"
                  id={`story-tab-${i}`}
                  data-tab={i}
                  aria-selected={on}
                  aria-controls="story-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={onTabKey}
                  className={`group focus-visible:outline-impact-blue relative shrink-0 px-4 pt-2 pb-4 text-[clamp(2rem,4.4vw,3.75rem)] leading-none font-bold tracking-[-0.03em] tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 md:px-6 md:pb-5 ${
                    on
                      ? "text-impact-blue"
                      : "text-impact-blue/20 hover:text-impact-blue/45"
                  }`}
                >
                  {c.year}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 -bottom-px h-1 overflow-hidden rounded-full md:inset-x-6 ${
                      on ? "bg-impact-yellow/30" : ""
                    }`}
                  >
                    {on && (
                      <span
                        key={`${active}-${stopped || reduced}`}
                        onAnimationEnd={() => go(active + 1, false)}
                        className="bg-impact-yellow block h-full w-full origin-left"
                        style={
                          stopped || reduced
                            ? undefined
                            : {
                                animation: `story-progress ${CHAPTER_MS}ms linear forwards`,
                                animationPlayState: playing
                                  ? "running"
                                  : "paused",
                              }
                        }
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white md:hidden"
          />
        </div>

        {/* The chapter. */}
        <div
          id="story-panel"
          role="tabpanel"
          aria-labelledby={`story-tab-${active}`}
          className="mt-8 grid grid-cols-1 items-center gap-8 md:mt-10 lg:grid-cols-12 lg:gap-14"
        >
          <div
            ref={photosRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[24px] bg-slate-100 lg:col-span-7 lg:aspect-[16/11] lg:rounded-[32px]"
          >
            {chapters.map((c, i) => (
              <div
                key={c.year}
                data-photo={i}
                aria-hidden={i !== active}
                className={`absolute inset-0 overflow-hidden ${
                  i === active ? "z-10" : "z-0"
                }`}
              >
                <Image
                  src={c.image.src}
                  alt={
                    i === active ? getLocalizedText(c.image.alt, locale) : ""
                  }
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
            <span className="bg-impact-yellow text-impact-blue absolute top-4 left-4 z-20 rounded-full px-4 py-1.5 text-sm font-semibold md:top-5 md:left-5">
              {label}
            </span>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div
              ref={textRef}
              aria-live={playing ? "off" : "polite"}
              className="flex flex-col gap-4"
            >
              <span className="text-sm font-semibold tracking-[0.12em] text-[#d4583c] uppercase">
                {getLocalizedText(chapter.title, locale)}
              </span>
              <h3 className="text-impact-blue text-4xl leading-[1.08] font-semibold tracking-[-0.025em] text-balance">
                {getLocalizedText(chapter.headline, locale)}
              </h3>
              <p className="max-w-[48ch] text-lg text-pretty text-black/70">
                {getLocalizedText(chapter.body, locale)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label={t("previous")}
                className="border-impact-blue/20 text-impact-blue hover:border-impact-blue/50 focus-visible:outline-impact-blue inline-flex size-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ArrowLeftIcon weight="bold" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label={t("next")}
                className="bg-impact-blue focus-visible:outline-impact-blue inline-flex size-12 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ArrowRightIcon weight="bold" className="size-5" />
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setStopped((s) => !s)}
                  aria-pressed={stopped}
                  aria-label={stopped ? t("play") : t("pause")}
                  className="text-impact-blue/70 hover:text-impact-blue focus-visible:outline-impact-blue ml-auto inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {stopped ? (
                    <PlayIcon weight="fill" className="size-4" />
                  ) : (
                    <PauseIcon weight="fill" className="size-4" />
                  )}
                </button>
              )}
              <span className="text-impact-blue/50 text-sm font-semibold tabular-nums">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowsOutSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { GalleryContent, GalleryPhoto } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, ScrollTrigger, SplitText);
}

const ALL = "all";

const SPAN: Record<NonNullable<GalleryPhoto["span"]> | "none", string> = {
  none: "",
  wide: "col-span-2",
  tall: "row-span-2",
  big: "col-span-2 row-span-2",
};

/** Matches the mosaic tracks below so the optimiser serves the right width. */
const sizesFor = (span: GalleryPhoto["span"]) =>
  span === "wide" || span === "big"
    ? "(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw"
    : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Event gallery: a bento mosaic of photos from our events.
 *
 * - Filter chips (one per event) reshuffle the mosaic with a FLIP: tiles that
 *   stay glide to their new cells, the rest shrink away or grow in. A navy
 *   pill slides between chips to mark the active filter.
 * - On scroll, tiles are revealed in batches: each photo wipes up from the
 *   bottom while it settles from a zoom.
 * - Hover (or keyboard focus) lifts a tile and slides up its event caption.
 * - Clicking a tile opens a lightbox over the current filter, with
 *   previous/next buttons, arrow keys, swipe and Esc.
 *
 * Under prefers-reduced-motion everything renders in its final state and
 * filtering swaps instantly.
 */
export function EventGallerySection({
  data,
  locale,
}: {
  data: GalleryContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const gridHeight = useRef(0);
  const revealed = useRef(false);

  const [active, setActive] = useState<string>(ALL);
  const [open, setOpen] = useState<number | null>(null);

  const visible = data.photos.filter(
    (p) => active === ALL || p.event === active,
  );
  const eventName = (id: string) => {
    const event = data.events.find((e) => e.id === id);
    return event ? getLocalizedText(event.name, locale) : "";
  };
  const countFor = (id: string) =>
    id === ALL
      ? data.photos.length
      : data.photos.filter((p) => p.event === id).length;

  // Heading rise + batched wipe/zoom reveal of the tiles.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

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

      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", section);
      gsap.set(
        tiles.map((t) => t.querySelector("[data-wipe]")),
        {
          clipPath: "inset(100% 0% 0% 0%)",
        },
      );
      gsap.set(
        tiles.map((t) => t.querySelector("[data-zoom]")),
        {
          scale: 1.35,
        },
      );

      ScrollTrigger.batch(tiles, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          const els = batch as HTMLElement[];
          gsap.to(
            els.map((t) => t.querySelector("[data-wipe]")),
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
            },
          );
          gsap.to(
            els.map((t) => t.querySelector("[data-zoom]")),
            { scale: 1, duration: 1.6, ease: "expo.out", stagger: 0.09 },
          );
        },
      });
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  // Slide the navy pill under the active chip.
  const movePill = useCallback((instant: boolean) => {
    const chips = chipsRef.current;
    const pill = pillRef.current;
    const chip = chips?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (!chips || !pill || !chip) return;
    gsap.to(pill, {
      x: chip.offsetLeft,
      y: chip.offsetTop,
      width: chip.offsetWidth,
      duration: instant || prefersReducedMotion() ? 0 : 0.55,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    movePill(true);
    const onResize = () => movePill(true);
    window.addEventListener("resize", onResize);
    // Fonts can shift chip widths after first paint.
    document.fonts?.ready.then(() => movePill(true));
    return () => window.removeEventListener("resize", onResize);
  }, [movePill, locale]);

  const select = (id: string) => {
    if (id === active) return;
    const grid = gridRef.current;
    if (grid && !prefersReducedMotion()) {
      flipState.current = Flip.getState(grid.querySelectorAll("[data-tile]"), {
        props: "opacity",
      });
      gridHeight.current = grid.offsetHeight;
    }
    setActive(id);
  };

  // FLIP the mosaic into its new arrangement after React re-renders.
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    movePill(false);
    // Keep the chosen chip in view in the sideways-scrolling row; scroll the
    // row itself, never the page.
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (row && chip && row.scrollWidth > row.clientWidth) {
      row.scrollTo({
        left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }

    const grid = gridRef.current;
    const state = flipState.current;
    if (!grid || !state) return;
    flipState.current = null;

    // Any tile still waiting for its scroll reveal is shown outright, so a
    // filter never surfaces a blank cell.
    if (!revealed.current) {
      revealed.current = true;
      ScrollTrigger.getAll()
        .filter((t) => grid.contains(t.trigger as Node))
        .forEach((t) => t.kill());
      gsap.set(grid.querySelectorAll("[data-wipe]"), {
        clipPath: "inset(0% 0% 0% 0%)",
      });
      gsap.set(grid.querySelectorAll("[data-zoom]"), { scale: 1 });
    }

    // Ease the grid's height to its new size so the sections below glide
    // rather than jump while the tiles travel.
    const to = grid.offsetHeight;
    gsap.fromTo(
      grid,
      { height: gridHeight.current },
      {
        height: to,
        duration: 0.8,
        ease: "power3.inOut",
        clearProps: "height",
      },
    );

    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.012,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.25,
            ease: "back.out(1.6)",
            stagger: 0.04,
          },
        ),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          scale: 0.8,
          duration: 0.35,
          ease: "power2.in",
        }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [active, movePill]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-section relative z-10 w-full scroll-mt-[var(--header-height)] bg-white"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg text-pretty text-black/70 lg:col-span-4 lg:col-start-9 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        {/* Filter chips: scroll sideways on small screens. */}
        <div className="relative -mx-4 mt-10 md:mx-0 lg:mt-14">
          <div
            ref={chipsRef}
            role="group"
            aria-label={getLocalizedText(data.filterLabel, locale)}
            className="relative flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <span
              ref={pillRef}
              aria-hidden="true"
              className="bg-impact-blue pointer-events-none absolute top-0 left-0 h-11 w-0 rounded-full shadow-[0_8px_20px_-8px_rgb(16_27_98/0.6)] max-md:hidden"
            />
            {[{ id: ALL, label: getLocalizedText(data.allLabel, locale) }]
              .concat(
                data.events.map((e) => ({
                  id: e.id,
                  label: getLocalizedText(e.name, locale),
                })),
              )
              .map(({ id, label }) => {
                const isActive = id === active;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => select(id)}
                    className={`focus-visible:outline-impact-blue relative z-10 inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isActive
                        ? "max-md:bg-impact-blue border-transparent text-white"
                        : "border-impact-blue/15 text-impact-blue hover:border-impact-blue/40"
                    }`}
                  >
                    {label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[0.7rem] leading-none tabular-nums transition-colors duration-300 ${
                        isActive
                          ? "bg-impact-yellow text-impact-blue"
                          : "bg-impact-blue/[0.07] text-impact-blue/70"
                      }`}
                    >
                      {countFor(id)}
                    </span>
                  </button>
                );
              })}
          </div>
          {/* Fade hinting that the chip row scrolls (mobile only). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white md:hidden"
          />
        </div>

        <ul
          ref={gridRef}
          className="mt-8 grid grid-flow-row-dense auto-rows-[clamp(7.5rem,34vw,13rem)] grid-cols-2 gap-3 md:auto-rows-[clamp(9rem,22vw,15rem)] md:grid-cols-3 md:gap-4 lg:mt-10 lg:auto-rows-[clamp(10rem,15.5vw,17.5rem)] lg:grid-cols-4"
        >
          {data.photos.map((photo) => {
            const shown = active === ALL || photo.event === active;
            const index = visible.indexOf(photo);
            const alt = getLocalizedText(photo.alt, locale);
            const name = eventName(photo.event);
            return (
              <li
                key={photo.src}
                data-tile
                className={`${SPAN[photo.span ?? "none"]} ${shown ? "" : "hidden"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  aria-label={`${alt} (${name})`}
                  className="group focus-visible:outline-impact-yellow relative block size-full overflow-hidden rounded-[20px] bg-slate-100 shadow-[0_1px_2px_rgb(16_27_98/0.08)] outline-offset-4 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-20px_rgb(16_27_98/0.55)] focus-visible:-translate-y-1.5 focus-visible:outline-3 md:rounded-[24px]"
                >
                  <span data-wipe className="absolute inset-0 block">
                    <span data-zoom className="absolute inset-0 block">
                      <span className="absolute inset-0 block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          quality={90}
                          sizes={sizesFor(photo.span)}
                          className="object-cover"
                        />
                      </span>
                    </span>
                  </span>
                  {/* Inner hairline keeps light photos from bleeding into the page. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] outline outline-1 -outline-offset-1 outline-black/10"
                  />
                  {/* Caption: slides up on hover/focus; always on for touch. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#070c2e]/80 via-[#070c2e]/30 to-transparent p-3 pt-10 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-full md:p-4 md:pt-14 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                  >
                    <span className="text-xs font-semibold text-white md:text-sm">
                      {name}
                    </span>
                    <span className="text-impact-blue bg-impact-yellow hidden size-8 shrink-0 items-center justify-center rounded-full md:inline-flex">
                      <ArrowsOutSimpleIcon weight="bold" className="size-4" />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Container>

      <GalleryLightbox
        photos={visible}
        index={open}
        onIndex={setOpen}
        eventName={eventName}
        labels={{
          close: getLocalizedText(data.lightbox.close, locale),
          previous: getLocalizedText(data.lightbox.previous, locale),
          next: getLocalizedText(data.lightbox.next, locale),
          counter: getLocalizedText(data.lightbox.counter, locale),
        }}
        locale={locale}
      />
    </section>
  );
}

function GalleryLightbox({
  photos,
  index,
  onIndex,
  eventName,
  labels,
  locale,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onIndex: (index: number | null) => void;
  eventName: (id: string) => string;
  labels: { close: string; previous: string; next: string; counter: string };
  locale: Locale;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const direction = useRef(0);
  const swipeStart = useRef<number | null>(null);
  const isOpen = index !== null;
  const total = photos.length;

  const go = useCallback(
    (step: number) => {
      if (index === null || total === 0) return;
      direction.current = step;
      onIndex((index + step + total) % total);
    },
    [index, total, onIndex],
  );

  // Open/close the native modal dialog (focus trap, Esc, inert page).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      direction.current = 0;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
        );
      }
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  // Photo transition: slide in from the side we're travelling towards, or
  // grow in when the lightbox first opens.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || index === null || prefersReducedMotion()) return;
    const d = direction.current;
    gsap.fromTo(
      stage,
      d === 0
        ? { opacity: 0, scale: 0.92 }
        : { opacity: 0, x: d * 80, scale: 1 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: d === 0 ? 0.6 : 0.5,
        ease: "expo.out",
        overwrite: true,
      },
    );
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const dx = e.clientX - start;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const photo = index !== null ? photos[index] : null;
  const counter = labels.counter
    .replace("{current}", String((index ?? 0) + 1))
    .replace("{total}", String(total));

  return (
    <dialog
      ref={dialogRef}
      aria-label={photo ? getLocalizedText(photo.alt, locale) : undefined}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onIndex(null);
      }}
      onKeyDown={onKeyDown}
      // A click on the dark surround (not the photo or controls) closes.
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target === e.currentTarget || "backdrop" in target.dataset)
          dialogRef.current?.close();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-[#070c2e]/[0.94] p-0 text-white backdrop-blur-xl backdrop:bg-transparent"
    >
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 pt-4 md:px-8 md:pt-6">
            <div className="flex items-center gap-3">
              <span className="bg-impact-yellow text-impact-blue rounded-full px-3 py-1 text-sm font-semibold">
                {eventName(photo.event)}
              </span>
              <span
                aria-live="polite"
                className="text-sm text-white/60 tabular-nums"
              >
                {counter}
              </span>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={labels.close}
              className="focus-visible:outline-impact-yellow inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2"
            >
              <XIcon weight="bold" className="size-5" />
            </button>
          </div>

          <div
            data-backdrop
            className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 py-4 md:px-24 md:py-6"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div
              ref={stageRef}
              className="relative h-full w-full"
              style={{
                maxWidth: `calc((100dvh - 9rem) * ${photo.width / photo.height})`,
              }}
            >
              <Image
                key={photo.src}
                src={photo.src}
                alt={getLocalizedText(photo.alt, locale)}
                fill
                quality={90}
                sizes="100vw"
                className="rounded-[20px] object-contain"
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.previous}
                  className="focus-visible:outline-impact-yellow hover:bg-impact-yellow hover:text-impact-blue absolute top-1/2 left-6 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors focus-visible:outline-2 md:inline-flex"
                >
                  <CaretLeftIcon weight="bold" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="focus-visible:outline-impact-yellow hover:bg-impact-yellow hover:text-impact-blue absolute top-1/2 right-6 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors focus-visible:outline-2 md:inline-flex"
                >
                  <CaretRightIcon weight="bold" className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile controls sit under the photo, within thumb reach. */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-4 pb-6 md:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className="focus-visible:outline-impact-yellow inline-flex size-12 items-center justify-center rounded-full bg-white/10 focus-visible:outline-2"
              >
                <CaretLeftIcon weight="bold" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="focus-visible:outline-impact-yellow inline-flex size-12 items-center justify-center rounded-full bg-white/10 focus-visible:outline-2"
              >
                <CaretRightIcon weight="bold" className="size-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

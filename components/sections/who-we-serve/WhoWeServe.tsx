"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { whoWeServeChrome, whoWeServeContent } from "./data";
import type { WhoWeServeContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** How long the spotlight rests on each card on desktop. */
const SPOT_MS = 4500;

const query = (q: string) => ({
  get: () => typeof window !== "undefined" && window.matchMedia(q).matches,
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia(q);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
});
const REDUCED = query("(prefers-reduced-motion: reduce)");
const DESKTOP = query("(min-width: 1024px)");

/**
 * Who We Work With, as a "spotlight relay": three cards whose text is always
 * visible (nothing depends on hover, so it reads the same on touch screens
 * and to keyboard and screen-reader users).
 *
 * Desktop: once the section is on screen the navy spotlight passes from card
 * to card while a yellow line fills; hovering or focusing a card moves the
 * spotlight there and holds it. Phones and tablets: the card nearest the
 * middle of the screen takes the spotlight as you scroll. With reduced
 * motion the cards stay plain and nothing moves. Each card links to the
 * matching page.
 */
export function WhoWeServe({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: WhoWeServeContent;
}) {
  const data = propData ?? whoWeServeContent;
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
  const desktop = useSyncExternalStore(DESKTOP.subscribe, DESKTOP.get, () => true);

  const count = data.cards.length;
  const cycling = desktop && inView && !held && !reduced;

  // Entrance: headline lines and cards rise in.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Desktop: is the grid on screen? (Starts the relay, stops it off screen.)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !desktop || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setActive((a) => a ?? 0);
      },
      { threshold: 0.45 },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, [desktop, reduced]);

  // Desktop relay.
  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(
      () => setActive((a) => ((a ?? -1) + 1) % count),
      SPOT_MS,
    );
    return () => window.clearInterval(id);
  }, [cycling, count, active]);

  // Phones and tablets: the card crossing the middle of the screen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || desktop || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    grid.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [desktop, reduced]);

  const spotlight = reduced ? null : active;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="who-we-serve-title"
      className="py-section w-full bg-white"
    >
      <Container>
        <div className="flex max-w-[52rem] flex-col gap-3">
          <span data-rise className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {t(data.eyebrow)}
          </span>
          <h2
            id="who-we-serve-title"
            data-rise
            className="text-impact-blue text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
          >
            {t(whoWeServeChrome.headline)}
          </h2>
        </div>

        <ul
          ref={gridRef}
          onMouseLeave={() => setHeld(false)}
          className="mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3"
        >
          {data.cards.map((card, i) => {
            const on = spotlight === i;
            const visited = desktop && spotlight !== null && i < spotlight;
            const link = whoWeServeChrome.links[i] ?? whoWeServeChrome.links[0];
            return (
              <li key={card.number} data-rise data-index={i}>
                <Link
                  href={link.href}
                  onMouseEnter={() => {
                    if (!desktop || reduced) return;
                    setHeld(true);
                    setActive(i);
                  }}
                  onFocus={() => {
                    setHeld(true);
                    setActive(i);
                  }}
                  onBlur={() => setHeld(false)}
                  className={clsx(
                    "group focus-visible:outline-impact-blue relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] p-7 transition-[background-color,color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-3 focus-visible:outline-offset-4 md:p-8 lg:min-h-[27rem]",
                    on
                      ? "bg-impact-blue -translate-y-1.5 text-white shadow-[0_30px_50px_-25px_rgb(16_27_98/0.7)]"
                      : "text-impact-blue bg-[#f5f5f5]",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <Image
                      src={card.icon}
                      alt=""
                      width={120}
                      height={120}
                      className={clsx(
                        "h-auto w-16 transition-[filter,scale] duration-500 lg:w-20",
                        on && "scale-110 brightness-0 invert",
                      )}
                    />
                    <span
                      className={clsx(
                        "text-sm font-bold tracking-wide transition-colors duration-500",
                        on ? "text-impact-yellow" : "text-[#8a8ea3]",
                      )}
                    >
                      {card.number}
                    </span>
                  </div>
                  <h3 className="text-[clamp(1.375rem,1.9vw,1.75rem)] leading-[1.1] font-semibold text-balance">
                    {t(card.label)}
                  </h3>
                  <p
                    className={clsx(
                      "text-[clamp(1rem,1.15vw,1.0625rem)] leading-relaxed text-pretty transition-colors duration-500",
                      on ? "text-white/85" : "text-black/70",
                    )}
                  >
                    {t(card.description)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
                    {t(link.label)}
                    <ArrowRightIcon
                      weight="bold"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                  {!reduced && (
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "mt-auto block h-1 overflow-hidden rounded-full",
                        on ? "bg-white/20" : "bg-black/10",
                      )}
                    >
                      <span
                        key={on && cycling ? `run-${active}` : "still"}
                        className="bg-impact-yellow block h-full origin-left"
                        style={
                          on && cycling
                            ? { animation: `story-progress ${SPOT_MS}ms linear forwards` }
                            : { transform: `scaleX(${on || visited ? 1 : 0})` }
                        }
                      />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

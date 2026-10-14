"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * The 404, in the same navy full-bleed language as the home hero.
 *
 * It used to be black text centred on white, which read as an unstyled
 * failure page rather than part of the site. The shell here is the hero's:
 * navy ground, the hero's yellow eyebrow, its display type, and a viewport's
 * worth of height so the page lands rather than dribbles out above the
 * footer. Moving the eyebrow onto navy also fixes a real defect — brand
 * yellow on white is 1.62:1 and cannot pass AA at any size, where on navy it
 * is 9.54:1.
 *
 * The one piece of decoration says what the page is: a route that sets off,
 * reaches a stop, and continues only as dots. It is inline SVG rather than a
 * photograph because an error page should not cost a hero image to render.
 *
 * The way out is three destination cards rather than a single button home:
 * sending someone who hit a dead link back to the start makes them begin
 * their search again. They reuse the hero's glass path card.
 *
 * Motion follows the house recipe — masked line-stagger on the heading,
 * `data-rise` fade-up for everything else — but runs on load rather than on
 * scroll, since the whole page is one screen and there is nothing to scroll
 * to.
 */
/**
 * Where a lost visitor is most likely trying to get to. Labels are read from
 * the nav namespace rather than repeated here, so these stay in step with the
 * menu.
 */
const DESTINATIONS = [
  { href: "/", label: "links.home" },
  { href: "/work-with-us", label: "links.workWithUs" },
  { href: "/blog", label: "links.blog" },
] as const;

export default function NotFound() {
  const t = useTranslations("notFound");
  const nav = useTranslations("nav");
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const rise = gsap.utils.toArray<HTMLElement>("[data-rise]");
      const route = gsap.utils.toArray<SVGPathElement>("[data-route]");

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(rise, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            gsap.set(route, { strokeDashoffset: 0 });
            return;
          }

          gsap.set(rise, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline();

          tl.to(rise[0] ?? {}, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              rise.slice(1),
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.18 },
              "-=0.2",
            );

          // The solid leg draws itself; the dotted continuation is already
          // there, so the stop reads as the point the route gave out.
          route.forEach((path) => {
            const length = path.getTotalLength();
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: "power2.inOut",
                delay: 0.2,
                clearProps: "strokeDasharray,strokeDashoffset",
              },
            );
          });

          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="not-found-title"
      // Height is content-driven on a phone and fills the screen from `lg`.
      // A full viewport on a phone just floats the block in a field of navy;
      // at `lg` the hero's full-bleed proportions are what this is matching.
      className="bg-impact-blue relative isolate flex w-full items-center overflow-hidden lg:min-h-[max(32rem,calc(100svh-var(--header-height)))]"
    >
      {/* A warm lift in one corner so the navy is not a flat wall. */}
      <div
        aria-hidden="true"
        className="bg-impact-yellow/12 pointer-events-none absolute -top-40 -right-32 -z-10 size-[34rem] rounded-full blur-3xl"
      />

      <Container className="py-[clamp(4rem,10vw,7rem)]">
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <p
            data-rise
            className="text-impact-yellow text-[11.5px] font-bold tracking-[0.1em] uppercase sm:text-sm sm:tracking-[0.14em]"
          >
            {t("eyebrow")}
          </p>

          <h1
            id="not-found-title"
            ref={headlineRef}
            className="mt-4 text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-white"
          >
            {t("title")}
          </h1>
        </div>

        {/* The route that stops: it sets off, reaches the marker, and carries
            on only as dots. Spans the full container rather than the text
            column so the trail runs off the edge of the page — on a wide
            screen that is what ties the headline to the empty half instead of
            leaving it dead. Decorative; the heading already says what
            happened. */}
        <svg
          data-rise
          aria-hidden="true"
          viewBox="0 0 1200 60"
          fill="none"
          preserveAspectRatio="none"
          className="mt-10 h-10 w-full text-white/35 sm:h-14"
        >
          <path
            data-route
            d="M0 52 C 230 52, 370 16, 592 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M600 2 V 30"
            className="text-impact-yellow"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M640 16 H 1200"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 14"
            className="text-white/25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <p
            data-rise
            className="mt-8 max-w-[42ch] text-[clamp(1.0625rem,1.45vw,1.25rem)] leading-relaxed text-pretty text-white/85"
          >
            {t("description")}
          </p>
        </div>

        {/* Three ways on, rather than one button back to the start. A single
            "home" link makes someone who hit a dead link begin their search
            again; these are the places they were most likely heading. The card
            is the hero's glass path card, and the labels come from the nav
            namespace so a renamed section cannot drift out of step with the
            menu. */}
        <ul className="mx-auto mt-10 grid w-full max-w-[52rem] grid-cols-1 gap-3 sm:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <li key={destination.href} data-rise>
              <Link
                href={destination.href}
                className="group flex h-full items-center justify-between gap-3 rounded-[20px] border border-white/20 bg-white/10 px-[22px] py-5 text-left text-white backdrop-blur-md transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="text-[1.0625rem] leading-tight font-semibold tracking-[-0.01em]">
                  {nav(destination.label)}
                </span>
                <ArrowRightIcon
                  weight="bold"
                  aria-hidden="true"
                  className="text-impact-yellow size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

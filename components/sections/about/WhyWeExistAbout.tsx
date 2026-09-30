"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { HeroCta } from "./AboutHeroParts";
import type { WhyWeExistAboutContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const YELLOW = "#f4c600"; // impact-yellow

/**
 * "Why we exist". Three pieces of motion, all driven by GSAP like the rest of
 * the About page:
 *
 * 1. The pathway: a hand-drawn yellow line strikes through "is not", then
 *    keeps going as a route that runs down between the photo and the cards,
 *    touching each card with a node. Drawn with the scroll (scrubbed).
 * 2. The frame locks together: four corner pieces of the yellow photo frame
 *    slide in and meet while the photo settles from 1.15x to 1x.
 * 3. On desktop with a fine pointer, the navy cards tilt toward the cursor
 *    with a soft highlight, and the photo drifts the opposite way.
 *
 * Under prefers-reduced-motion everything renders in its final state: the
 * strike and route drawn, the frame assembled, no tilt.
 */
export function WhyWeExistAbout({
  data,
  locale,
}: {
  data: WhyWeExistAboutContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const strikeRef = useRef<SVGPathElement>(null);
  const strikeWrapRef = useRef<HTMLSpanElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const routeSvgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /**
     * Lays the route out from element layout positions: from the end of the
     * strike, curving down into the gap between photo and cards, then
     * straight down past both cards, with a node beside each card.
     *
     * Uses offsetLeft/offsetTop (which ignore transforms) rather than
     * getBoundingClientRect, so the headline and cards can be mid-entrance,
     * still translated, when this runs.
     */
    const layoutRoute = () => {
      const svg = routeSvgRef.current;
      const route = routeRef.current;
      const strike = strikeWrapRef.current;
      const frame = frameRef.current;
      const [c1, c2] = cardRefs.current;
      if (!svg || !route || !strike || !frame || !c1 || !c2) return;

      const box = (el: HTMLElement) => {
        let left = 0;
        let top = 0;
        let node: HTMLElement | null = el;
        while (node && node !== section) {
          left += node.offsetLeft;
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return {
          left,
          top,
          right: left + el.offsetWidth,
          bottom: top + el.offsetHeight,
        };
      };
      const s = box(strike);
      const f = box(frame);
      const a = box(c1);
      const b = box(c2);

      svg.setAttribute(
        "viewBox",
        `0 0 ${section.offsetWidth} ${section.offsetHeight}`,
      );
      const sx = s.right + 4;
      const sy = s.top + (s.bottom - s.top) * 0.55;
      const gx = (f.right + a.left) / 2; // centre of the gutter
      const n1 = a.top + (a.bottom - a.top) / 2;
      const n2 = b.top + (b.bottom - b.top) / 2;
      const end = b.bottom - 12;

      route.setAttribute(
        "d",
        `M ${sx} ${sy} C ${sx + 60} ${sy}, ${gx} ${sy + 20}, ${gx} ${f.top + 40} L ${gx} ${end}`,
      );
      [n1, n2].forEach((ny, i) => {
        const node = nodeRefs.current[i];
        if (node) {
          node.setAttribute("cx", String(gx));
          node.setAttribute("cy", String(ny));
        }
      });
    };

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const strike = strikeRef.current;
      const frameCorners = frameRef.current
        ? gsap.utils.toArray<HTMLElement>("[data-corner]", frameRef.current)
        : [];
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

      const strikeLen = strike?.getTotalLength() ?? 0;

      if (reduce) {
        layoutRoute();
        return;
      }

      // Headline: each line rises out of its own mask.
      const lines = headingRef.current
        ? gsap.utils.toArray<HTMLElement>("[data-line]", headingRef.current)
        : [];
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.14,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      // The strike through "is not" draws once the headline has landed.
      if (strike) {
        gsap.set(strike, {
          strokeDasharray: strikeLen,
          strokeDashoffset: strikeLen,
        });
        gsap.to(strike, {
          strokeDashoffset: 0,
          duration: 0.6,
          delay: 0.7,
          ease: "power2.inOut",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }

      // Frame corners slide in from the outside and lock together.
      const offsets = [
        { x: -48, y: -48 },
        { x: 48, y: -48 },
        { x: -48, y: 48 },
        { x: 48, y: 48 },
      ];
      frameCorners.forEach((corner, i) =>
        gsap.set(corner, { ...offsets[i], opacity: 0 }),
      );
      gsap.set(photoRef.current, { scale: 1.15 });
      const frameTl = gsap.timeline({
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top 80%",
          once: true,
        },
      });
      frameTl
        .to(frameCorners, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
        })
        .to(photoRef.current, { scale: 1, duration: 1.4, ease: "expo.out" }, 0);

      // Cards enter one after the other.
      gsap.set(cards, { opacity: 0, y: 32 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: cards[0], start: "top 85%", once: true },
      });

      // Desktop only: the route and its nodes draw with the scroll.
      mm.add("(min-width: 1024px)", () => {
        layoutRoute();
        const route = routeRef.current;
        const nodes = nodeRefs.current.filter(Boolean) as SVGCircleElement[];
        if (!route) return;
        const len = route.getTotalLength();
        gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: layoutRoute,
          },
        });
        tl.to(route, { strokeDashoffset: 0, ease: "none", duration: 1 })
          .to(
            nodes[0] ?? {},
            { scale: 1, duration: 0.08, ease: "back.out(3)" },
            0.45,
          )
          .to(
            nodes[1] ?? {},
            { scale: 1, duration: 0.08, ease: "back.out(3)" },
            0.85,
          );
      });

      // Fine pointers only: cards tilt toward the cursor, photo drifts away.
      mm.add(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        () => {
          const photoX = gsap.quickTo(photoRef.current, "x", {
            duration: 0.8,
            ease: "power3.out",
          });
          const photoY = gsap.quickTo(photoRef.current, "y", {
            duration: 0.8,
            ease: "power3.out",
          });
          const tilts = cards.map((card) => ({
            card,
            rx: gsap.quickTo(card, "rotationX", {
              duration: 0.5,
              ease: "power3.out",
            }),
            ry: gsap.quickTo(card, "rotationY", {
              duration: 0.5,
              ease: "power3.out",
            }),
          }));
          gsap.set(cards, { transformPerspective: 900 });

          const onMove = (e: PointerEvent) => {
            const r = section.getBoundingClientRect();
            photoX(-((e.clientX - r.left) / r.width - 0.5) * 14);
            photoY(-((e.clientY - r.top) / r.height - 0.5) * 10);
            for (const { card, rx, ry } of tilts) {
              const c = card.getBoundingClientRect();
              const inside =
                e.clientX >= c.left &&
                e.clientX <= c.right &&
                e.clientY >= c.top &&
                e.clientY <= c.bottom;
              if (!inside) {
                rx(0);
                ry(0);
                card.style.removeProperty("--mx");
                card.style.removeProperty("--my");
                continue;
              }
              const px = (e.clientX - c.left) / c.width;
              const py = (e.clientY - c.top) / c.height;
              ry((px - 0.5) * 8);
              rx(-(py - 0.5) * 8);
              card.style.setProperty("--mx", `${px * 100}%`);
              card.style.setProperty("--my", `${py * 100}%`);
            }
          };
          const onLeave = () => {
            photoX(0);
            photoY(0);
            for (const { card, rx, ry } of tilts) {
              rx(0);
              ry(0);
              card.style.removeProperty("--mx");
              card.style.removeProperty("--my");
            }
          };
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        },
      );
    }, section);

    // Under reduced motion the route is static; keep it laid out on resize.
    const onResize = () => reduce && layoutRoute();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
      ctx.revert();
    };
  }, []);

  const turn = getLocalizedText(data.tagline.turn, locale);
  const [before, struck = "", after = ""] = turn.split(/\*([^*]+)\*/);

  return (
    <section
      ref={sectionRef}
      className="py-section relative w-full overflow-hidden bg-white"
    >
      {/* The route overlay; laid out in JS from the live element positions. */}
      <svg
        ref={routeSvgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
      >
        <path
          ref={routeRef}
          fill="none"
          stroke={YELLOW}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[0, 1].map((i) => (
          <circle
            key={i}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            r={9}
            fill={YELLOW}
            stroke="#ffffff"
            strokeWidth={4}
          />
        ))}
      </svg>

      <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12">
        <div className="flex flex-col items-start gap-6 lg:col-span-9">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
          {/* `!` because styles/_base.scss sets unlayered h1–h6 rules that
              otherwise beat Tailwind's utilities. */}
          <h2
            ref={headingRef}
            className="text-impact-blue text-5xl leading-[1.08]! font-light! tracking-[-0.02em] text-balance"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-line className="block font-bold">
                {getLocalizedText(data.tagline.lead, locale)}
              </span>
            </span>{" "}
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block">
                {before}
                <span
                  ref={strikeWrapRef}
                  className="relative inline-block whitespace-nowrap"
                >
                  {struck}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 24"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute top-[55%] -left-[4%] h-[0.45em] w-[108%] -translate-y-1/2 overflow-visible"
                  >
                    <path
                      ref={strikeRef}
                      d="M3 15 C 40 9, 90 18, 140 11 S 190 8, 197 10"
                      fill="none"
                      stroke={YELLOW}
                      strokeWidth={5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
                {after}
              </span>
            </span>
          </h2>
        </div>

        {/* Photo in a yellow frame built from four corner pieces. Outer
            radius 20px = 12px photo radius + 8px frame (concentric). */}
        <div
          ref={frameRef}
          className="relative aspect-[3/2] p-2 lg:col-span-7 lg:row-start-2 lg:aspect-auto lg:min-h-[26rem]"
        >
          {[
            "top-0 left-0 rounded-tl-[20px] border-t-8 border-l-8",
            "top-0 right-0 rounded-tr-[20px] border-t-8 border-r-8",
            "bottom-0 left-0 rounded-bl-[20px] border-b-8 border-l-8",
            "bottom-0 right-0 rounded-br-[20px] border-r-8 border-b-8",
          ].map((pos) => (
            <div
              key={pos}
              data-corner
              aria-hidden="true"
              className={`border-impact-yellow pointer-events-none absolute h-1/2 w-1/2 ${pos}`}
            />
          ))}
          <div className="relative h-full w-full overflow-hidden rounded-[12px] outline outline-1 -outline-offset-1 outline-black/10">
            <div ref={photoRef} className="absolute -inset-3">
              <Image
                src={data.image.src}
                alt={getLocalizedText(data.image.alt, locale)}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[40%_35%]"
              />
            </div>
          </div>
        </div>

        {/* Cards: top aligns with the photo's top, bottom with its bottom. */}
        <div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-2 lg:justify-between">
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className="bg-impact-blue relative overflow-hidden rounded-[24px] [background-image:radial-gradient(circle_at_var(--mx,-50%)_var(--my,-50%),rgba(255,255,255,0.10),transparent_45%)] p-8 text-white"
          >
            <p className="text-lg text-pretty">
              {getLocalizedText(data.intro, locale)}
            </p>
          </div>
          <div
            ref={(el) => {
              cardRefs.current[1] = el;
            }}
            className="bg-impact-blue relative flex flex-col items-start gap-4 overflow-hidden rounded-[24px] [background-image:radial-gradient(circle_at_var(--mx,-50%)_var(--my,-50%),rgba(255,255,255,0.10),transparent_45%)] p-8 text-white"
          >
            {data.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-base text-pretty text-white/85">
                {getLocalizedText(paragraph, locale)}
              </p>
            ))}
            <div className="pt-2">
              <HeroCta
                href={data.cta.href}
                label={getLocalizedText(data.cta.label, locale)}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

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
 * 1. The pathway: a yellow line draws slowly down the gutter between the
 *    photo and the cards as you scroll (scrubbed), dropping a node beside
 *    each card. Desktop only.
 * 2. The frame locks together: four corner pieces of the yellow photo frame
 *    slide in and meet while the photo fades in (never scaled, so it stays
 *    at full resolution).
 * 3. On desktop with a fine pointer, the navy cards tilt toward the cursor
 *    with a soft highlight.
 *
 * Under prefers-reduced-motion everything renders in its final state: the
 * route drawn, the frame assembled, no tilt.
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
     * Lays the route out from element layout positions: a straight line
     * down the centre of the gutter between photo and cards, from the top
     * of that row to its bottom, with a node level with each card's centre.
     * Returns where each node sits along the line (0–1), so the nodes pop in
     * exactly as the line reaches them.
     *
     * Uses offsetLeft/offsetTop (which ignore transforms) rather than
     * getBoundingClientRect, so the cards can be mid-entrance, still
     * translated, when this runs.
     */
    const layoutRoute = (): number[] => {
      const svg = routeSvgRef.current;
      const route = routeRef.current;
      const frame = frameRef.current;
      const [c1, c2] = cardRefs.current;
      if (!svg || !route || !frame || !c1 || !c2) return [];

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
      const f = box(frame);
      const a = box(c1);
      const b = box(c2);

      svg.setAttribute(
        "viewBox",
        `0 0 ${section.offsetWidth} ${section.offsetHeight}`,
      );
      const x = (f.right + a.left) / 2; // centre of the gutter
      const top = Math.min(f.top, a.top) + 8;
      const bottom = Math.max(f.bottom, b.bottom) - 8;
      const nodesY = [(a.top + a.bottom) / 2, (b.top + b.bottom) / 2];

      route.setAttribute("d", `M ${x} ${top} L ${x} ${bottom}`);
      nodesY.forEach((ny, i) => {
        const node = nodeRefs.current[i];
        if (node) {
          node.setAttribute("cx", String(x));
          node.setAttribute("cy", String(ny));
        }
      });
      return nodesY.map((ny) => (ny - top) / (bottom - top));
    };

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const frameCorners = frameRef.current
        ? gsap.utils.toArray<HTMLElement>("[data-corner]", frameRef.current)
        : [];
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

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
      gsap.set(photoRef.current, { opacity: 0 });
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
        .to(
          photoRef.current,
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          0.1,
        );

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

      // Desktop only: the route and its nodes draw with the scroll. The
      // scroll range spans the whole photo-and-cards row plus some runway,
      // and the scrub eases over 1.5s, so the line draws slowly and smoothly.
      mm.add("(min-width: 1024px)", () => {
        const at = layoutRoute();
        const route = routeRef.current;
        const nodes = nodeRefs.current.filter(Boolean) as SVGCircleElement[];
        if (!route) return;
        // pathLength=1000 rather than 1: GSAP rounds px values, which would
        // snap a 1 -> 0 dash offset instead of drawing it.
        gsap.set(route, { strokeDasharray: 1000, strokeDashoffset: 1000 });
        gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 1.5,
            invalidateOnRefresh: true,
            onRefresh: layoutRoute,
          },
        });
        tl.to(route, { strokeDashoffset: 0, ease: "none", duration: 1 });
        nodes.forEach((node, i) =>
          tl.to(
            node,
            { scale: 1, duration: 0.06, ease: "back.out(3)" },
            Math.max(0, (at[i] ?? 0.5) - 0.03),
          ),
        );
      });

      // Fine pointers only: cards tilt toward the cursor.
      mm.add(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        () => {
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
          pathLength={1000}
          fill="none"
          stroke={YELLOW}
          strokeWidth={5}
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
          <h2
            ref={headingRef}
            className="text-impact-blue text-5xl leading-[1.08] font-light tracking-[-0.02em] text-balance"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-line className="block font-bold">
                {getLocalizedText(data.tagline.lead, locale)}
              </span>
            </span>{" "}
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block">
                {getLocalizedText(data.tagline.turn, locale)}
              </span>
            </span>
          </h2>
        </div>

        {/* Photo in a yellow frame built from four corner pieces. Outer
            radius 20px = 12px photo radius + 8px frame (concentric). */}
        <div
          ref={frameRef}
          className="relative p-2 lg:col-span-7 lg:row-start-2 lg:self-center"
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
          {/* The whole photo at its own 3:2 shape: never cropped, zoomed or
              moved, so it renders at full resolution. */}
          <div
            ref={photoRef}
            className="overflow-hidden rounded-[12px] outline outline-1 -outline-offset-1 outline-black/10"
          >
            <Image
              src={data.image.src}
              alt={getLocalizedText(data.image.alt, locale)}
              width={2000}
              height={1333}
              quality={90}
              sizes="(min-width: 1536px) 900px, (min-width: 1024px) 58vw, 100vw"
              className="block h-auto w-full"
            />
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

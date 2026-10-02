"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HowWePartnerContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Understand, Design, Deliver, Learn as a sequence rather than four cards.
 *
 * The steps happen in order, so they are drawn on a line: a rule runs along
 * the row on wide screens and down the column on a phone, with each step
 * marked on it. Four equal boxes would have said nothing about the order.
 */
export function HowWePartnerSection({
  data,
  locale,
}: {
  data: HowWePartnerContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        introRef.current,
        ...items,
      ].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              introRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.3",
            )
            .to(
              items,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.14,
              },
              "-=0.2",
            );

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
    <section ref={sectionRef} className="py-section bg-impact-blue w-full">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
          <p
            ref={introRef}
            className="mt-6 max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7] text-white/70"
          >
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        <ol
          ref={listRef}
          className="gap-gutter col-span-4 mt-14 grid grid-cols-1 md:col-span-8 lg:col-span-12 lg:mt-20 lg:grid-cols-4"
        >
          {data.steps.map((step, index) => (
            <li
              key={index}
              className="relative flex flex-col gap-3 border-t border-white/25 pt-6"
            >
              {/* The marker sits on the rule, so the four read as points along
                  one line rather than as four separate boxes. */}
              <span
                aria-hidden="true"
                className="bg-impact-yellow absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full"
              />
              <span className="text-[0.75rem] text-white/40 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[clamp(1.125rem,1.4vw,1.25rem)] font-medium text-white">
                {getLocalizedText(step.title, locale)}
              </h3>
              <p className="text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.65] text-white/70">
                <span className="text-impact-yellow">
                  {getLocalizedText(step.lead, locale)}:
                </span>{" "}
                {getLocalizedText(step.description, locale)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

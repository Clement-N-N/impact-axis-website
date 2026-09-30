"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurWorkClosingContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OurWorkClosingCta({
  data,
  locale,
}: {
  data: OurWorkClosingContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current
        ? gsap.utils.toArray<HTMLElement>(cardsRef.current.children)
        : [];

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(cards, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(cards, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(self.lines, {
            yPercent: 0,
            duration: 0.6,
            ease: "power4.out",
            stagger: 0.12,
          }).to(
            cards,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.12,
            },
            "-=0.3",
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
        <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3">
          <h2 className="text-center text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.25] font-medium text-white">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>

          <div
            ref={cardsRef}
            className="gap-gutter mt-14 grid grid-cols-1 md:grid-cols-2"
          >
            {data.cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 border-t border-white/20 pt-6"
              >
                <h3 className="text-[clamp(1.125rem,1.4vw,1.25rem)] font-medium text-white">
                  {getLocalizedText(card.title, locale)}
                </h3>
                <p className="text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-white/70">
                  {getLocalizedText(card.description, locale)}
                </p>

                {card.cta.href.startsWith("#") ? (
                  <a
                    href={card.cta.href}
                    className="text-impact-yellow group mt-2 inline-flex w-fit items-center gap-2 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium"
                  >
                    {getLocalizedText(card.cta.label, locale)}
                    <ArrowRightIcon
                      weight="bold"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                ) : (
                  <Link
                    href={card.cta.href}
                    className="text-impact-yellow group mt-2 inline-flex w-fit items-center gap-2 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium"
                  >
                    {getLocalizedText(card.cta.label, locale)}
                    <ArrowRightIcon
                      weight="bold"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

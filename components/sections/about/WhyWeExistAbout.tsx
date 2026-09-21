"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WhyWeExistAboutContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function WhyWeExistAbout({
  data,
  locale,
}: {
  data: WhyWeExistAboutContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const paragraphItems = paragraphsRef.current
        ? gsap.utils.toArray<HTMLElement>(paragraphsRef.current.children)
        : [];
      if (!taglineRef.current) return;

      split = SplitText.create(taglineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set([eyebrowRef.current, ...paragraphItems, ctaRef.current], {
              opacity: 1,
              y: 0,
            });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set([eyebrowRef.current, ...paragraphItems, ctaRef.current], {
            opacity: 0,
            y: 20,
          });
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
            .to(paragraphItems, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.18,
            })
            .to(
              ctaRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
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
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <div className="col-span-4 h-full md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 flex flex-col gap-8 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h2
            ref={taglineRef}
            className="text-impact-blue text-[clamp(1rem,1.25vw,1.125rem)] font-medium italic"
          >
            {getLocalizedText(data.tagline, locale)}
          </h2>

          <div ref={paragraphsRef} className="flex flex-col gap-6">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1.45] text-black"
                    : "text-impact-gray text-[clamp(0.9375rem,1.05vw,1rem)]"
                }
              >
                {getLocalizedText(paragraph, locale)}
              </p>
            ))}
          </div>

          <div ref={ctaRef}>
            <Button
              href={data.cta.href}
              variant="primary"
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            >
              {getLocalizedText(data.cta.label, locale)}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { PartnershipContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function PartnershipSection({
  data,
  locale,
}: {
  data: PartnershipContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const logosRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const logoItems = logosRef.current
        ? gsap.utils.toArray<HTMLElement>(logosRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        introRef.current,
        ...logoItems,
        ctaRef.current,
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
            .to(introRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            })
            // Ten logos at the group stagger would take almost a second to
            // finish, so they get a tighter interval than the 0.08s default.
            .to(
              logoItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
                stagger: 0.04,
              },
              "-=0.2",
            )
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

        {/* Left column holds the eyebrow and the section heading; the right
            column leads with the large CTA paragraph, as in the design. */}
        <div className="col-span-4 flex flex-col gap-8 md:col-span-8 lg:col-span-4">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
          
        </div>

        <p
          ref={introRef}
          className="col-span-4 mt-6 text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.4] text-black md:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-0"
        >
          {getLocalizedText(data.ctaParagraph, locale)}
        </p>

        {/* Logos are a list of organisations, so they are marked up as one.
            Three columns at most, per the design. The partner's name sits
            under its mark rather than living only in the alt attribute, so it
            reads for everyone — several of these logos are wordless symbols. */}
        <ul
          ref={logosRef}
          className="gap-gutter col-span-4 mt-12 grid grid-cols-1 sm:grid-cols-2 md:col-span-8 md:grid-cols-3 lg:col-span-7 lg:col-start-6"
        >
          {data.logos.map((logo) => (
            <li
              key={logo.name}
              className="border-border flex flex-col items-center justify-between gap-4 border p-6"
            >
              <div className="relative h-16 w-full">
                <Image
                  src={logo.logoUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-contain"
                />
              </div>
              <span className="text-impact-gray text-center text-[clamp(0.8125rem,0.95vw,0.9375rem)]">
                {logo.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Sits at the bottom of the left column, beside the logo grid, which
            is where the design puts this block. */}
        <div
          ref={ctaRef}
          className="col-span-4 mt-12 flex flex-col gap-5 md:col-span-8 lg:col-span-4 lg:col-start-2 lg:mt-16"
        >
          <h3 className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-medium text-black">
            {getLocalizedText(data.ctaHeadline, locale)}
          </h3>
          <p className="text-impact-gray text-[clamp(0.9375rem,1.05vw,1rem)]">
            {getLocalizedText(data.intro, locale)}
          </p>
          <div className="mt-2">
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

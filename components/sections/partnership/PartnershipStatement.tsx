"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PartnershipStatementProps = {
  statement: LocalizedText;
  locale: Locale;
};

/**
 * The large framing statement between the image and the contact form. It's a
 * `<p>`, not a heading — it's a full sentence of prose rather than a section
 * title, so it takes the house fade-up rather than the masked line-stagger
 * reserved for headings.
 */
export function PartnershipStatement({
  statement,
  locale,
}: PartnershipStatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (!statementRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(statementRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(statementRef.current, { opacity: 0, y: 20 });

      gsap.to(statementRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <p
          ref={statementRef}
          className="col-span-4 text-[clamp(1.375rem,2.4vw,2.125rem)] leading-[1.35] font-medium text-black md:col-span-8 lg:col-span-8 lg:col-start-5"
        >
          {getLocalizedText(statement, locale)}
        </p>
      </Container>
    </section>
  );
}

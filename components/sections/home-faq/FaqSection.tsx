"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HomeFaqContent } from "./types";
import { FaqAccordionItem } from "./FaqAccordionItem";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function FaqSection({ data, locale }: { data: HomeFaqContent; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);
  // Note: the "Contact us" Button is deliberately excluded from these targets
  // (section-animations skill) — only the heading above it fades up.
  const stillHaveQuestionsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, faqListRef.current, stillHaveQuestionsHeadingRef.current];

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 20 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
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
    <section ref={sectionRef} className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 h-full md:col-span-8 lg:col-span-4">
          <span ref={eyebrowRef} className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div
          ref={faqListRef}
          className="col-span-4 border-b border-border md:col-span-8 lg:col-span-6 lg:col-start-7"
        >
          {data.faqs.map((item, index) => (
            <FaqAccordionItem
              key={index}
              item={item}
              locale={locale}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              panelId={`${baseId}-panel-${index}`}
            />
          ))}
        </div>

        <div className="col-span-4 mt-16 flex flex-col items-start gap-6 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <h3 ref={stillHaveQuestionsHeadingRef} className="text-[clamp(1.5rem,2.375vw,2rem)] font-medium text-black">
            {getLocalizedText(data.stillHaveQuestionsHeading, locale)}
          </h3>
          <Button
            href={data.contactButton.href}
            variant="primary"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.contactButton.label, locale)}
          </Button>
        </div>
      </Container>
    </section>
  );
}

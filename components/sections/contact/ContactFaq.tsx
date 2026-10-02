"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { FaqItem } from "@/components/sections/home-faq/types";
import type { Locale } from "@/i18n/routing";
import { contactContent as c } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The FAQ (from Sanity) as a numbered accordion under the contact form.
 * One item open at a time; the first starts open. Panels open with a
 * grid-rows transition, and the plus turns into a cross.
 */
export function ContactFaq({
  faqs,
  locale,
}: {
  faqs: FaqItem[];
  locale: Locale;
}) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-faq]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  if (!faqs.length) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-faq-title"
      className="py-section w-full bg-white"
    >
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col items-start gap-5 lg:col-span-4">
          <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
            {t(c.faq.eyebrow)}
          </span>
          <h2
            id="contact-faq-title"
            className="text-impact-blue text-4xl leading-[1.08] font-semibold tracking-[-0.025em] text-balance"
          >
            {t(c.faq.headline)}
          </h2>
          <a
            href="#contact-title"
            className="text-impact-blue text-sm font-semibold underline underline-offset-4 hover:no-underline"
          >
            {t(c.faq.still)}
          </a>
        </div>

        <ul className="flex flex-col gap-3 lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                data-faq
                data-open={isOpen}
                className="group rounded-[22px] bg-[#f4f6fc] transition-[background-color,box-shadow] duration-300 data-[open=true]:bg-white data-[open=true]:shadow-[0_20px_40px_-24px_rgb(16_27_98/0.45)] data-[open=true]:outline data-[open=true]:outline-1 data-[open=true]:outline-black/[0.06]"
              >
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="text-impact-blue focus-visible:outline-impact-blue flex w-full items-center gap-4 rounded-[22px] px-5 py-5 text-left text-lg font-semibold focus-visible:outline-2 md:px-7 md:py-6"
                  >
                    <span className="text-impact-blue/40 w-7 shrink-0 text-sm tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-pretty">{t(f.question)}</span>
                    <span
                      aria-hidden="true"
                      className="group-data-[open=true]:bg-impact-yellow inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white transition-[background-color,rotate] duration-300 group-data-[open=true]:rotate-45"
                    >
                      <PlusIcon weight="bold" className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  inert={!isOpen}
                  className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[open=true]:grid-rows-[1fr]"
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[64ch] px-5 pb-6 pl-[4.25rem] text-base text-pretty whitespace-pre-line text-black/70 md:px-7 md:pb-7 md:pl-[4.75rem]">
                      {t(f.answer)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { OurProgrammesContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function OurProgrammesSection({
  data,
  locale,
}: {
  data: OurProgrammesContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const fadeTargets = [eyebrowRef.current, introRef.current].filter(Boolean);

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set([...fadeTargets, ...items], { opacity: 1, y: 0 });
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
            );

          // Each programme is tall enough to be its own reveal rather than part
          // of the heading timeline, so it animates as the reader reaches it.
          items.forEach((item) => {
            gsap.set(item, { opacity: 0, y: 24 });
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%", once: true },
            });
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
      id="programmes"
      className="py-section bg-impact-blue w-full scroll-mt-24"
    >
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-2">
          <span
            ref={eyebrowRef}
            className="text-[clamp(0.875rem,1.05vw,1rem)] text-white/60"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-8 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
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

        <div
          ref={listRef}
          className="col-span-4 mt-14 flex flex-col gap-14 md:col-span-8 lg:col-span-9 lg:col-start-4"
        >
          {data.programmes.map((programme) => (
            <article
              key={programme.id}
              id={programme.id}
              className="gap-gutter grid scroll-mt-24 grid-cols-1 border-t border-white/20 pt-8 lg:grid-cols-9"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:col-span-4 lg:aspect-[3/2]">
                <Image
                  src={programme.image.src}
                  alt={getLocalizedText(programme.image.alt, locale)}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 lg:col-span-5">
                <h3 className="text-[clamp(1.25rem,1.6vw,1.5rem)] font-medium text-white">
                  {getLocalizedText(programme.title, locale)}
                </h3>
                <p className="text-impact-yellow text-[clamp(0.9375rem,1.1vw,1rem)]">
                  {getLocalizedText(programme.tagline, locale)}
                </p>
                <p className="text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-white/70">
                  {getLocalizedText(programme.description, locale)}
                </p>

                {programme.cta ? (
                  <Link
                    href={programme.cta.href}
                    className="text-impact-yellow group mt-2 inline-flex w-fit items-center gap-2 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium"
                  >
                    {getLocalizedText(programme.cta.label, locale)}
                    <ArrowRightIcon
                      weight="bold"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

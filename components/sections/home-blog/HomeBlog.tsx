"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { homeBlogContent } from "./data";
import { BlogCard } from "./BlogCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeBlog({ locale }: { locale: Locale }) {
  const data = homeBlogContent;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const secondaryColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, mainCardRef.current, secondaryColRef.current];

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
    <section ref={sectionRef} className="w-full bg-[#F5F1E8] py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:row-start-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:row-start-1">
          <span ref={eyebrowRef} className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div
          ref={mainCardRef}
          className="col-span-4 md:col-span-8 lg:col-span-7 lg:row-start-2 lg:border-r lg:border-border lg:pr-10"
        >
          <BlogCard post={data.posts[0]} locale={locale} readMoreLabel={data.readMoreLabel} />
        </div>

        <div
          ref={secondaryColRef}
          className="col-span-4 flex flex-col justify-between gap-8 md:col-span-8 lg:col-span-5 lg:row-start-2 lg:pl-5"
        >
          <BlogCard
            post={data.posts[1]}
            locale={locale}
            readMoreLabel={data.readMoreLabel}
            variant="horizontal"
          />
          <BlogCard
            post={data.posts[2]}
            locale={locale}
            readMoreLabel={data.readMoreLabel}
            variant="horizontal"
          />
          <Link
            href={data.moreNewsButton.href}
            className="border border-border px-8 py-3 text-center text-sm text-black"
          >
            {getLocalizedText(data.moreNewsButton.label, locale)}
          </Link>
        </div>
      </Container>
    </section>
  );
}

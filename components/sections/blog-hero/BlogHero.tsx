"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/sections/blog-card";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/components/sections/blog-card/types";
import type { BlogHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BlogHero({
  data,
  posts,
  locale,
}: {
  data: BlogHeroContent;
  posts: BlogPost[];
  locale: Locale;
}) {
  const [featuredPost, compactPost] = posts;

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const compactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [titleRef.current, featuredRef.current, compactRef.current];

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
        <div className="hidden h-full lg:col-span-1 lg:row-start-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:row-start-1">
          <h1 ref={titleRef} className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium text-black">
            {getLocalizedText(data.title, locale)}
          </h1>
        </div>

        {featuredPost && (
          <div
            ref={featuredRef}
            className="col-span-4 mt-5 md:col-span-8 lg:col-span-8 lg:row-start-2 lg:mt-8"
          >
            <BlogCard post={featuredPost} locale={locale} readMoreLabel={data.readMoreLabel} variant="featured" />
          </div>
        )}

        {compactPost && (
          <div
            ref={compactRef}
            className="col-span-4 mt-5 md:col-span-8 lg:col-span-4 lg:row-start-2 lg:mt-8"
          >
            <BlogCard post={compactPost} locale={locale} readMoreLabel={data.readMoreLabel} variant="compact" />
          </div>
        )}
      </Container>
    </section>
  );
}

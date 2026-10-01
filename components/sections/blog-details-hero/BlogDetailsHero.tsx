"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/sections/parallax-image";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate, type BlogPostDetail } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl } from "@/sanity/image";
import { AuthorCard } from "./AuthorCard";
import { ShareButtons } from "./ShareButtons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function BlogDetailsHero({ post, locale }: { post: BlogPostDetail; locale: Locale }) {
  const imageSrc = resolveSanityImageUrl(post.image, 1600, 1000);

  const titleSectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaSectionRef = useRef<HTMLElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const titleCtx = gsap.context(() => {
      if (!titleRef.current) return;

      split = SplitText.create(titleRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(self.lines, { yPercent: 100 });

          return gsap.to(self.lines, {
            yPercent: 0,
            duration: 0.6,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: titleSectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        },
      });
    }, titleSectionRef);

    const metaCtx = gsap.context(() => {
      if (!dateRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(dateRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(dateRef.current, { opacity: 0, y: 16 });
      gsap.to(dateRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: metaSectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, metaSectionRef);

    return () => {
      titleCtx.revert();
      split?.revert();
      metaCtx.revert();
    };
  }, []);

  return (
    <>
      <section ref={titleSectionRef} className="w-full bg-white pt-section">
        <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-1 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
          </div>

          <div className="col-span-4 mb-10 md:col-span-8 lg:col-span-8">
            <h1 ref={titleRef} className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium text-black">
              {getLocalizedText(post.title, locale)}
            </h1>
          </div>
        </Container>
      </section>

      {imageSrc && (
        <ParallaxImage src={imageSrc} heightClass="aspect-[16/10] sm:aspect-auto sm:h-[60vh] lg:h-[80vh] min-h-[240px]" padded={false} reveal exitGradient />
      )}

      <section ref={metaSectionRef} className="w-full bg-white pt-6 pb-section">
        <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="hidden h-full lg:col-span-1 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
          </div>

          <div className="col-span-4 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between md:col-span-8 lg:col-span-11">
            <div className="flex flex-col gap-3">
              <AuthorCard author={post.author} role={post.authorRole} locale={locale} />
              <span ref={dateRef} className="text-sm text-impact-gray">
                {formatBlogDate(post.date, locale)}
              </span>
            </div>

            <ShareButtons title={post.title} locale={locale} />
          </div>
        </Container>
      </section>
    </>
  );
}

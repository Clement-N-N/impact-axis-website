"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogAuthor } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl } from "@/sanity/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AuthorCard({
  author,
  role,
  locale,
}: {
  author: BlogAuthor;
  role: LocalizedText;
  locale: Locale;
}) {
  const imageSrc = resolveSanityImageUrl(author.image, 80, 80);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cardRef.current, { opacity: 0, y: 16 });
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-impact-gray/10">
        {imageSrc && <Image src={imageSrc} alt="" fill className="object-cover" />}
      </div>
      <div>
        <p className="font-medium text-black">{author.name}</p>
        <p className="!text-xs text-impact-gray">{getLocalizedText(role, locale)}</p>
      </div>
    </div>
  );
}

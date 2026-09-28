"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogCategory } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CategoryList({
  heading,
  viewAllLabel,
  categories,
  activeCategory,
  locale,
}: {
  heading: LocalizedText;
  viewAllLabel: LocalizedText;
  categories: BlogCategory[];
  activeCategory?: string;
  locale: Locale;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headingRowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];
      const targets = [headingRowRef.current, ...items].filter(
        (el): el is HTMLElement => !!el,
      );

      if (targets.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 16 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [categories]);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-4 border-t border-border pt-6">
      <div ref={headingRowRef} className="flex items-center justify-between gap-2">
        <p className="font-medium text-black">{getLocalizedText(heading, locale)}</p>
        {activeCategory && (
          <Link href="/blog" className="text-sm text-impact-gray underline hover:text-black">
            {getLocalizedText(viewAllLabel, locale)}
          </Link>
        )}
      </div>
      <ul ref={listRef} className="flex flex-col gap-3">
        {categories.map((category) => {
          const isActive = category.slug === activeCategory;
          return (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={clsx(isActive ? "font-medium text-black" : "text-impact-gray hover:text-black")}
              >
                {getLocalizedText(category.title, locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

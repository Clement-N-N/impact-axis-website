"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlogCard } from "@/components/ui/BlogCard";
import { BlogContentLayout } from "@/components/sections/blog-content-layout";
import { PromoCard } from "@/components/ui/PromoCard";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/components/sections/blog-card/types";
import { blogBodyContent } from "./data";
import { CategoryList } from "./CategoryList";
import type { BlogCategory } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BlogBody({
  posts,
  categories,
  activeCategory,
  locale,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
  activeCategory?: string;
  locale: Locale;
}) {
  const data = blogBodyContent;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const items = listRef.current
        ? gsap.utils.toArray<HTMLElement>(listRef.current.children)
        : [];

      if (items.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 20 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, listRef);

    return () => ctx.revert();
  }, [posts]);

  return (
    <BlogContentLayout
      main={
        <div ref={listRef} className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="py-8 first:pt-0">
              <BlogCard post={post} locale={locale} readMoreLabel={data.readMoreLabel} variant="list" />
            </div>
          ))}
        </div>
      }
      sidebar={
        <>
          <PromoCard content={data.promoCard} locale={locale} />
          <CategoryList
            heading={data.categoriesHeading}
            viewAllLabel={data.viewAllCategoriesLabel}
            categories={categories}
            activeCategory={activeCategory}
            locale={locale}
          />
        </>
      }
    />
  );
}

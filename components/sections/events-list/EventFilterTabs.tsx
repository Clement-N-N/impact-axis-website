"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tabStyles = cva(
  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      active: {
        true: "bg-impact-yellow text-black",
        false: "border border-border bg-white text-black hover:border-black",
      },
    },
    defaultVariants: { active: false },
  },
);

export function EventFilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Entrance-only reveal (click/hover feedback is explicitly out of scope,
  // see #31). Each tab computes its own position among its siblings so the
  // row of tabs staggers in together without EventsList needing to own the
  // animation itself.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const siblings = el.parentElement
      ? Array.from(el.parentElement.children)
      : [el];
    const index = siblings.indexOf(el);

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 16 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: Math.max(index, 0) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
      });
    }, buttonRef);

    return () => ctx.revert();
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(tabStyles({ active }))}
    >
      {label}
      {typeof count === "number" && <sup className="ml-1">{count}</sup>}
    </button>
  );
}

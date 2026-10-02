"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * A figure like "$1.5M+" whose digits roll into place, odometer style, when
 * it scrolls into view. Each digit is a column 0–9 that slides to its value;
 * other characters ($ . M + %) stay put. The real value is the accessible
 * name and the only text in the DOM; with reduced motion (or no JS) the
 * final digits simply show.
 */
export function Odometer({
  value,
  className = "",
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = Array.from(el.querySelectorAll<HTMLElement>("[data-col]"));
    const ctx = gsap.context(() => {
      cols.forEach((col, i) => {
        const d = Number(col.dataset.col);
        gsap.fromTo(
          col,
          { translate: "none", y: 0, yPercent: 0 },
          {
            y: 0,
            yPercent: -(d + 10) * (100 / 20),
            duration: 1.6 + i * 0.15,
            ease: "power3.out",
            delay,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [value, delay]);

  return (
    <span
      ref={ref}
      role="img"
      aria-label={value}
      className={`inline-flex items-baseline tabular-nums ${className}`}
    >
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block h-[1em] overflow-hidden leading-none"
          >
            <span className="invisible">{ch}</span>
            {/* Two runs of 0–9 so every digit travels at least a full turn.
                The digits are CSS-generated (.odometer-col in globals.css)
                so the page text, which crawlers and AI tools read, is just
                the real figure. At rest (no JS) the column sits on it. */}
            <span
              data-col={ch}
              className="odometer-col absolute inset-x-0 top-0 block leading-none translate-y-[calc(var(--d)*-5%)]"
              style={{ "--d": Number(ch) + 10 } as React.CSSProperties}
            />
          </span>
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className="leading-none whitespace-pre"
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

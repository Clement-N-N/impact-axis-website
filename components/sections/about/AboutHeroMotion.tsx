"use client";

import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

/**
 * Client-only motion pieces for the About hero. The hero components
 * themselves stay server components and pass their server-rendered copy in
 * as children, so only these wrappers ship as client JS.
 *
 * Under prefers-reduced-motion every piece renders in its final state: no
 * entrance, no parallax, no colour sweep.
 */

/** Strong ease-out: fast start, long settle. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  // ~100ms between semantic chunks (better-ui: split and stagger enters).
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** Staggers its `HeroStaggerItem` children in, one semantic chunk at a time. */
export function HeroStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={stagger}
      initial={reduce ? false : "hidden"}
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={rise} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Highlighted headline words start white and warm to brand yellow once the
 * headline has landed, drawing the eye to the key phrase.
 */
export function HeroHighlight({
  children,
  delay = 0.9,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      initial={reduce ? false : { color: "#ffffff" }}
      animate={{ color: "#f4c600" /* impact-yellow */ }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Photographic subject: rises into frame after the copy, then drifts at a
 * slower rate than the page while scrolling.
 */
export function HeroSubjectMotion({
  children,
  className,
  delay = 0.35,
  rise: riseBy = 60,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  rise?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <motion.div style={reduce ? undefined : { y }} className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: riseBy }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE_OUT }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

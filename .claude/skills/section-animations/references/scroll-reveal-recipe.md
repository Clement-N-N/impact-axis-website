# Scroll-reveal implementation recipe

## Which GSAP setup to use

This codebase has two existing GSAP cleanup conventions, used for two
different situations — match the one that fits, don't invent a third:

1. **Plain `useEffect` + `gsap.timeline()`/`gsap.to()` + manual `.kill()`**
   — used for non-scroll animation (hover dimming, click-triggered reveals)
   in `Navbar.tsx`, `MobileNav.tsx`, `MegaMenu.tsx`.
2. **`gsap.context()` scoped to a ref + `ScrollTrigger` + `ctx.revert()`**
   — used specifically for scroll-driven animation in
   `components/sections/parallax-image/ParallaxImage.tsx`. `gsap.context()`
   scopes any selectors used inside it and its `.revert()` cleans up
   everything created within — including the `ScrollTrigger` instance —
   which is exactly what you want for a scroll-triggered reveal.

Since this skill is entirely about scroll-triggered reveals, **use pattern
2** — it's already established for exactly this purpose in this codebase.
This app does not use `@gsap/react`'s `useGSAP` hook anywhere; don't
introduce that dependency for a single component's animation. If the whole
codebase later migrates to `useGSAP` for its automatic cleanup, that's a
separate, deliberate decision — not something to do incidentally here.

## The recipe

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExampleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, headlineRef.current, paragraphsRef.current].filter(
        (el): el is HTMLElement => !!el,
      );

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
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} /* ...existing className, unchanged... */>
      {/* ...existing JSX, only adding refs to the elements above... */}
    </section>
  );
}
```

Key details:
- `start: "top 80%"` fires the reveal once the section is 80% of the way up
  the viewport (i.e., mostly visible) — no `end`/`scrub` needed since this
  is a one-time reveal, not a continuous scroll-tied effect. This differs
  from `ParallaxImage.tsx`'s `scrub: true` setup, which is a genuinely
  continuous effect.
- By default a `ScrollTrigger` without `once: true` will reverse the
  animation if the user scrolls back up past the trigger and re-fires it
  scrolling down again. For a subtle content reveal, add
  `scrollTrigger: { trigger: ..., start: "top 80%", once: true }` so it
  plays once and stays — re-triggering a fade-up every time someone scrolls
  past a section is exactly the kind of over-animation this skill's "Never"
  list warns about.
- The `prefersReducedMotion` branch sets the final state immediately via
  `gsap.set` instead of animating to it — the content is never hidden or
  delayed for these users, it's just not animated. See
  `references/prefers-reduced-motion.md` for why this exact shape (skip the
  animation, don't skip the content) is the right approach.

## Applying it to this app's actual static sections

**`components/sections/why-we-exist/WhyWeExist.tsx`** — three natural
groups: the eyebrow `span`, the `h2` headline, and the paragraph/gap-6 `div`
wrapping the body copy. Add refs to each, apply the recipe above with a
stagger across the three.

**`components/sections/home-solution/HomeSolution.tsx`** — similar shape,
plus an image in its own grid cell and a `<Button>` in the headline column.
Include the image in the stagger group (it can use the same fade-up, or a
slightly slower scale-in from `scale: 1.05` if you want the image to read
distinctly from the text). **Do not** add the `<Button>` to the animated
targets — leave it exactly as it renders today, per SKILL.md's explicit
exclusion.

For a hero variant's static text block (headline + CTA row, e.g.
`CollageDarkHero.tsx`), the same reveal works on page load rather than
scroll — either drop the `scrollTrigger` config entirely and let the
timeline play on mount (most heroes are the first thing visible, so "on
scroll into view" and "on mount" are effectively the same trigger), or keep
`ScrollTrigger` with a `start` value that accounts for the hero already
being in view at load. Whichever you choose, again exclude the CTA button
itself from the animated targets.

## Multiple sections, one page: keep the timing consistent

If several sections down a page all get this treatment, reuse the exact same
duration/easing/stagger values across them (per `motion-style-guide.md`) —
variation for its own sake reads as inconsistent, not interesting. The
"judgment" part of this skill is deciding *which* sections deserve the
treatment and how to group their content, not inventing new timing values
per section.

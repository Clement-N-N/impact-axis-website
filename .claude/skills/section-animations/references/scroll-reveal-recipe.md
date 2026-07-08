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

## The recipe (non-title content: eyebrow, paragraphs, image, cards)

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
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [eyebrowRef.current, paragraphsRef.current].filter(
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
          once: true,
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

## Title reveal: masked line stagger (house standard for h1/h2)

Titles don't use the plain fade-up above. They use a **masked line-stagger
reveal**, modeled directly on the title animation on the Lenis/
darkroom.engineering site (lenis.dev): each line of the headline slides up
from fully hidden — no opacity change, a pure clip/slide — one after
another, inside an overflow-hidden mask generated automatically per line.

This uses GSAP's `SplitText` plugin. As of `gsap@3.13`, all of GSAP's
former "Club GreenSock" bonus plugins — including `SplitText`,
`MorphSVGPlugin`, `DrawSVGPlugin`, etc. — are free and bundled in the base
`gsap` install (this happened after GSAP's acquisition by Webflow). This
app is on `gsap@3.15.0`, confirmed via `node_modules/gsap/SplitText.js`
already being present, so importing `SplitText` is **not** a new dependency
and doesn't need the Step 5-style confirmation that a genuinely new package
would.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
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

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const fadeTargets = [eyebrowRef.current, paragraphsRef.current].filter(
        (el): el is HTMLElement => !!el,
      );

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              paragraphsRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.2",
            );

          // Returning the timeline lets SplitText kill/redo it cleanly if
          // autoSplit re-runs after a responsive re-wrap.
          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} /* ...existing className, unchanged... */>
      {/* h2 needs no manual overflow-hidden wrapper — mask: "lines" adds
          one automatically per line and removes it on split.revert(). */}
    </section>
  );
}
```

Key details:
- `mask: "lines"` wraps each split line in its own `overflow: hidden`
  container automatically — don't hand-write a wrapping `<div
  className="overflow-hidden">` around the heading yourself; SplitText
  manages (and cleans up) that markup.
- `autoSplit: true` re-splits the text and re-runs `onSplit` if the
  headline re-wraps into a different number of lines at another breakpoint
  (this app's fluid `clamp()` type scale means line counts can shift across
  the responsive range). Returning the timeline from `onSplit` lets
  SplitText kill and rebuild it cleanly on re-split instead of leaving
  orphaned tweens.
- `yPercent: 100 → 0` with **no opacity change** is the whole point of this
  recipe — it's a clip/slide reveal, not a fade. Don't add `opacity: 0` to
  the line targets; that changes the character of the effect back into a
  fade-up and defeats the reason this recipe exists as a separate pattern.
- `power4.out` (not `power3.out`) and a slightly longer duration (0.6s vs.
  0.5s) reads better for this snappier, more graphic reveal than the
  gentler fade-up easing used elsewhere — this is an intentional, confirmed
  deviation from the single global easing value, scoped specifically to
  this title recipe. Don't drift the fade-up content groups toward
  `power4.out` too; the contrast between the two eases is part of why the
  title reads as a distinct, more graphic moment.
- Accessibility: SplitText's masked split preserves the full original
  headline text for assistive tech (it sets an `aria-label` on the split
  container with the untouched string and marks the generated line/mask
  spans `aria-hidden`), so screen reader users get the same content as
  sighted users — this doesn't reopen the a11y gap the
  `accessible-components` skill flags elsewhere in this app.
- `split.revert()` in the cleanup function restores the original DOM
  (removing the line-wrapping spans) — always pair it with `ctx.revert()`,
  not instead of it.
- Only use this recipe for the section's actual `h1`/`h2` title. Don't
  apply line-splitting to eyebrows (single short line — no visual benefit)
  or paragraphs (Step 2's "Never" list already rules out that granularity
  of stagger for body copy).

## Applying it to this app's actual static sections

**`components/sections/why-we-exist/WhyWeExist.tsx`** — eyebrow `span` and
paragraph `div` use the plain fade-up; the `h2` headline uses the masked
line-stagger recipe above. All three are sequenced in one
`gsap.timeline()`: eyebrow fades in, the headline's lines stagger up
overlapping the tail of that fade, then the paragraph block fades in
overlapping the tail of the headline.

**`components/sections/home-solution/HomeSolution.tsx`** — same shape, plus
an image in its own grid cell and a `<Button>` in the headline column. The
`h2` headline gets the masked line-stagger; eyebrow, paragraphs, and image
share the plain fade-up (image can stagger alongside the paragraphs, or use
a slightly slower scale-in from `scale: 1.05` if you want it to read
distinctly from the text). **Do not** add the `<Button>` to the animated
targets — leave it exactly as it renders today, per SKILL.md's explicit
exclusion.

For a hero variant's static text block (headline + CTA row, e.g.
`CollageDarkHero.tsx`), the same title recipe works on page load rather than
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
per section. The one accepted split is title vs. everything-else: every
title across every section uses the same masked line-stagger numbers
(`power4.out`, 0.6s, 0.12s stagger); every non-title group uses the same
fade-up numbers (`power3.out`, 0.5s, 0.08s stagger). Don't invent a third
set of values for a specific section without flagging why it needs to
differ.

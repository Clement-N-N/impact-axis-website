# Adding Lenis smooth scroll (proposal-only — not applied by default)

This is reference material for *if* the user asks to add Lenis, not
something to install while carrying out a per-section animation task. It's a
new dependency and it wraps the entire app's scroll behavior, not just one
component — treat it the way the sibling skills in this repo treat any new
dependency or app-wide architectural change: propose it, get confirmation,
then do it once, deliberately.

## Does it work well with GSAP? Yes — this is a standard, well-supported pairing

Lenis (now maintained by Darkroom Engineering; the old `@studio-freight/*`
packages are retired) intercepts native scroll and drives it with
interpolation for a smooth, weighted feel. GSAP's `ScrollTrigger` — already
used in this codebase (`components/sections/parallax-image/ParallaxImage.tsx`)
— reads scroll position to drive animation. The two need to be told to run
on the same frame loop, or `ScrollTrigger` positions can jitter by a frame or
two against Lenis's smoothed position. This is a known, well-documented
integration, not an experimental combination.

## Current setup (as of this writing — verify against the packages' own docs if time has passed)

Install: `npm install lenis` (no `@gsap/react` required unless you also want
its `useGSAP` hook, which this codebase doesn't currently use — see
`references/scroll-reveal-recipe.md` on matching the existing
`gsap.context()` convention instead).

Add a client component wrapping the app, and mount it in the root layout —
in this codebase that's `app/[locale]/layout.tsx`, inside the
`NextIntlClientProvider`, wrapping `<Navbar />`/`<MobileNav />`/`{children}`:

```tsx
// components/layout/SmoothScroll.tsx
"use client";

import { useRef, useEffect } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<{ lenis?: { raf: (time: number) => void } }>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return; // native scroll for these users, see below

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    ScrollTrigger.refresh();
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.1, duration: 1.5, syncTouch: true, autoRaf: false }}
    >
      {children}
    </ReactLenis>
  );
}
```

Key details (current as of Lenis 1.x / GSAP 3.12+, per Lenis's own
migration notes — re-verify if this file feels stale, package APIs do
change):
- Import from `lenis/react`, not `@studio-freight/react-lenis` — that
  package is retired.
- `syncTouch: true` is the current replacement for the removed
  `smoothTouch` option.
- `autoRaf: false` on `ReactLenis`, paired with adding Lenis's `raf` method
  to `gsap.ticker`, keeps Lenis and `ScrollTrigger` on the same frame loop —
  this is the fix for the "ScrollTrigger jitters/lags behind smooth scroll"
  problem.
- `ScrollTrigger.refresh()` after mount recalculates trigger positions once
  Lenis is controlling scroll — without it, triggers calculated against
  native scroll can be off.
- `gsap.registerPlugin(ScrollTrigger)` at module scope, once — matches how
  `ParallaxImage.tsx` already registers it.

## Respecting prefers-reduced-motion for the smooth-scroll layer itself

This is a different, app-wide concern from the per-section reveal handling
in `references/prefers-reduced-motion.md` — smooth-scroll interpolation
itself can be uncomfortable for people with vestibular sensitivity,
independent of any individual reveal animation. The snippet above simply
skips mounting Lenis's RAF-sync effect for reduced-motion users, which
leaves native (instant) scroll in place. Confirm this is still correct
against Lenis's current docs at integration time — this is exactly the kind
of detail that's easy to get subtly wrong (e.g. still rendering `ReactLenis`
with default options for these users) and worth double-checking rather than
copying blind.

## What happens to the existing `ParallaxImage.tsx` ScrollTrigger

Once Lenis + the RAF sync above is in place, `ParallaxImage.tsx`'s existing
`ScrollTrigger` needs **no code changes** — it continues to work exactly as
written, because the sync happens at the frame-loop level (`gsap.ticker`),
not per-`ScrollTrigger`-instance. The same is true for any new
`ScrollTrigger`-based section reveal added via
`references/scroll-reveal-recipe.md`. This is worth stating plainly in your
report if you set this up, since it's easy for a reviewer to assume every
existing scroll animation needs individual updates — it doesn't, as long as
the sync wiring above is correct.

## Sequencing if both are requested in the same task

If asked to both add Lenis and animate a section in one go: set up Lenis
first (Step above), confirm `ParallaxImage.tsx`'s existing parallax still
feels right with smooth scroll active (the interpolated scroll position
changes the *feel* of a scrub-linked animation even though no code changes),
then add new section reveals. Doing it in the other order risks tuning a
reveal's feel against native scroll and then having Lenis change that feel
underneath it.

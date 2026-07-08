# prefers-reduced-motion: mandatory, not optional

This app has zero `prefers-reduced-motion` handling anywhere today (the
`accessible-components` skill in this repo flags the same gap for the
existing nav/hero animations). Every animation this skill adds is new
motion, so there's no excuse to repeat the gap — build it in from the first
line, not as a follow-up pass.

## Why it matters here specifically

Scroll-triggered reveals are exactly the category of animation most likely
to bother someone with vestibular sensitivity or a general motion
preference, because they fire repeatedly as the user scrolls through a
page — unlike a one-time page-load animation, a page with several
scroll-reveal sections means several motion events per scroll session. Get
this right from the start.

## The pattern

Check the media query once, synchronously, before deciding whether to
animate at all — don't animate first and try to cancel:

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (prefersReducedMotion) {
  gsap.set(targets, { opacity: 1, y: 0 }); // final state, immediately, no animation
  return;
}

// ...the actual animated timeline...
```

**Show the content, skip the motion** — never hide content behind a
reduced-motion check. The paragraph/headline/image is exactly as visible and
readable as it would be after the animation finished; the only thing that
changes is that it doesn't move to get there. This mirrors the pattern in
Emil Kowalski's framework and in the `web-animation-design` skill this app's
motion style draws from: `gsap.set(..., { opacity: 1 })` as the reduced-motion
branch, not `display: none` or a missing section.

## Where to put the check

Inside the same `gsap.context()` callback as the animation itself (see
`references/scroll-reveal-recipe.md`'s recipe) — it needs to run once per
mount, synchronously, before any `ScrollTrigger` is registered. Don't create
the `ScrollTrigger` and then try to disable it after the fact; branch before
creating it.

## This does not need to be reactive to the setting changing mid-session

Reading `matchMedia(...).matches` once on mount is sufficient for this use
case — a user changing their OS-level motion preference while actively
scrolling through this page is an edge case not worth the added complexity
of a `matchMedia` change listener for a marketing site's scroll reveals
(unlike, say, a persistent Lenis smooth-scroll setup — see
`references/lenis-integration.md`, which does need to consider this since it
affects the entire scroll experience for the whole session, not one
section's one-time reveal).

## Sanity check before reporting a section "done"

Turn on "Reduce Motion" (macOS: System Settings → Accessibility → Display;
or the equivalent OS setting) and reload the page if you have a way to
actually render it in this session. If you don't, say so explicitly in your
report per this app's sibling skills' pattern (`cross-browser-compatibility`,
`internationalize-components`) rather than asserting it works without having
checked.

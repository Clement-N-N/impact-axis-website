# Decisions log — responsive-components

Read this before starting a run of this skill; append to it when you finish
(see the last step in SKILL.md). Entries are terse: situation, decision, why,
which file(s). If the same kind of entry shows up three or more times, it
should graduate into SKILL.md or a reference doc instead of staying here.

## 2026-07-12 — Home page sections + legal pages pass

- **ImpactCard.tsx's fixed `h-[200px]` image** — reviewed, not fixed. Card
  width doesn't balloon between breakpoints for this layout (see "How to
  tell it's not actually a problem" in vertical-space-and-images.md, now
  written up from this case). Left as-is.
- **TestimonialCard.tsx's `aspect-[4/5]` image at `w-2/5`** — reviewed, not
  fixed, same reasoning: it's always ~92% of a horizontally-scrolling
  carousel track, not a side-by-side layout that collapses on mobile.
- **BottomCta.tsx / BottomCtaBlock.tsx** — already correctly implemented
  the breakpoint-varied aspect-ratio pattern (`aspect-[4/3] w-full
  md:aspect-auto md:h-full md:w-1/2`) before this skill ever touched them.
  Confirmed as a good in-codebase reference example to point to instead of
  only using WhatWeBuildOverlay/WhatWeBuildCarousel as the "needs fixing"
  examples.
- **Footer.tsx's newsletter form wrapper had a raw `w-[500px]`** with no
  breakpoint variant at all — a real, unambiguous overflow bug (Step 3
  category, not Step 4), not a judgment call. Fixed to
  `w-full max-w-[500px]`.
- **Footer.tsx's link columns** (`grid-cols-2` for Learn More / Work With
  Us, unprefixed) — judgment call: stacked to `grid-cols-1 sm:grid-cols-2`
  since the columns are narrow enough (~140px) that longer French nav
  labels could wrap awkwardly. Flagged as a size/stacking decision, not a
  hard bug.

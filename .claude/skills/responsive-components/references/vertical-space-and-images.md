# Vertical space: heights, aspect ratios, and vh units on mobile

Everything else in this skill is about the *horizontal* grid — columns,
spans, gutters. Vertical space is a separate problem this app also has, and
it's easy to miss because nothing here overflows or visibly breaks the way
an unprefixed `col-span` does. Instead it just makes mobile pages feel
bloated: an image sized for sitting beside a paragraph at desktop becomes a
full-width wall of image once it drops below that paragraph on a stacked
mobile layout, and a `vh`-based height calibrated against a 900px desktop
viewport doesn't know a phone screen has a completely different width-to-
height ratio.

## The core problem: single-column mobile stacking compounds height

At `lg` and up, a section like `HomeSolution.tsx` puts an eyebrow, headline,
paragraphs, and an image side by side across 12 columns — the image's
height is naturally bounded by sitting next to other content. On mobile,
that same grid collapses to a single 4-column stack: eyebrow, then
headline, then paragraphs, then the image, one after another. An
`aspect-[4/5]` image that looked proportionate next to a paragraph block at
desktop now renders at nearly the full (narrow) viewport width, and `4/5`
on a ~330px-wide mobile column is a ~410px-tall image block — added on top
of, not beside, everything else in the stack. Multiply that across several
sections down one page and the mobile experience is a lot more scrolling
than the desktop layout implies. Confirmed real examples in this codebase
that use a single fixed `aspect-[...]` value at every breakpoint:
`HomeSolution.tsx`'s content image and `WhatWeBuildCarousel.tsx`.

**Fix pattern**: give the aspect ratio a shorter, wider step for mobile and
let it grow taller at `lg`, the same way spans get reassigned per
breakpoint in Step 3 — e.g. `aspect-[4/3] lg:aspect-[4/5]` (mobile trades
some of the "tall" feel for a shorter block) rather than one ratio
everywhere. Pick the actual mobile ratio based on what the specific image
crops well to — this isn't a fixed formula, it's a judgment call to flag in
the report like any other span decision.

## `vh` units don't carry meaning across very different aspect ratios

`ParallaxImage.tsx` takes a `heightClass` prop (default `h-[55vh]`), and
both of its call sites in `app/[locale]/page.tsx` pass a single fixed value
(`h-[55vh]`, `h-[35vh]`) with no breakpoint variants. `vh` is relative to
viewport *height*, which is a reasonable proxy for "how much of the screen
should this occupy" on a wide desktop viewport, but a phone in portrait has
a much taller-relative-to-width viewport than a laptop — the same `55vh`
occupies a very different amount of the visible page depending on the
device, and there's nothing here adjusting it down for mobile the way
`--spacing-section` adjusts padding down for mobile via `clamp()`.

**Fix pattern**: either give `heightClass` a breakpoint-varied value at the
call site (`h-[35vh] lg:h-[55vh]`) so mobile gets a shorter band, or — if
the exact value is a deliberate art-direction choice — leave it and flag it
in the report rather than guessing at new numbers, per this skill's general
"partial honest fix beats a confident wrong one" rule.

## `100vh` vs `100dvh` for full-viewport heights

Separate from the above, any *full-viewport* height (`100vh`, or
`calc(100vh - <header>)`) has a known mobile-browser problem: `vh` is
calculated against the largest possible viewport, not the visible one, so
on phones where the address bar/toolbar shows and hides as the user
scrolls, `100vh` can be taller than what's actually visible, causing
content to be cut off or requiring a small extra scroll to reveal the
bottom of a "full height" section. `100dvh` (dynamic viewport height)
tracks the actually-visible viewport instead and is supported in every
browser this app already targets (see the `cross-browser-compatibility`
skill's browser support baseline). This app currently has both patterns in
use: `CollageDescriptionHero.tsx`, `CollageDarkHero.tsx`,
`FullbleedOverlayHero.tsx`, `OverlayWelcomeHero.tsx`, and `PromoCardHero.tsx`
all use `calc(100vh - ...)` for their `lg:` full-height treatment;
`MobileNav.tsx` uses a plain inline `calc(100vh - var(--header-height))`
for its mobile-only slide-out panel.

**Fix pattern**: for any full-viewport-height element meant to fill the
visible screen (not a deliberately over-scroll-able one), swap `100vh` for
`100dvh` in the same expression — `calc(100dvh - var(--header-height))`.
Only do this for elements that are actually full-viewport; don't reach for
`dvh` on a section that intentionally uses a fixed fraction like `55vh` for
art-direction reasons, since that's a different problem (see above) with a
different fix.

## Fixed pixel heights on image containers

`WhatWeBuildOverlay.tsx` wraps a `fill` `<Image>` in a `<section>` with a
flat `h-[400px]`, applied at every breakpoint. 400px is a small fraction of
a 900px desktop viewport but a much larger fraction of a ~650-800px phone
viewport in portrait — the same absolute height reads as "a photo strip" on
desktop and "most of the screen" on mobile.

**Fix pattern**: same as the `vh` case — either step it down for mobile
(`h-[240px] lg:h-[400px]`) or, if the fixed value is intentional, leave it
and note it in the report rather than inventing a new number without being
asked.

## What's *not* this problem: full-bleed background images

Don't flag or "fix" full-bleed background images that already use
`fill` + `object-cover` inside a section whose height is controlled by its
*content* (flex/grid sizing) rather than a fixed aspect ratio or `vh`
value — those already scale correctly because their container does. The
distinction that matters: is the image's box height determined by an
`aspect-[...]`/`h-[Nvh]`/`h-[Npx]` value applied to *it or its wrapper*
(needs the breakpoint treatment above), or does it just fill whatever
height its parent naturally ends up with (already fine, nothing to do)?
`HeroBackgroundSlideshow.tsx`-style crossfades are the second kind — leave
them alone.

## Report back

Add a line to Step 6's report for any vertical-space finding, same
severity/format as a Step 3 grid finding: what the current fixed
height/aspect-ratio value is, what mobile-width consequence it has (rough
pixel math, the same "check both ends" gut-check as typography), and either
the breakpoint-varied fix you applied or, if it looked like a deliberate
art-direction choice, a flag for a human to confirm instead of guessing.

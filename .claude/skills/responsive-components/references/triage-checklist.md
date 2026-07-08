# Triage checklist: fix directly vs. flag for a human

The presence of animation or GSAP alone doesn't automatically make a
component unsafe — what matters is whether the animation or positioning math
*depends on layout dimensions that differ per breakpoint*. Judge each
component on that, using the worked examples below (all real files in this
codebase) as calibration.

## Red flags — lean toward flagging

- **Positioning math derived from other elements' widths/gaps.**
  `components/sections/home-hero/CollageDarkHero.tsx` computes image crop
  offsets like this:
  ```
  COLLAGE_IMAGE_WIDTH = "calc(300% + 2 * var(--spacing-gutter))"
  COLLAGE_IMAGE_LEFTS = ["0px", "calc(-100% - var(--spacing-gutter))", ...]
  ```
  This only lines up because it assumes three equal-width boxes at a specific
  aspect ratio. Reflowing the grid around it (e.g. stacking the boxes on
  mobile) would silently break the image alignment in a way that's only
  obvious by looking at the rendered page, not the code. Flag it — a human
  needs to decide how the collage should look on a narrow screen, possibly
  with a different crop or a simplified mobile treatment.

- **SVG morphing / GSAP timelines keyed to a fixed shape or duration.**
  `components/sections/home-hero/HeadlineWithIcons.tsx` runs a GSAP
  `MorphSVGPlugin` timeline between hardcoded icon paths, plus a separate
  rotate/border-radius loop, on an inline-sized chip (`width`/`height` passed
  as props, sometimes in `vw`-like units from the content data). The
  animation logic is decoupled from Tailwind breakpoints entirely, so there's
  nothing here to "reflow" — the risk is that resizing the chip changes how
  the morph looks relative to its container. Flag any sizing changes here for
  a human to eyeball rather than assuming a smaller chip still looks right.

- **Crossfade/slideshow where the animation only affects paint, not layout —
  usually still safe.** `components/sections/home-hero/HeroBackgroundSlideshow.tsx`
  also uses a GSAP timeline, but it only animates `clipPath` and `zIndex` on
  full-bleed (`absolute inset-0`, `object-cover`) image layers. Nothing about
  it depends on viewport width, so it needs no breakpoint changes at all —
  don't flag a component just because GSAP is imported; check what the
  animation is actually keyed to.

## Not red flags by themselves — usually safe to fix

- Plain `grid`/`flex` containers with `col-span`/`col-start` utilities and no
  accompanying `calc()`/inline `style` positioning.
- Headings, paragraphs, and buttons using the theme's `text-*` classes or
  simple arbitrary `vw` values with no animation attached — these are exactly
  what Step 4 in SKILL.md exists to fix.
- Cards or content blocks that just need a sensible mobile/tablet column
  span, even if they currently have a bug like the one below.

## A concrete "safe to fix, and worth fixing" bug pattern

`components/sections/home-hero/FullbleedOverlayHero.tsx` and
`components/sections/home-hero/PromoCardHero.tsx` both apply a `col-span-*`
(and in `PromoCardHero`'s case, `col-start-10` too) with **no `lg:` prefix**,
while their grid container is `grid-cols-1 ... lg:grid-cols-12`. Below `lg`,
the container only has one explicit column track, so these unprefixed
classes force the browser to create implicit tracks to satisfy the span/start
— which stretches the container width and causes horizontal overflow on
mobile and tablet today. This is exactly the kind of thing this skill should
fix when asked to make these components responsive: give the container the
full `grid-cols-4 md:grid-cols-8 lg:grid-cols-12` treatment, and prefix the
span/start classes so they only apply once there are enough columns for them
to make sense (`lg:col-span-8`, `lg:col-span-3 lg:col-start-10`), with
sensible mobile/tablet spans added alongside.

## When in doubt

If you can't tell whether a change is safe without seeing the rendered page,
it isn't safe to guess — flag it. The report format in SKILL.md Step 5 exists
specifically so skipped components aren't a dead end: a human reads the
reason and either fixes it themselves or clarifies intent so the skill can
run again.

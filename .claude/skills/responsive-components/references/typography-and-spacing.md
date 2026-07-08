# Typography and spacing on mobile

## Why the current type scale needs help below ~768px

`app/globals.css` defines the scale as pure `vw`:

```css
--text-xs: 0.8125vw;
--text-sm: 0.973vw;
--text-base: 1.25vw;
--text-lg: 1.3125vw;
--text-xl: 1.5vw;
--text-2xl: 1.875vw;
--text-3xl: 2.375vw;
--text-4xl: 3vw;
--text-5xl: 4vw;
--text-6xl: 5.5vw;
```

These are calibrated so, e.g., `1.25vw` looks like an 18px body size at a
1440px viewport (1440 * 0.0125 = 18px). That's a nice fluid effect on
desktop. But `vw` has no floor — the same math at a 375px phone gives
1.25vw = 4.7px. Nothing in the token itself stops it from shrinking that far;
it just keeps scaling linearly forever. The theme tokens are all used via
Tailwind's `text-*` utilities, which is fine as long as those utilities also
get an explicit mobile override somewhere — but as written, nothing provides
one.

Raw arbitrary values in component code have the exact same issue, just
skipping the token layer entirely, e.g.:

```tsx
<h1 className="text-[5vw] !font-medium text-white !leading-[1.1]">
```

At 1440px that's 72px — a reasonable hero headline. At 375px it's 18.75px,
which reads more like a subhead than a hero, and the line-height
(`!leading-[1.1]`) was tuned for the larger size so it can look cramped once
the text wraps differently at that size.

## Fix pattern 1: swap to the nearest token, if it's close enough

If a raw `vw` value was basically reinventing an existing step of the scale,
just use the token. It won't magically fix the mobile floor by itself (see
pattern 2 for that), but it keeps things consistent and means a future global
fix to the scale benefits this component too.

## Fix pattern 2: clamp() with an explicit mobile floor and desktop ceiling

For anything that needs to stay custom, follow the same shape the codebase
already uses for `--spacing-section`:

```css
clamp(<mobile-safe-rem>, <fluid-vw-value>, <desktop-safe-rem>)
```

Worked example — the hero headline above, assuming the desktop size (72px /
`5vw` at 1440px) should stay, but mobile shouldn't drop below a legible ~28px:

```tsx
// Before
<h1 className="text-[5vw] !font-medium text-white !leading-[1.1]">

// After
<h1 className="text-[clamp(1.75rem,5vw,4.5rem)] !font-medium text-white !leading-[1.1]">
```

`1.75rem` (28px) is the floor, `4.5rem` (72px) is the ceiling, `5vw` is the
original fluid preferred value in between. Pick the actual floor/ceiling
based on what reads well for that specific piece of content and its line
count — these numbers are illustrative, not a fixed formula. If the line
count changes materially at a smaller width (e.g. a two-line desktop headline
becomes four lines on mobile), it's worth double-checking the line-height
still looks right too, and adjusting it or making it fluid the same way if
not.

## Fix pattern 3: the same treatment for spacing, radius, and size

Raw `vw`/`%` values that scale a whole element — not just font size — have
the identical problem and the identical fix:

- `rounded-[4vw]` on a small chip can look fine at desktop and go
  imperceptibly small (or, on a chip whose own width is also relative,
  disproportionately large) at mobile. Consider a fixed value, a token, or a
  `clamp()`-based radius if it truly needs to scale.
- `p-[16%]`/`p-[22%]` padding relative to a parent that itself resizes across
  breakpoints can compound in unexpected ways — check what the padding looks
  like in pixels at both the smallest and largest supported widths before
  leaving it as-is.
- `mt-[1vw]` and similar small offsets are usually safe to leave if the
  absolute pixel range across breakpoints is small enough not to matter
  (e.g. 3.75px at 375px vs 14.4px at 1440px might genuinely be fine) — use
  judgment on whether the range is large enough to actually look broken
  before "fixing" something that was never a real problem.

## A quick gut check

Before finalizing any typography or spacing change, do the arithmetic at
both ends: what does this `vw`/`%` value resolve to in actual pixels at the
narrowest supported width (roughly 360–390px for phones) and at the
reference width (1440px)? If the small end is under ~14-16px for body text,
under ~1.5rem for headline text, or visibly disproportionate for a spacing/
radius value, it needs a floor.

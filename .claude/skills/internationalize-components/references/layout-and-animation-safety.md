# Keeping layout and animation intact across locales

## Why this matters here specifically

French commonly runs 15-20% longer than English for equivalent meaning, and
this app has plenty of fixed-width or fixed-column-span containers holding
text — hero headlines in `w-[65%]` boxes, nav items in a fixed-span grid
column, chip widths set in `vw` units. Swapping in French copy without
checking these can cause visible overflow, awkward wrapping, or text
crowding an icon it used to have room next to. This is not hypothetical in
this codebase — it's already been solved once, on purpose, and the fix is a
convention worth reusing rather than rediscovering.

## The existing convention: locale-keyed cva variants

`components/layout/MegaMenu.tsx` gives the nav-items column more room in
French than English, and the accompanying image correspondingly less,
because "Partners & Institutions" → "Partenaires & Institutions" and its
siblings are measurably longer:

```tsx
const imageColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "lg:col-span-4 xxl:col-span-5 2xl:col-span-6",
      fr: "lg:col-span-3 xxl:col-span-4 2xl:col-span-5",
    },
  },
  defaultVariants: { locale: "en" },
});

const itemsColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "lg:col-span-8 xxl:col-span-7 2xl:col-span-6",
      fr: "lg:col-span-9 xxl:col-span-8 2xl:col-span-7",
    },
  },
  defaultVariants: { locale: "en" },
});
```

Applied as `imageColSpanStyles({ locale: locale === "fr" ? "fr" : "en" })`.
Same idea for pixel-level width math in `imageWidthStyles` and
`footerTextStyles` in the same file — each has an `en` and `fr` variant with
different `calc()` proportions.

Several `home-hero` variants (`PromoCardHero.tsx`'s `headlineColStyles`/
`cardColStyles`, `FullbleedOverlayHero.tsx`'s `contentColStyles`) scaffold
the exact same shape — a `cva` with `variants: { locale: { en: ..., fr: ...
} } }` — even where both locales currently resolve to an identical class
string. That's deliberate: the seam for "these might need to diverge" is
already built into the component, so adding a real difference later (or
now, while internationalizing) means filling in the `fr` branch, not
restructuring the component.

**When internationalizing a component with a fixed-width/fixed-span
container around translated text:**
1. Check whether it already has a locale-keyed `cva` scaffold (increasingly
   likely as more of the app gets this treatment) — if so, just fill in the
   `fr` variant with an appropriate adjustment.
2. If it doesn't have one yet and the English and French strings are close
   in length, it's reasonable to leave the container as-is and note in your
   report that you checked and it's fine.
3. If it doesn't have one yet and the French string is meaningfully longer
   (a good rule of thumb: if it's more than ~20% longer, or if the container
   is tight enough that even a few extra characters could wrap awkwardly),
   introduce the same `cva({ variants: { locale: {...} } })` shape rather
   than hardcoding new proportions into the base class string — this keeps
   the component's own convention consistent for whoever touches it next,
   and keeps the English rendering byte-for-byte unchanged (the `en` variant
   value equals what was there before).
4. If you can't tell whether your adjustment is enough without seeing it
   rendered, say so in your report rather than asserting confidence you
   don't have — same rule as the sibling skills.

## Animation: what can and can't be affected by text length

Most animation in this app targets position/opacity/color/transform on
elements whose size doesn't depend on their text content (image layers,
chips with explicit `width`/`height`, menu panels sized by their container) —
these are unaffected by which language is rendering and need no special
attention.

The ones to actually check:
- **Anything that measures a rendered element's size at runtime**
  (`offsetWidth`/`offsetHeight`, `getBoundingClientRect()`) and feeds that
  measurement into an animation (a GSAP tween computing a distance to travel,
  a Framer Motion `layout` animation). If French wrapping changes the
  element's height (e.g. a headline that wraps to one more line), a
  measurement-driven animation can look different or run into a stale
  measurement taken before layout settled. Search the component for these
  APIs before assuming an animation is language-agnostic.
- **Timelines with a fixed duration tuned to a specific string's read time
  or line count** — rare in this app currently, but worth checking for if a
  component you're translating does anything narrative/sequential (e.g. text
  revealing word-by-word).
- **`MorphSVGPlugin`/icon-chip animations** (`HeadlineWithIcons.tsx`) are
  keyed to icon shapes, not text — safe regardless of language, no action
  needed just because a headline containing an icon chip is being
  translated.

If you find one of the "actually check" cases, don't guess whether it still
looks right in French — flag it for a human to view both locales
side-by-side, exactly like the `cross-browser-compatibility` skill flags
things it can't verify without a real browser.

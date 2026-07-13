---
name: responsive-components
description: Make a specific Next.js/Tailwind component or page section in this app responsive across its four breakpoints (mobile, tablet, desktop/base, extra-large), using the 4/8/12-column grid shown by DesignGridOverlay, the fluid vw-based type scale in app/globals.css, and correct vertical sizing (image aspect ratios, vh/dvh heights) at mobile widths. Trigger whenever asked to "make X responsive", "fix X on mobile/tablet", "add breakpoints to X", "this section breaks on smaller screens", "images/sections are too tall on mobile", or when reviewing a component that only has lg: styling and stacks as grid-cols-1 below it. Deliberately conservative: skips components built on GSAP timelines, SVG morphing, or hand-tuned absolute-position art direction (collages, slideshows) and reports them for manual review instead of guessing and risking a broken desktop layout. Always checks whether font sizes, spacing, and vertical heights/aspect ratios still make sense at mobile widths, since this app's type scale and several image containers are tuned for a 1440px viewport and don't automatically adapt below it.
---

# Making components responsive

This app is built on a 12-column grid at desktop that collapses to 8 columns on
tablet and 4 on mobile — you can see the three states live by toggling
`DesignGridOverlay` (Alt+G in dev). Most existing sections were built
desktop-first and only have `lg:` treatment, so making something "responsive"
usually means filling in the tablet and mobile steps that were never written,
not redesigning anything.

The prime directive: **a partial, honest fix beats a confident, wrong one.**
If a component is simple grid/flex/typography, fix it fully across all
breakpoints. If it leans on animation, absolute-positioned art direction, or
math that assumes a specific column width, stop and hand it back for a human
to art-direct — don't guess at how a collage or morphing icon should reflow.

## Step 0 — Re-read the live design tokens, don't assume

Breakpoints, the type scale, spacing, and container padding all live in
`app/globals.css` (the `@theme inline` block) and can change over time. Read
that file fresh at the start of every run rather than trusting numbers from
memory or from this skill's reference docs — treat `references/tokens-and-grid.md`
as an explanation of the *pattern*, not a frozen source of truth. Also skim
`components/layout/Container.tsx` (padding classes) and
`components/dev/DesignGridOverlay.tsx` (the column-visibility convention:
4 cols below `md`, 8 from `md` to `lg`, 12 from `lg` up) before touching
anything.

Also check whether `references/decisions-log.md` exists in this skill's
folder and read it before starting — it holds judgment calls from past runs
of this skill on this specific codebase (things reviewed and deliberately
left alone, edge cases that don't fit the main instructions cleanly) that
are worth knowing before re-deriving the same call from scratch. See the
last step below for how to add to it.

## Step 1 — Read the target completely

Read the whole component file, not just the JSX that looks layout-related.
Also check:
- Its `types.ts`/`data.ts` siblings, if any — content shape can hint at what
  must stay together on small screens (e.g. a headline + one CTA vs. a
  headline + a card that visually can't just get squeezed).
- Whether the component is used in more than one place (`grep` for its name).
  A fix that's safe in isolation isn't safe if another caller depends on the
  current layout.
- Whether it already has partial responsive treatment. Existing `md:`/`lg:`
  classes are almost always intentional — extend them, don't replace them
  wholesale.
- Whether any image, video, or section wrapper has a fixed `aspect-[...]`,
  `h-[Nvh]`, or `h-[Npx]` value applied at every breakpoint. These don't
  cause the kind of overflow bug a missing grid breakpoint does, but they
  can make a component take up a wildly different — usually excessive —
  share of the screen on mobile. See "Fixing vertical space" (Step 4) and
  `references/vertical-space-and-images.md`.

## Step 2 — Triage: safe to fix vs. hand back

Read `references/triage-checklist.md` for the full list of red flags and
worked examples from this codebase. In short, lean toward flagging instead of
editing when a component has:

- GSAP timelines, `MorphSVGPlugin`, or any animation keyed to specific
  coordinates or durations
- Absolute-positioned decorative elements computed from `calc()` expressions
  that reference gutters/percentages of each other (image collages, layered
  slideshows)
- A crossfade/slideshow/carousel where breakpoint changes could affect
  preloading, aspect ratio, or timing
- Any layout where the "obvious" mobile version genuinely requires a design
  decision you can't infer from the code (e.g. which of three overlapping
  elements should disappear first)

If a component is a mix — say, a simple headline+button block sitting next to
a complex collage — it's fine to fix the simple part and flag the complex part
separately in the same report. Don't let one risky element block an otherwise
safe fix elsewhere in the same file.

Everything else — grid containers, column spans, plain text blocks, flex
layouts, simple cards — is safe to fix directly.

## Step 3 — Fixing grid layout

The house pattern, taken from `DesignGridOverlay`, is:

```
grid-cols-4 md:grid-cols-8 lg:grid-cols-12
```

A lot of existing sections instead jump straight from `grid-cols-1` to
`lg:grid-cols-12`, and separately apply a `col-span-*`/`col-start-*` class
*without* an `lg:` prefix (e.g. `col-span-8` or `col-span-3 col-start-10`).
That combination is a real bug, not just a missing breakpoint: on a
`grid-cols-1` mobile container, an unprefixed `col-span-8` or `col-start-10`
creates implicit grid tracks to satisfy itself, which stretches the container
and causes horizontal overflow on small screens. When you see this pattern,
treat it as something to fix, not preserve.

When converting a span from the 12-column desktop grid down to 8 (tablet) or
4 (mobile):
- Preserve the *visual proportion* where there's an obvious clean snap (e.g.
  `lg:col-span-6` of 12 → `md:col-span-4` of 8, both are "half").
- When there's no clean snap (e.g. `lg:col-span-5` of 12 has no tidy eighth or
  quarter equivalent), default to full-width (`col-span-4`/`col-span-8`,
  stacked above/below the other content) rather than inventing an odd
  fraction. Note this as a judgment call in your report so a human can
  tighten it later if they want something more custom.
- Two elements that sit side-by-side at desktop (e.g. headline + card) almost
  always want to stack vertically at mobile and often at tablet too — check
  whether that reads fine before forcing them to stay side-by-side.
- Keep using `Container`/`CONTAINER_PADDING_CLASSES` and `gap-gutter` rather
  than hardcoding new padding or gap values — they already scale correctly
  per breakpoint.

## Step 4 — Fixing vertical space: heights, aspect ratios, and vh units

This is a separate axis from the horizontal grid work in Step 3, and it's
just as often missing. Read `references/vertical-space-and-images.md` for
the full reasoning and the concrete examples already in this codebase
(`HomeSolution.tsx`'s and `WhatWeBuildCarousel.tsx`'s fixed `aspect-[4/5]`,
`ParallaxImage.tsx`'s fixed `h-[55vh]`/`h-[35vh]`, `WhatWeBuildOverlay.tsx`'s
fixed `h-[400px]`). The short version:

0. Before assuming a fixed value needs fixing, check whether it actually
   *is* the mobile-compounding problem this step is about — see "How to
   tell it's not actually a problem" in `references/vertical-space-and-images.md`.
   Several fixed heights/ratios in this app (`ImpactCard.tsx`'s `h-[200px]`,
   `TestimonialCard.tsx`'s `aspect-[4/5]`) were reviewed and correctly left
   alone because the element's width doesn't actually balloon between
   breakpoints for that specific layout — forcing a breakpoint-varied fix
   onto something that isn't compounding just adds unnecessary classes.

1. A fixed `aspect-[...]` on an image gives it the same shape at every
   breakpoint. At desktop that image usually sits beside other content, so
   its height is naturally bounded; on mobile everything stacks into one
   column, so that same aspect ratio can turn the image into a much taller
   block than it needs to be, stacked on top of (not beside) the rest of
   the section's content. Give it a shorter/wider ratio at mobile and let
   it grow at `lg` (`aspect-[4/3] lg:aspect-[4/5]`), the same way spans get
   reassigned per breakpoint in Step 3.
2. A fixed `h-[Nvh]` height (as `ParallaxImage.tsx` uses) means something
   different on a phone's tall, narrow viewport than on a wide desktop one.
   Consider a breakpoint-varied value (`h-[35vh] lg:h-[55vh]`) rather than
   one number everywhere — but if the value looks like a deliberate
   art-direction choice, flag it instead of guessing at a replacement.
3. A full-viewport height (`calc(100vh - ...)`) should generally use
   `100dvh` instead of `100vh` so mobile browser chrome (address bar
   show/hide) doesn't cause content to be cut off or need extra scroll to
   reveal. This is different from #2 above — only applies to genuinely
   full-viewport elements, not art-directed fractional heights.
4. Full-bleed background images that just fill their parent's
   content-driven height (`fill` + `object-cover`, no `aspect-[...]`/
   `h-[Nvh]` on the image or its wrapper) are already fine — don't flag or
   change these.

## Step 5 — Fixing typography and spacing

This is the part most likely to get skipped by accident, and the user
explicitly cares about it: **font sizes and spacing must still make sense on
a real mobile screen, not just look fine in dev tools at 375px zoomed out.**

The type scale in `app/globals.css` (`--text-xs` through `--text-6xl`) is pure
`vw`, calibrated to hit its reference pixel size at a 1440px viewport. That
means it keeps scaling down linearly below 1440px with no floor — e.g.
`text-sm` (0.973vw) is a reasonable ~14px at 1440px but only ~3.6px at a
375px phone width. Any component using **raw arbitrary `vw` values directly**
(`text-[5vw]`, `leading-[4.5vw]`, `rounded-[4vw]`, `p-[16%]`, `mt-[1vw]`, etc.)
inherits this same problem and was never given a mobile-safe floor or
ceiling.

Read `references/typography-and-spacing.md` for the full reasoning and
before/after examples. The short version:

1. If a raw `vw` font size roughly matches an existing scale token
   (`text-base` … `text-6xl`) at the sizes that matter, just switch to the
   token — it inherits the same calibration but at least stays consistent
   with the rest of the app.
2. If a component genuinely needs a custom size, don't leave it as bare `vw`.
   Wrap it the way `--spacing-section` already does in `globals.css`:
   `clamp(<mobile-safe-rem>, <vw-value>, <desktop-safe-rem>)`. This keeps the
   fluid feel at desktop widths while giving mobile a legible floor.
3. Apply the same clamp-or-token treatment to spacing, radius, or sizing that
   uses raw `vw`/`%` values, especially when they scale a whole element
   (padding, border-radius, margins) rather than a fixed design token.
4. Never let a heading or body text size drop below what's comfortably
   readable on a phone (roughly 16px/1rem for body copy; large display
   headlines can go smaller proportionally but should still hold a sane
   floor, generally not under ~1.5rem).

## Step 6 — Report back

After each run, summarize per component:

- **Changed**: which breakpoints you added/adjusted, and why the span/size
  choices you made are the right proportional fit.
- **Skipped**: anything flagged in Step 2, with a one-line reason a human can
  act on (not just "too complex").
- **Judgment calls**: any span/size you picked because there was no clean
  snap (see Step 3) — flag these even in components you otherwise fixed
  fully.
- **Vertical space**: any fixed `aspect-[...]`, `h-[Nvh]`, or `h-[Npx]`
  found (Step 4) — the breakpoint-varied fix you applied, or a flag if it
  looked like a deliberate art-direction choice.
- **Manual QA reminder**: tell the user to toggle the grid overlay (Alt+G in
  dev) at each breakpoint to visually confirm columns line up, since this
  skill can't render the page itself.

If `prettier-plugin-tailwindcss` is set up (it is, per `package.json`), run
`npx prettier --write <file>` on anything you touch so class ordering matches
the rest of the codebase.

## Step 7 — Log new judgment calls for next time

If you made any judgment call, hit any ambiguity, or found any new pattern
in this run that isn't already covered by this skill or its reference docs,
append a short dated entry to `references/decisions-log.md` (create the
file if it doesn't exist). Keep entries terse — the situation, what you
decided and why, and which file(s) it applied to. This is how the skill
gets sharper and more tailored to this specific project over repeated use.
If the same kind of entry shows up three or more times, that's a signal it
should graduate from the log into the main skill instructions — mention
this in your report if you spot it.


## Never

- Don't touch data files, business logic, or components you weren't asked
  about, even if you notice something odd in them — mention it in the report
  instead.
- Don't invent new breakpoints outside `sm/md/lg/xl/xxl/2xl` already defined
  in `app/globals.css`.
- Don't remove or "clean up" existing bespoke responsive classes that look
  intentional (e.g. the per-index `hidden md:block` / `hidden lg:block`
  pattern in `DesignGridOverlay` itself) just because they don't fit a
  template — they were written that way for a reason.
- Don't force a fix on something flagged in Step 2. Skipping is the correct,
  successful outcome for those cases — not a failure.

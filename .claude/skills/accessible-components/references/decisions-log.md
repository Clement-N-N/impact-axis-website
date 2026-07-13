# Decisions log — accessible-components

Read this before starting a run of this skill; append to it when you finish
(see Step 4 in SKILL.md). Entries are terse: situation, decision, why, which
file(s). If the same kind of entry shows up three or more times, it should
graduate into SKILL.md or a reference doc instead of staying here.

## 2026-07-12 — Home page sections + legal pages pass

- **BlogCard.tsx's post-title `<h3>`** had `cursor-pointer` + a hover
  underline effect but no actual `<a>`/`onClick` behind it — a dead
  affordance, distinct from the documented div-with-onClick pattern. Fixed
  by wrapping the title text in a real `Link` pointing at `post.href`. Now
  written up as its own bullet in Step 2 (Interactive elements).
- **Footer.tsx's newsletter form** (`firstName`/`lastName`/`email` inputs)
  had placeholders only, no `<label>`. Added `sr-only` labels tied via
  `htmlFor`/`id` (used `useId()` for unique ids). Now called out explicitly
  as a "Forms" bullet in Step 2 since it's such a common, mechanical,
  findable gap.
- **Auto-advancing carousels** (`WhatWeBuildCarousel.tsx`,
  `TestimonialsCarousel.tsx`) — added `aria-current="true"` to the active
  legend/selector button and `role="region"`/`aria-label`/`aria-live="polite"`
  to the sliding content wrapper. This was a judgment call, not spelled out
  anywhere in the skill yet — worth folding into Step 2 as a named pattern
  if another carousel shows up in a future run.
- **Footer.tsx's `text-white/50` copyright text on `bg-[#141416]`** —
  estimated contrast ratio came out borderline (~4.8:1, right at the
  4.5:1 AA threshold for normal-size text). Flagged rather than changed,
  per the color-contrast rule — didn't have exact measured values the way
  `references/color-contrast.md` does for the documented brand-color pairs,
  so this was an estimate, not a confirmed ratio. Worth adding this pair to
  `color-contrast.md` properly next time this skill runs on the footer.

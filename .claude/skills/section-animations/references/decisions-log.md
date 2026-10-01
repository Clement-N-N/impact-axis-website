# Decisions log — section-animations

Read this before starting a run of this skill; append to it when you finish
(see Step 5 in SKILL.md). Entries are terse: situation, decision, why, which
file(s). If the same kind of entry shows up three or more times, it should
graduate into SKILL.md or the recipe doc instead of staying here.

## 2026-07-12 — Home page sections + legal pages pass

- **All heading levels get the masked line-stagger, not just h1/h2.**
  Earlier in this same pass, sub-headings (FaqSection's "Still have
  questions?" h3, footer column headers) were defaulted to a plain fade-up
  since SKILL.md only described h1/h2. The user overrode this explicitly:
  every heading tag gets the same reveal. This is now folded into the main
  skill text (Step 1/2) rather than staying a log-only exception — noting it
  here for the origin/rationale.
- **WhatWeBuildCarousel.tsx's h3 caption** (crossfades every ~6s via
  Framer Motion `AnimatePresence` on slide change) — flagged to the user as
  a case that doesn't cleanly fit "every heading gets the mask," since
  SplitText re-splitting on every text change would fight the existing
  crossfade. Not yet resolved with a final answer at time of writing; the
  general guidance added to SKILL.md/recipe doc defaults to leaving the
  state-driven transition alone and reserving the mask for one-time
  appearances only. Revisit if the user gives a different answer.
- **BlogCard.tsx's h3 post title**, repeated 2-3 times inside
  `HomeBlog.tsx`'s already-staggered column groups (`mainCardRef`/
  `secondaryColRef`) — same open question, flagged but not yet resolved.
  Don't double-stagger a repeated heading independently of its parent's
  group stagger without deciding which of the two resolutions in the
  recipe doc applies.
- **Legal pages (Terms of Use, Privacy Policy)** — deliberately did not add
  any scroll-reveal animation. ~13 sequential sections each would violate
  the "restrained, not everywhere" principle, and the initial
  `opacity: 0`/`yPercent: 100` state risks hiding content if a user
  deep-links to a mid-page section anchor before ScrollTrigger/SplitText
  run. Treated as a distinct page category, now written into SKILL.md
  Step 1 as a default exemption.
- **Converting OurImpact.tsx, HomeBlog.tsx, and BottomCtaBlock.tsx from
  server to client components** to add the GSAP reveal — flagged the
  bundle-size/hydration tradeoff in the report rather than converting
  silently. All three read from static `data.ts` files (no fetching lost).
  Didn't attempt the server-shell + client-island split since there's no
  data-fetching to preserve yet; proposed it as an option if these ever
  move to Sanity-backed content, matching the pattern
  `home-testimonials/index.tsx` and `home-faq/index.tsx` already use.

## 2026-09-24 — Blog body/detail components pass (issue #5)

- **BlogHero.tsx's existing h1 uses a plain fade-up, not the masked
  line-stagger the skill now mandates for every heading.** It predates the
  "every heading gets the mask" rule being folded into SKILL.md. Left it
  untouched (out of scope, explicitly "already animated" per the task), but
  gave the new `BlogCategoryHero.tsx`/`BlogDetailsHero.tsx` h1s the current
  house-standard masked line-stagger rather than copying BlogHero's older
  plain fade-up, so new work follows the current standard even though it now
  reads slightly differently from its closest neighbor. Flagged explicitly
  in the report rather than silently diverging.
- **Nested independent ScrollTriggers on the same visual area** —
  `BlogContentLayout.tsx` (generic `main`/`sidebar` slot wrapper, used by
  both `BlogBody.tsx` and `BlogDetailsBody.tsx`) does its own coarse
  column-level fade-up, while `BlogBody.tsx`'s post-card list and
  `BlogDetailsBody.tsx`'s article body each independently stagger/fade
  *inside* that same `main` column via their own `ScrollTrigger`. Since
  `BlogContentLayout` only receives opaque `ReactNode` props, it can't drive
  one shared timeline with its children across component boundaries. Kept
  both triggers using identical `top 80%` / `0.5s` / `power3.out` values so
  they fire together and read as one layered reveal (column arrives, then
  its contents settle) rather than two competing motions. Flagged as a
  hypothesis pending real-browser verification, not a confirmed measurement.
- **BlogDetailsHero.tsx does not re-wrap AuthorCard/ShareButtons in its own
  fade** — both are separately-tasked components that own their own
  entrance (AuthorCard: single fade-up; ShareButtons: staggered pills).
  BlogDetailsHero only animates its own h1 (masked line-stagger) and the
  sibling date `<span>` in the meta row, to avoid double-animating the
  author/share area with a third mechanism on top of their own.
- **BlogDetailsBody.tsx's Portable Text article body treated as one
  single-block fade-up, not per-heading masked line-stagger** — the body is
  CMS-authored rich text that can contain an arbitrary, unbounded number of
  h1-h4 blocks down a long article. Recursively masking every embedded
  heading has the same content-availability risk as the legal-pages
  exemption (deep-linked anchors before ScrollTrigger/SplitText run) and
  the same "not everywhere" concern. Task instructions for this file also
  explicitly called for "a straightforward fade-up," which settles it.

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

# Decisions log — cross-browser-compatibility

Read this before starting a run of this skill; append to it when you finish
(see Step 5 in SKILL.md). Entries are terse: situation, finding/decision,
which file(s). Clean-review results belong here too, not just fixes. If the
same kind of entry shows up three or more times, it should graduate into
SKILL.md or a reference doc instead of staying here.

## 2026-07-12 — Home page sections + legal pages pass

- **Clean review, no issues found** across all 7 home-page sections (What
  We Build, Our Impact, Home Testimonials, Home Blog, Home FAQ, Bottom CTA,
  Footer) plus the two legal pages. No manual vendor-prefixing needed, no
  new `100vh` instances introduced, no sticky-under-transform conflicts
  created by the new GSAP work.
- **`BlogCard.tsx`'s `group-has-[h3:hover]:scale-110`** (a `:has()`
  selector) — confirmed safe per this skill's own existing target-matrix
  guidance (`:has()` supported well before the Safari 16.4/Chrome 111/
  Firefox 111 floor). No new research needed; matches Step 2's "Anything
  using a newer Web API" guidance exactly.
- **`CarouselImageSwitcher.tsx`'s `clip-path` crossfade** — flagged per
  Step 2's "Animation: GSAP/clip-path/SVG morphing" guidance for manual
  Safari perf verification only; no code change made (this is exactly the
  "residual risk, not something to guess a fix for" case the skill already
  describes).

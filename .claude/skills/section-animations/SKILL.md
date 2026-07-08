---
name: section-animations
description: Add subtle, purposeful micro-animation to a specific page section in this app — scroll-triggered reveals, staggered content entrances, gentle parallax, and masked line-stagger title reveals — using the house motion style (grounded in Emil Kowalski's Animations on the Web principles, the Lenis/darkroom.engineering title-reveal reference, and this codebase's own existing GSAP/Framer Motion conventions). Trigger whenever asked to "animate this section", "add motion to X", "make X feel more alive", "add a scroll reveal", "animate the title/headline", or "this section feels static". Never applies to buttons — that's explicitly out of scope. Deliberately restrained: subtle over spectacular, purposeful over decorative, and always paired with prefers-reduced-motion handling, matching how this app's best-animated component (the mega menu) already does it.
---

# Section animations

This app already animates its navigation chrome well — `MegaMenu.tsx`'s
open animation (staggered fade-up of the image, nav items, and footer) is a
genuinely good, restrained example of the exact style to extend elsewhere.
What's missing is animation on the actual page content: sections like
`WhyWeExist` and `HomeSolution` render fully static — headline, paragraphs,
image all just appear instantly on load with no acknowledgment that the user
scrolled to them. That's the gap this skill fills: **bring the same
restrained, purposeful motion language already proven in the nav to the
content sections**, not invent a new visual language.

The governing philosophy, straight from Emil Kowalski (design engineer at
Linear, formerly Vercel, author of the animation principles this skill is
built on — see `references/motion-style-guide.md` for the full framework):
animations should feel natural, be fast, have a clear purpose, stay
performant, and respect people who've asked for less motion. A page covered
in animation is worse than a page with none — the goal is a handful of
well-placed moments, not motion everywhere.

**Titles (`h1`/`h2` section headlines) get their own house-standard
treatment: a masked line-stagger reveal**, modeled directly on the title
animation used on the Lenis/darkroom.engineering site — each line slides up
from fully hidden (no fade, pure clip reveal) one after another, rather than
the plain fade-up used for everything else. See "Title reveal: masked line
stagger" in `references/scroll-reveal-recipe.md` for the full recipe. This
is now the default for any headline this skill touches — not a one-off
choice for a single section.

**Buttons are explicitly out of scope for this skill.** Don't add hover
scale, press effects, or entrance animation to `components/ui/Button.tsx` or
any button instance, even if a section you're animating contains one (see
`HomeSolution.tsx`, which has both a headline worth animating and a button
that should stay exactly as it is).

## Step 0 — Internalize the house style before touching anything

Read `references/motion-style-guide.md` in full — it has the easing/duration
rules and, critically, the exact numeric recipe this codebase already uses
in `MegaMenu.tsx`'s entrance animation, which is your default starting point
for any new section entrance rather than something to reinvent per
component. Read `references/prefers-reduced-motion.md` before writing your
first animation, not after — every animation in this task needs this from
the start, not bolted on afterward (this app currently has zero
`prefers-reduced-motion` handling anywhere, which the `accessible-components`
skill in this repo also flags — don't repeat that gap here).

## Step 1 — Read the target section and its neighbors

- Is it already animated? `ParallaxImage.tsx` already has a scroll-scrubbed
  parallax; the hero variants already animate their own backgrounds/icons.
  Don't duplicate — if asked to "animate the hero," check what's already
  moving before adding more.
- What are the section's natural content groups? Most static sections here
  follow a `Container` grid with an eyebrow, a headline, one or more
  paragraphs, and sometimes an image (`WhyWeExist.tsx`, `HomeSolution.tsx`
  are both this shape). These groups are your stagger units — animate them
  as a small sequence, not every word individually.
- Does the section have an `h1`/`h2` title? If so, it gets the masked
  line-stagger reveal (Step 2), not the plain fade-up. Everything else in
  the section (eyebrow, paragraphs, image, cards) still uses the fade-up,
  sequenced in the same timeline as the title.
- What animates immediately before/after it on the page? A section shouldn't
  introduce a jarringly different motion feel than its neighbors. If the
  section above it uses a 0.4s power3.out fade-up, don't give the next one a
  1s bounce — consistency across sections is the whole point of having a
  house style.
- Does it contain a `<Button>`? Note it and leave it untouched (Step 0).

## Step 2 — Apply the scroll-reveal pattern

Read `references/scroll-reveal-recipe.md` for the full implementation,
including which GSAP setup to use (`gsap.context()` + `ScrollTrigger`,
matching the cleanup pattern `ParallaxImage.tsx` already establishes — this
codebase does not use `@gsap/react`'s `useGSAP` hook anywhere yet, so don't
introduce it for a single component; match the existing manual
`useEffect`/`gsap.context`/cleanup convention instead) and worked
before/after examples against the real `WhyWeExist` and `HomeSolution`
sections.

**Titles get a different, more specific treatment than everything else.**
Every `h1`/`h2` headline in an animated section uses the masked line-stagger
reveal (see "Title reveal: masked line stagger" in the recipe doc) — the
house standard modeled on the Lenis/darkroom.engineering site: each line
slides up from fully hidden (`yPercent: 100 → 0`, no opacity change) inside
an auto-generated overflow-hidden mask, one line after another. This uses
GSAP's `SplitText` plugin (`type: "lines", mask: "lines", autoSplit: true`)
— free and bundled with `gsap@3.15+`, which this app already has installed,
so this is not a new dependency (GSAP's bonus plugins, including SplitText,
became free for everyone after the Webflow acquisition — verify the
installed `gsap` version is 3.13+ before relying on this if it's ever
downgraded). Everything else (eyebrow, paragraphs, images, cards) keeps the
plain fade-up described below, sequenced in the same timeline as the title.

For non-title content groups: they start at `opacity: 0, y: 16-24` and
animate to `opacity: 1, y: 0` over 400-600ms with `power3.out` easing once
the section scrolls into view (`ScrollTrigger` with `start: "top 80%"`,
fired once, not `scrub`), with a small stagger (0.06-0.1s) between groups if
there's more than one. This is the same shape as `MegaMenu.tsx`'s open
animation, just triggered by scroll position instead of a click.

For a section that's mostly a single large image (nothing to stagger),
a subtle scale-in (`scale: 1.05 → 1`, same duration/easing) or the existing
`ParallaxImage.tsx` scrub-parallax approach both fit — pick based on whether
the section is meant to feel like a reveal (scale-in, once) or a
continuously-scrolling depth effect (parallax, scrub).

## Step 3 — Decide GSAP vs. Framer Motion

Both are already dependencies; this app already splits responsibility
between them in `MegaMenu.tsx` itself — Framer Motion's `motion.div` handles
the simple boolean-driven height toggle (open/closed), while GSAP handles
the orchestrated multi-step content reveal inside it. Follow that split:

- **Framer Motion**: a simple, React-state-driven transition (something
  toggling based on a prop/state value — mount/unmount, boolean show/hide).
- **GSAP + ScrollTrigger (+ SplitText for titles)**: anything scroll-
  triggered, multi-step, or involving a stagger sequence — which is most of
  what this skill does, including the masked line-stagger title reveal.
  SplitText is part of the same GSAP install, not a separate tool.

Don't introduce a third animation approach (CSS `@keyframes`, a new library)
for something either existing tool already handles well.

## Step 4 — Report back

For each section: what you animated and why it earns the motion (tie it back
to a purpose — first-view reveal, guiding attention to a headline, adding
depth to an image — not "because it looked static"); the exact
duration/easing/stagger values used and that they match the house style;
confirmation of which reveal each element got (masked line-stagger for the
title vs. plain fade-up for everything else); confirmation that
`prefers-reduced-motion` is handled; and confirmation that no button inside
the section was touched. Run `npx prettier --write <file>` on anything you
touch.

## Step 5 — Lenis (only if asked)

The user may want to add Lenis for app-wide smooth scrolling underneath
these section animations. Read `references/lenis-integration.md` for the
full current setup and its interaction with `ScrollTrigger`. **This is a
one-time, app-wide architectural addition — a new dependency wrapping the
entire root layout — not something to add silently while animating a single
section.** If a task seems to call for it, propose it explicitly (what it
adds, the setup involved, that `ParallaxImage.tsx`'s existing `ScrollTrigger`
needs no code change but does need the RAF-sync wiring described in that
reference to stay perfectly in sync) and get confirmation before installing
anything.

## Never

- Don't animate buttons — no hover scale, no press feedback, no entrance
  delay on `Button.tsx` or any instance of it. This is an explicit
  boundary, not an oversight.
- Don't ship an animation without `prefers-reduced-motion` handling.
- Don't animate anything other than `transform` and `opacity` for scroll/
  entrance work — no animating `height`, `width`, `margin`, `padding`
  (Framer Motion's height toggle in `MegaMenu.tsx` is an existing, accepted
  exception for a simple disclosure — don't use that as license to animate
  layout properties elsewhere).
- Don't add a new animation dependency (a library beyond GSAP/Framer Motion,
  or Lenis) without it being an explicit, confirmed decision — see Step 5.
  `SplitText` is exempt from this since it ships inside the already-installed
  `gsap` package, not a new package.
- Don't stagger at a granularity that makes scrolling feel slow — animate
  content groups (headline, paragraph block, image), not individual words
  or characters. Line-level stagger is the one accepted exception, and only
  for titles via the masked line-stagger recipe — don't extend word/char
  splitting to body copy or other content groups.
- Don't touch components you weren't asked about, even ones that would
  clearly benefit — mention them in your report instead.

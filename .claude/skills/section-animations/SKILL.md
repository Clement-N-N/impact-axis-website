---
name: section-animations
description: Add subtle, purposeful micro-animation to a specific page section in this app — scroll-triggered reveals, staggered content entrances, gentle parallax, and masked line-stagger reveals for headings at any level (h1 through h6) — using the house motion style (grounded in Emil Kowalski's Animations on the Web principles, the Lenis/darkroom.engineering title-reveal reference, and this codebase's own existing GSAP/Framer Motion conventions). Trigger whenever asked to "animate this section", "add motion to X", "make X feel more alive", "add a scroll reveal", "animate the title/headline", or "this section feels static". Never applies to buttons — that's explicitly out of scope. Deliberately restrained: subtle over spectacular, purposeful over decorative, and always paired with prefers-reduced-motion handling, matching how this app's best-animated component (the mega menu) already does it.
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

**Every heading tag (h1 through h6) gets the same house-standard treatment:
a masked line-stagger reveal** — not just the section's primary h1/h2. This
was an open question in earlier runs of this skill (sub-headings like a CTA
block's h3, card titles, footer column headers were defaulting to a plain
fade-up instead), and it's now settled: any heading used as a section,
subsection, card, or block title gets the masked reveal, modeled directly on
the title animation used on the Lenis/darkroom.engineering site — each line
slides up from fully hidden (no fade, pure clip reveal) one after another,
rather than the plain fade-up used for non-heading content. See "Title
reveal: masked line stagger" in `references/scroll-reveal-recipe.md` for the
full recipe. Two situations still require a judgment call rather than a
blanket application — see "Headings that need a judgment call" in Step 1.

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

Also check whether `references/decisions-log.md` exists in this skill's
folder and read it before starting. It holds judgment calls made on past
runs of this skill in this specific codebase — edge cases and exceptions
that aren't general enough to fold into these main instructions yet, but are
worth knowing before you re-derive the same call from scratch. See Step 5
for how to add to it.

## Step 1 — Read the target section and its neighbors

- Is it already animated? `ParallaxImage.tsx` already has a scroll-scrubbed
  parallax; the hero variants already animate their own backgrounds/icons.
  Don't duplicate — if asked to "animate the hero," check what's already
  moving before adding more.
- What are the section's natural content groups? Most static sections here
  follow a `Container` grid with an eyebrow, a headline, one or more
  paragraphs, and sometimes an image (`WhyWeExist.tsx`, `HomeSolution.tsx`
  are both this shape). These groups are your stagger units — animate them
  as a small sequence, not every word individually. If a group is two or
  more `<p>` tags, each paragraph gets its own stagger step (see "Multiple
  paragraphs" in the recipe doc) rather than the whole block fading in at
  once.
- Does the section contain any heading tag, at any level (h1–h6)? Every
  heading gets the masked line-stagger reveal (Step 2) — this includes the
  section's primary h1/h2 as well as sub-headings, card titles, and column
  headers. Everything else in the section (eyebrow, paragraphs, image,
  cards) still uses the fade-up, sequenced in the same timeline as the
  heading(s).
- **Headings that need a judgment call, not a blanket application:**
  - A heading whose *text itself changes* via component state — a carousel
    caption that swaps every few seconds, driven by an index change (see
    `WhatWeBuildCarousel.tsx`'s h3). Re-splitting text with SplitText on
    every change can conflict with an existing crossfade transition already
    handling that swap. Default: keep the existing state-driven transition
    (usually Framer Motion, per Step 3) for a heading that changes on a
    timer or user interaction, and reserve masked-line-stagger for a
    heading's *first*, one-time scroll-into-view appearance only. Flag this
    explicitly in your report as a deliberate exception, and log it
    (Step 5) if you're not certain it's the right call for the specific
    component in front of you.
  - A repeated heading inside a list of child components that's *already*
    being staggered as a group by its parent — e.g. card titles inside a
    card grid whose parent fades the whole grid in with its own stagger
    (see `BlogCard.tsx`'s h3 inside `HomeBlog.tsx`'s staggered columns).
    Giving each repeated heading its own independent masked-line-stagger on
    top of the parent's stagger can look busy or fire out of sequence with
    its sibling content. Don't double-animate the same element with two
    reveal mechanisms — either fold the heading into the parent's plain
    fade-up (skip the mask for that specific repeated instance) or, if the
    mask is worth keeping, drive it off the *same* scroll trigger as its
    sibling card content so they arrive together. Flag which choice you
    made and why.
- What animates immediately before/after it on the page? A section shouldn't
  introduce a jarringly different motion feel than its neighbors. If the
  section above it uses a 0.4s power3.out fade-up, don't give the next one a
  1s bounce — consistency across sections is the whole point of having a
  house style.
- Does it contain a `<Button>`? Note it and leave it untouched (Step 0).
- **Is this a long-form text page rather than a marketing content section**
  — a legal/compliance page (terms of use, privacy policy), documentation,
  or any page that's mostly a long sequence of body-text sections rather
  than a handful of designed content groups? Default to *not* adding
  scroll-reveal animation here, even though it technically has headings and
  static content. Applying masked-line-stagger and fade-up to a dozen-plus
  sequential sections violates this skill's own "restrained, not
  everywhere" principle, and — more importantly — the initial
  `opacity: 0`/`yPercent: 100` state creates a real content-availability
  risk if a user deep-links to a mid-page section anchor before the
  animation's `ScrollTrigger` and SplitText have run. Treat this as a
  distinct page category exempt from this skill by default; only animate
  it if explicitly asked, and if so, limit it to the page header (title +
  intro), not every section.

## Step 2 — Apply the scroll-reveal pattern

Read `references/scroll-reveal-recipe.md` for the full implementation,
including which GSAP setup to use (`gsap.context()` + `ScrollTrigger`,
matching the cleanup pattern `ParallaxImage.tsx` already establishes — this
codebase does not use `@gsap/react`'s `useGSAP` hook anywhere yet, so don't
introduce it for a single component; match the existing manual
`useEffect`/`gsap.context`/cleanup convention instead) and worked
before/after examples against the real `WhyWeExist` and `HomeSolution`
sections.

**Every heading, at any level, gets a different, more specific treatment
than everything else.** Each uses the masked line-stagger reveal (see
"Title reveal: masked line stagger" in the recipe doc) — the house standard
modeled on the Lenis/darkroom.engineering site: each line slides up from
fully hidden (`yPercent: 100 → 0`, no opacity change) inside an
auto-generated overflow-hidden mask, one line after another. This uses
GSAP's `SplitText` plugin (`type: "lines", mask: "lines", autoSplit: true`)
— free and bundled with `gsap@3.15+`, which this app already has installed,
so this is not a new dependency (GSAP's bonus plugins, including SplitText,
became free for everyone after the Webflow acquisition — verify the
installed `gsap` version is 3.13+ before relying on this if it's ever
downgraded). Everything else (eyebrow, paragraphs, images, cards) keeps the
plain fade-up described below, sequenced in the same timeline as the
heading(s).

For non-heading content groups: they start at `opacity: 0, y: 16-24` and
animate to `opacity: 1, y: 0` over 400-600ms with `power3.out` easing once
the section scrolls into view (`ScrollTrigger` with `start: "top 80%"`,
fired once, not `scrub`), with a small stagger (0.06-0.1s) between distinct
groups (eyebrow, paragraph block, image) if there's more than one. This is
the same shape as `MegaMenu.tsx`'s open animation, just triggered by scroll
position instead of a click. If a section has more than four or five
distinct fade groups (e.g. a footer with a heading, paragraph, form,
copyright, link grid, address, socials, and legal row), don't just keep
stacking 0.08s stagger steps — a 7-8 item stagger at 0.08s each adds up to
over half a second of staggered delay before the last item arrives, which
reads as slow rather than restrained. Either keep the per-item stagger but
trim the number of distinct groups (combine visually-adjacent elements into
one fade target), or reduce the stagger interval for that specific section
and say so in your report.

**When a group is itself multiple paragraphs, stagger each paragraph
individually at a slower interval than the group stagger** — `0.18s`, not
0.08s. See "Multiple paragraphs: stagger each one, not the block" in
`references/scroll-reveal-recipe.md`. At the 0.08s group-level pace,
several paragraphs finish staggering in well under a quarter second and
read as one simultaneous block regardless of the per-child split — too
fast to register as a stagger at all.

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
  toggling based on a prop/state value — mount/unmount, boolean show/hide,
  an active-index swap like a carousel's per-slide content crossfade or
  progress bar). If a component you're adding scroll-reveal to already uses
  Framer Motion for this kind of state-driven transition (see
  `WhatWeBuildCarousel.tsx`, `TestimonialsCarousel.tsx`,
  `FaqAccordionItem.tsx`), leave that usage in place — don't rewrite
  existing, working Framer Motion into GSAP just because the new work you're
  adding is GSAP. The two are meant to coexist here, each doing the job it's
  suited for; only touch the existing Framer Motion code to add
  `prefers-reduced-motion` gating if it's missing.
- **GSAP + ScrollTrigger (+ SplitText for headings)**: anything scroll-
  triggered, multi-step, or involving a stagger sequence — which is most of
  what this skill does, including the masked line-stagger heading reveal.
  SplitText is part of the same GSAP install, not a separate tool.

Don't introduce a third animation approach (CSS `@keyframes`, a new library)
for something either existing tool already handles well.

## Step 4 — Report back

For each section: what you animated and why it earns the motion (tie it back
to a purpose — first-view reveal, guiding attention to a headline, adding
depth to an image — not "because it looked static"); the exact
duration/easing/stagger values used and that they match the house style;
confirmation of which reveal each element got (masked line-stagger for every
heading vs. plain fade-up for everything else), including which of the two
judgment-call heading cases from Step 1 applied, if any; confirmation that
`prefers-reduced-motion` is handled; and confirmation that no button inside
the section was touched.

**If adding this animation required converting a server component to a
client component** (adding `"use client"` where there wasn't one, so the
component can use `useRef`/`useEffect` and GSAP's browser APIs), say so
explicitly and note the tradeoff: the component now ships its own JS to the
browser and adds to hydration cost, and can no longer do direct server-side
`await` data fetching inside itself. If the component is purely static
(reads from a local `data.ts`, like most sections in this app), the cost is
just bundle size/hydration — worth a one-line mention, not a blocker. If the
component *does* fetch data (or is likely to move to Sanity-backed content
later, per the pattern in `home-testimonials/index.tsx` and
`home-faq/index.tsx`), propose the alternative instead of silently
converting the whole thing: keep it a server component that fetches/prepares
data, and extract just the animated wrapper into a small client child that
receives the rendered content as props/children — the same server-shell +
client-island split those two sections already use.

Run `npx prettier --write <file>` on anything you touch.

## Step 5 — Log new judgment calls for next time

If you made any judgment call, hit any ambiguity, or found any new pattern
in this run that isn't already covered by this skill or its reference docs,
append a short dated entry to `references/decisions-log.md` (create the
file if it doesn't exist). Keep each entry terse — what the situation was,
what you decided and why, and which file(s) it applied to. A few lines is
enough; this is not a full report.

This log is how the skill gets sharper and more tailored to this specific
project over repeated use, without these main instructions ballooning with
one-off cases. If you notice the same kind of entry showing up three or more
times in the log, that's a signal it should graduate from the log into the
main skill instructions above — mention this in your report if you spot it.

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
  or Lenis) without it being an explicit, confirmed decision — see Step 6
  (Lenis, below). `SplitText` is exempt from this since it ships inside the
  already-installed `gsap` package, not a new package.
- Don't stagger at a granularity that makes scrolling feel slow — animate
  content groups (headline, paragraphs, image), not individual words or
  characters. Line-level stagger is accepted for headings at every level via
  the masked line-stagger recipe; paragraph-level stagger (one step per
  `<p>`, `0.18s` apart) is accepted for multi-paragraph groups. Don't extend
  word/char splitting to body copy, and don't split a single paragraph's own
  text into smaller staggered pieces.
- Don't animate long-form text pages (legal, documentation) by default —
  see the last bullet in Step 1.
- Don't touch components you weren't asked about, even ones that would
  clearly benefit — mention them in your report instead.

## Step 6 — Lenis (only if asked)

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
